from typing import List, Dict, Set
from ..models.schemas import (
    FusedCandidate, GitHubProfile, LinkedInProfile, ResumeProfile, 
    SkillEvidence, CrossSourceVerification, VerificationStatus, SourceType
)

class ProfileFusionService:
    """
    Merges GitHub, LinkedIn, and Resume data into a single unified profile.
    Calculates the Cross-Source Verification Score.
    """
    
    def _normalize_skill(self, skill: str) -> str:
        """Simple normalization for deduplication."""
        return skill.strip().lower()

    def fuse_profiles(self, 
                      candidate_id: str,
                      github: GitHubProfile | None = None, 
                      linkedin: LinkedInProfile | None = None, 
                      resume: ResumeProfile | None = None) -> FusedCandidate:
        """Merges all available sources into a FusedCandidate profile."""
        
        # 1. Determine basic info (prefer LinkedIn > Resume > GitHub)
        name = ""
        email = ""
        title = ""
        location = ""
        
        if github:
            name = github.name or github.username
        if resume:
            name = resume.name or name
            email = resume.email or email
            location = resume.location or location
            if resume.experience:
                title = resume.experience[0].title
        if linkedin:
            name = linkedin.name or name
            title = linkedin.headline or title
            location = linkedin.location or location

        sources = []
        if github: sources.append(SourceType.GITHUB)
        if linkedin: sources.append(SourceType.LINKEDIN)
        if resume: sources.append(SourceType.RESUME)

        fused = FusedCandidate(
            id=candidate_id,
            name=name or "Unknown Candidate",
            email=email,
            title=title,
            location=location,
            sources_provided=sources
        )

        if github: fused.github_profile = github
        if linkedin: fused.linkedin_profile = linkedin
        if resume: fused.resume_profile = resume

        # 2. Merge Skills & Build Evidence Map
        skill_map: Dict[str, SkillEvidence] = {}

        # Add Resume Skills
        if resume:
            for s in resume.skills:
                norm = self._normalize_skill(s)
                if norm not in skill_map:
                    skill_map[norm] = SkillEvidence(skill=s)
                skill_map[norm].from_resume = True

        # Add LinkedIn Skills
        if linkedin:
            for s in linkedin.skills:
                norm = self._normalize_skill(s)
                if norm not in skill_map:
                    skill_map[norm] = SkillEvidence(skill=s)
                skill_map[norm].from_linkedin = True
                skill_map[norm].linkedin_endorsed = True

        # Add GitHub Skills (Languages + Frameworks + Tech Tree)
        if github:
            gh_skills = list(set(list(github.languages.keys()) + github.frameworks + github.skills_from_deps + github.tech_tree))
            for s in gh_skills:
                norm = self._normalize_skill(s)
                if norm not in skill_map:
                    skill_map[norm] = SkillEvidence(skill=s)
                skill_map[norm].from_github = True
                
                # Estimate confidence from GitHub (e.g. if it's a primary language)
                if norm in [self._normalize_skill(k) for k in github.languages.keys()]:
                    skill_map[norm].github_commits_estimate += 50 # rough heuristic

        # Finalize skills
        fused.all_skills = list(skill_map.values())
        fused.skill_names = [s.skill for s in fused.all_skills]

        # Seniority & Humility Gap check
        if github and github.seniority_score >= 30:
            fused.hidden_gem = True
            fused.hidden_gem_reason = "Enterprise Architecture Depth: GitHub repositories demonstrate advanced engineering standards (CI/CD pipelines, Docker containerization, and comprehensive unit test suites)."

        # 3. Calculate Cross-Source Verification
        fused.cross_source = self._calculate_verification(skill_map, sources)

        # 4. Merge Experience/Trajectory (Prefer LinkedIn, fallback to Resume)
        if linkedin and linkedin.experience:
            fused.total_experience_years = self._calc_total_exp(linkedin.experience)
            fused.career_trajectory = [e.model_dump() for e in linkedin.experience]
            fused.growth_score = linkedin.career_velocity * 100
        elif resume and resume.experience:
            fused.total_experience_years = resume.total_experience_years
            fused.career_trajectory = [e.model_dump() for e in resume.experience]
            # Estimate growth score from resume if needed
            fused.growth_score = 65.0 

        # 5. Extract Projects (Prefer Resume, enrich with GitHub)
        if resume:
            fused.projects = resume.projects

        return fused

    def _calc_total_exp(self, experience_list) -> float:
        """Rough calculation of total years of experience."""
        if not experience_list: return 0.0
        
        # Sort chronologically
        sorted_exp = sorted([e for e in experience_list if e.start_year], key=lambda x: x.start_year)
        if not sorted_exp: return 0.0
        
        first_year = sorted_exp[0].start_year
        # Use current year if end_year is None (present)
        last_year = max([e.end_year or 2026 for e in sorted_exp]) 
        
        return float(last_year - first_year)

    def _calculate_verification(self, skill_map: Dict[str, SkillEvidence], sources: List[SourceType]) -> CrossSourceVerification:
        """Calculates verification score and identifies hidden gems or overstated claims."""
        
        cv = CrossSourceVerification()
        
        if len(sources) < 2:
            cv.status = VerificationStatus.UNVERIFIED
            cv.highlights.append("Not enough sources provided for cross-verification.")
            return cv

        verified = []
        understated = []
        overstated = []
        unverified = []

        has_resume = SourceType.RESUME in sources
        has_github = SourceType.GITHUB in sources

        for norm, ev in skill_map.items():
            # Verified: Claimed on resume AND found in GitHub
            if ev.from_resume and ev.from_github:
                verified.append(ev.skill)
            
            # Understated (Hidden Gem): Found in GitHub but NOT claimed on Resume
            elif not ev.from_resume and ev.from_github and has_resume:
                understated.append(ev.skill)
                
            # Overstated (Potential Warning): Claimed on Resume but NO evidence in GitHub
            # (Note: Only applies to technical/coding skills. Soft skills naturally won't be in GitHub)
            elif ev.from_resume and not ev.from_github and has_github:
                # In a real app, we'd filter this to only penalize missing *technical* skills
                overstated.append(ev.skill)
            
            else:
                unverified.append(ev.skill)

        cv.verified_skills = verified
        cv.understated_skills = understated
        cv.overstated_skills = overstated
        cv.unverified_skills = unverified

        # Calculate Score
        total_claims = len(verified) + len(overstated)
        if total_claims == 0:
            cv.overall_score = 50.0 # Neutral
        else:
            # High score if high percentage of resume claims are verified by GitHub
            verification_ratio = len(verified) / total_claims
            cv.overall_score = verification_ratio * 100

        # Determine Status
        if len(understated) > 3 and cv.overall_score > 60:
            cv.status = VerificationStatus.UNDERSTATED
            cv.highlights.append(f"Hidden Gem: GitHub proves {len(understated)} skills not mentioned on resume.")
        elif cv.overall_score > 75:
            cv.status = VerificationStatus.VERIFIED
            cv.highlights.append(f"Highly Verified: {len(verified)} skills confirmed across multiple sources.")
        elif cv.overall_score < 40 and has_github:
            cv.status = VerificationStatus.OVERSTATED
            cv.highlights.append(f"Warning: Several resume skills lack evidence in GitHub profile.")
        else:
            cv.status = VerificationStatus.PARTIAL

        return cv
