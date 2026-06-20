from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from typing import List, Optional
import uuid

from ..models.schemas import (
    AddCandidateRequest, AddCandidateResponse, FusedCandidate, 
    JobCreate, Job, MatchRequest, MatchResult, DashboardStats
)
from ..services.github_analyzer import GitHubAnalyzer
from ..services.linkedin_parser import LinkedInParser
from ..services.resume_parser import ResumeParser
from ..services.profile_fusion import ProfileFusionService
from ..services.matching_engine import MatchingEngine
from ..services.explainability import ExplainabilityService
from ..data.seed_candidates import SEED_CANDIDATES

router = APIRouter()

# Initialize Services
gh_analyzer = GitHubAnalyzer()
li_parser = LinkedInParser()
re_parser = ResumeParser()
fusion_service = ProfileFusionService()
matcher = MatchingEngine()
explainer = ExplainabilityService()

# In-memory database for demo
DB_CANDIDATES: dict[str, FusedCandidate] = SEED_CANDIDATES.copy()
DB_JOBS: dict[str, Job] = {}

# ──────────────────────────────────────────────
# Candidate Endpoints
# ──────────────────────────────────────────────

@router.post("/candidates/add", response_model=AddCandidateResponse)
async def add_candidate(
    github_url: Optional[str] = Form(None),
    linkedin_url: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None)
):
    """
    The core Multi-Source Intake endpoint.
    Processes GitHub, LinkedIn (simulated via URL for demo, or PDF in future), and Resume PDF.
    """
    candidate_id = str(uuid.uuid4())
    
    gh_profile = None
    li_profile = None
    re_profile = None
    
    # 1. Process GitHub
    if github_url:
        gh_profile = await gh_analyzer.analyze_profile(github_url)
        
    # 2. Process Resume
    if resume:
        pdf_bytes = await resume.read()
        re_profile = re_parser.parse_resume(pdf_bytes)
        
    # 3. Process LinkedIn (Mock/Fallback for form URL)
    # In a full setup, we'd accept a LinkedIn PDF export here instead of a URL
    if linkedin_url:
        # Just returning an empty/mock profile if only URL is provided
        li_profile = None 

    # 4. Fuse Profiles & Calculate Verification Score
    fused = fusion_service.fuse_profiles(
        candidate_id=candidate_id,
        github=gh_profile,
        linkedin=li_profile,
        resume=re_profile
    )
    
    # Save to DB
    DB_CANDIDATES[candidate_id] = fused
    
    return AddCandidateResponse(candidate=fused)

@router.get("/candidates", response_model=List[FusedCandidate])
async def list_candidates():
    """List all fused candidates."""
    return list(DB_CANDIDATES.values())

@router.get("/candidates/{candidate_id}", response_model=FusedCandidate)
async def get_candidate(candidate_id: str):
    """Get detailed candidate intelligence profile."""
    if candidate_id not in DB_CANDIDATES:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return DB_CANDIDATES[candidate_id]

# ──────────────────────────────────────────────
# Job Endpoints
# ──────────────────────────────────────────────

@router.post("/jobs/create", response_model=Job)
async def create_job(job_in: JobCreate):
    """Create a new job requirement (would use AI to extract skills from desc)."""
    job_id = str(uuid.uuid4())
    job = Job(**job_in.model_dump(), id=job_id)
    DB_JOBS[job_id] = job
    return job

@router.get("/jobs", response_model=List[Job])
async def list_jobs():
    return list(DB_JOBS.values())

# ──────────────────────────────────────────────
# Matching Endpoints
# ──────────────────────────────────────────────

@router.post("/match/{job_id}", response_model=List[MatchResult])
async def match_job(job_id: str):
    """
    Run the 6-Signal Matching Engine for a job against all candidates.
    Generates explainability text for the top matches.
    """
    if job_id not in DB_JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job = DB_JOBS[job_id]
    results = []
    
    for cand in DB_CANDIDATES.values():
        match = matcher.match(cand, job)
        # For demo speed, only run full AI explainability on top scores or just return fallback
        match = explainer.generate_explanation(match, job)
        results.append(match)
        
    # Sort by overall score
    results.sort(key=lambda x: x.overall_score, reverse=True)
    
    # Update job match count
    job.candidates_matched = len(results)
    
    return results

# ──────────────────────────────────────────────
# Dashboard Endpoints
# ──────────────────────────────────────────────

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_stats():
    """Returns KPIs for the recruiter dashboard."""
    stats = DashboardStats(
        candidates_analyzed=len(DB_CANDIDATES),
        active_jobs=len(DB_JOBS),
        github_profiles_scanned=sum(1 for c in DB_CANDIDATES.values() if c.github_profile),
        cross_verified=sum(1 for c in DB_CANDIDATES.values() if c.cross_source),
        hidden_gems_found=sum(1 for c in DB_CANDIDATES.values() if c.hidden_gem)
    )
    
    if stats.candidates_analyzed > 0:
        # Mock average match rate
        stats.avg_match_rate = 74.5
        
    return stats
