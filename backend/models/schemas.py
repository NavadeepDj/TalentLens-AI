"""
TalentLens AI — Pydantic Models
All request/response schemas for the API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


# ──────────────────────────────────────────────
# Enums
# ──────────────────────────────────────────────

class VerificationStatus(str, Enum):
    VERIFIED = "verified"
    UNDERSTATED = "understated"      # GitHub proves more than resume says
    OVERSTATED = "overstated"        # Resume claims more than GitHub shows
    UNVERIFIED = "unverified"        # Not enough cross-source data
    PARTIAL = "partial"              # Some claims verified, some not


class SourceType(str, Enum):
    GITHUB = "github"
    LINKEDIN = "linkedin"
    RESUME = "resume"


# ──────────────────────────────────────────────
# GitHub Models
# ──────────────────────────────────────────────

class GitHubRepo(BaseModel):
    name: str
    description: Optional[str] = None
    language: Optional[str] = None
    stars: int = 0
    forks: int = 0
    topics: list[str] = Field(default_factory=list)
    extracted_skills: list[str] = Field(default_factory=list)
    dependencies_extracted: list[str] = Field(default_factory=list)
    has_cicd: bool = False
    has_docker: bool = False
    has_tests: bool = False
    complexity_score: int = 0
    is_fork: bool = False
    updated_at: Optional[str] = None


class GitHubProfile(BaseModel):
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    public_repos: int = 0
    followers: int = 0
    following: int = 0
    account_created: Optional[str] = None
    languages: dict[str, float] = Field(default_factory=dict)        # {Python: 45.2, JavaScript: 30.1, ...}
    frameworks: list[str] = Field(default_factory=list)              # [FastAPI, React, Docker, ...]
    top_repos: list[GitHubRepo] = Field(default_factory=list)
    contribution_count: int = 0
    open_source_contributions: int = 0                                # PRs to other repos
    stars_received: int = 0
    skills_from_deps: list[str] = Field(default_factory=list)        # From package.json, requirements.txt
    skills_from_readmes: list[str] = Field(default_factory=list)     # AI-extracted from READMEs
    tech_tree: list[str] = Field(default_factory=list)               # Flattened engineering tech tree
    seniority_score: int = 0                                          # Based on CI/CD + Docker + Tests
    humility_gap_detected: bool = False                               # Quiet Builder ⭐
    humility_gap_reason: Optional[str] = None


# ──────────────────────────────────────────────
# LinkedIn Models
# ──────────────────────────────────────────────

class LinkedInExperience(BaseModel):
    title: str
    company: str
    duration: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None       # None = present
    description: Optional[str] = None
    level: int = 1                        # 1=intern, 2=junior, 3=mid, 4=senior, 5=lead, 6=principal


class LinkedInEducation(BaseModel):
    degree: str
    institution: str
    year: Optional[int] = None
    field_of_study: Optional[str] = None


class LinkedInProfile(BaseModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    summary: Optional[str] = None
    location: Optional[str] = None
    experience: list[LinkedInExperience] = Field(default_factory=list)
    education: list[LinkedInEducation] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    career_velocity: float = 0.0          # levels_gained / years


# ──────────────────────────────────────────────
# Resume Models
# ──────────────────────────────────────────────

class ResumeProject(BaseModel):
    name: str
    description: str
    extracted_skills: list[str] = Field(default_factory=list)


class ResumeExperience(BaseModel):
    title: str
    company: str
    duration: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    description: Optional[str] = None


class ResumeProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    skills: list[str] = Field(default_factory=list)
    experience: list[ResumeExperience] = Field(default_factory=list)
    education: list[LinkedInEducation] = Field(default_factory=list)
    projects: list[ResumeProject] = Field(default_factory=list)
    total_experience_years: float = 0.0


# ──────────────────────────────────────────────
# Skill DNA (Merged from all sources)
# ──────────────────────────────────────────────

class SkillEvidence(BaseModel):
    """Evidence for a single skill from all sources."""
    skill: str
    from_resume: bool = False
    from_github: bool = False
    from_linkedin: bool = False
    github_repos_count: int = 0           # Number of repos using this skill
    github_commits_estimate: int = 0      # Rough commit count
    linkedin_endorsed: bool = False
    confidence: float = 0.0               # 0-1, how confident we are in this skill


class CrossSourceVerification(BaseModel):
    overall_score: float = 0.0            # 0-100
    status: VerificationStatus = VerificationStatus.UNVERIFIED
    verified_skills: list[str] = Field(default_factory=list)
    understated_skills: list[str] = Field(default_factory=list)   # In GitHub but not resume
    overstated_skills: list[str] = Field(default_factory=list)    # In resume but not GitHub
    unverified_skills: list[str] = Field(default_factory=list)
    highlights: list[str] = Field(default_factory=list)           # Key findings


# ──────────────────────────────────────────────
# Fused Candidate Profile
# ──────────────────────────────────────────────

class FusedCandidate(BaseModel):
    id: Optional[str] = None
    name: str
    email: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    avatar_color: str = "linear-gradient(135deg, #00D4FF, #7C3AED)"

    # Sources
    github_profile: Optional[GitHubProfile] = None
    linkedin_profile: Optional[LinkedInProfile] = None
    resume_profile: Optional[ResumeProfile] = None
    sources_provided: list[SourceType] = Field(default_factory=list)

    # Merged intelligence
    all_skills: list[SkillEvidence] = Field(default_factory=list)
    skill_names: list[str] = Field(default_factory=list)          # Flat skill list
    total_experience_years: float = 0.0
    career_trajectory: list[dict] = Field(default_factory=list)
    projects: list[ResumeProject] = Field(default_factory=list)
    education: str = ""

    # Scores
    growth_score: float = 0.0
    cross_source: Optional[CrossSourceVerification] = None
    hidden_gem: bool = False
    hidden_gem_reason: Optional[str] = None


# ──────────────────────────────────────────────
# Match Results
# ──────────────────────────────────────────────

class ScoreBreakdown(BaseModel):
    semantic_similarity: float = 0.0
    skill_transferability: float = 0.0
    career_growth: float = 0.0
    code_quality: float = 0.0
    cross_source_verification: float = 0.0
    hidden_potential: float = 0.0


class MatchResult(BaseModel):
    candidate: FusedCandidate
    overall_score: float = 0.0
    breakdown: ScoreBreakdown = Field(default_factory=ScoreBreakdown)
    matched_skills: list[str] = Field(default_factory=list)
    partial_skills: list[str] = Field(default_factory=list)       # Transferable skills
    missing_skills: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    evidence_sources: list[SourceType] = Field(default_factory=list)
    is_hidden_gem: bool = False
    hidden_gem_reason: Optional[str] = None


# ──────────────────────────────────────────────
# Job Models
# ──────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    company: str = ""
    location: str = ""
    description: str
    required_skills: list[str] = Field(default_factory=list)
    nice_to_have: list[str] = Field(default_factory=list)
    experience_range: str = ""


class Job(JobCreate):
    id: Optional[str] = None
    status: str = "active"
    candidates_matched: int = 0
    created_at: Optional[str] = None


# ──────────────────────────────────────────────
# API Request/Response Models
# ──────────────────────────────────────────────

class AddCandidateRequest(BaseModel):
    github_url: Optional[str] = None
    linkedin_data: Optional[dict] = None   # Manual form data OR parsed PDF result
    # resume is uploaded as file, not in JSON body


class AddCandidateResponse(BaseModel):
    candidate: FusedCandidate
    message: str = "Candidate profile built successfully"


class MatchRequest(BaseModel):
    job_id: str


class DashboardStats(BaseModel):
    candidates_analyzed: int = 0
    active_jobs: int = 0
    avg_match_rate: float = 0.0
    hidden_gems_found: int = 0
    github_profiles_scanned: int = 0
    cross_verified: int = 0
