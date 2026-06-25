from backend.models.schemas import FusedCandidate, GitHubProfile, LinkedInProfile, LinkedInExperience, ResumeProfile, ResumeProject, SkillEvidence, CrossSourceVerification, VerificationStatus, SourceType
import uuid
import sys
import os

# Ensure the backend directory is in the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def create_seed_candidates() -> dict[str, FusedCandidate]:
    db = {}
    
    # ───────────────────────────────────────────────────────────
    # Candidate 1: The Verified Expert
    # ───────────────────────────────────────────────────────────
    id1 = str(uuid.uuid4())
    db[id1] = FusedCandidate(
        id=id1,
        name="Priya Sharma",
        email="priya.sharma@email.com",
        title="Senior Backend Engineer",
        location="Bengaluru, India",
        avatar_color="linear-gradient(135deg, #00D4FF, #7C3AED)",
        sources_provided=[SourceType.GITHUB, SourceType.LINKEDIN, SourceType.RESUME],
        total_experience_years=6.0,
        growth_score=85.0,
        hidden_gem=False,
        skill_names=["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
        all_skills=[
            SkillEvidence(skill="Python", from_resume=True, from_github=True, github_commits_estimate=800),
            SkillEvidence(skill="FastAPI", from_resume=True, from_github=True, github_commits_estimate=200),
        ],
        github_profile=GitHubProfile(
            username="priya-s",
            public_repos=24,
            followers=120,
            languages={"Python": 65.0, "JavaScript": 20.0, "Go": 15.0},
            frameworks=["FastAPI", "Django"],
            stars_received=45,
            tech_tree=["python", "fastapi", "django", "postgresql", "docker", "aws"],
            seniority_score=45
        ),
        cross_source=CrossSourceVerification(
            overall_score=95.0,
            status=VerificationStatus.VERIFIED,
            verified_skills=["Python", "FastAPI"],
            highlights=["GitHub confirms Python expertise claimed in resume (24 repos)"]
        )
    )

    # ───────────────────────────────────────────────────────────
    # Candidate 2: The Understated Gem (Hidden Gem)
    # ───────────────────────────────────────────────────────────
    id2 = str(uuid.uuid4())
    db[id2] = FusedCandidate(
        id=id2,
        name="Arjun Menon",
        email="arjun.m@email.com",
        title="Backend Developer",
        location="Hyderabad, India",
        avatar_color="linear-gradient(135deg, #7C3AED, #F472B6)",
        sources_provided=[SourceType.GITHUB, SourceType.RESUME],
        total_experience_years=3.0,
        growth_score=92.0,
        hidden_gem=True,
        hidden_gem_reason="Quiet Builder ⭐: GitHub AST scan uncovered 3 enterprise repositories with Docker containerization, Pytest suites, and Redis caching. Resume omits these architectural competencies.",
        skill_names=["Python", "Flask", "FastAPI", "Docker"],
        all_skills=[
            SkillEvidence(skill="Flask", from_resume=True, from_github=True),
            SkillEvidence(skill="FastAPI", from_resume=False, from_github=True, github_commits_estimate=150),
        ],
        github_profile=GitHubProfile(
            username="arjun-codes",
            public_repos=42,
            followers=250,
            languages={"Python": 80.0, "TypeScript": 20.0},
            frameworks=["FastAPI", "Flask", "React"],
            stars_received=320,
            open_source_contributions=15,
            tech_tree=["fastapi", "docker", "redis", "celery", "pytest", "typescript", "react"],
            seniority_score=50,
            humility_gap_detected=True,
            humility_gap_reason="GitHub reveals deep production architecture standards (Docker, Pytest, Celery) missing from resume."
        ),
        cross_source=CrossSourceVerification(
            overall_score=85.0,
            status=VerificationStatus.UNDERSTATED,
            understated_skills=["FastAPI", "TypeScript", "React"],
            highlights=["Hidden Gem: GitHub proves FastAPI expertise not mentioned on resume"]
        )
    )

    # ───────────────────────────────────────────────────────────
    # Candidate 3: The Overstated Candidate (Warning)
    # ───────────────────────────────────────────────────────────
    id3 = str(uuid.uuid4())
    db[id3] = FusedCandidate(
        id=id3,
        name="Rahul Gupta",
        email="rahul.g@email.com",
        title="Software Engineer",
        location="Delhi, India",
        avatar_color="linear-gradient(135deg, #F59E0B, #EF4444)",
        sources_provided=[SourceType.GITHUB, SourceType.RESUME],
        total_experience_years=2.0,
        growth_score=50.0,
        hidden_gem=False,
        skill_names=["Python", "Kubernetes", "AWS", "Machine Learning"],
        all_skills=[
            SkillEvidence(skill="Machine Learning", from_resume=True, from_github=False),
            SkillEvidence(skill="Kubernetes", from_resume=True, from_github=False),
            SkillEvidence(skill="Python", from_resume=True, from_github=True),
        ],
        github_profile=GitHubProfile(
            username="rahul-dev",
            public_repos=2,
            followers=1,
            languages={"HTML": 60.0, "Python": 40.0},
            stars_received=0
        ),
        cross_source=CrossSourceVerification(
            overall_score=33.0,
            status=VerificationStatus.OVERSTATED,
            overstated_skills=["Kubernetes", "Machine Learning", "AWS"],
            highlights=["Warning: Advanced skills claimed on resume lack evidence in GitHub profile (2 repos, mostly HTML)"]
        )
    )

    return db

# Expose to other modules
SEED_CANDIDATES = create_seed_candidates()
