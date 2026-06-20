from ..models.schemas import FusedCandidate, Job, MatchResult, ScoreBreakdown
from .skill_extractor import SkillExtractor
from .profile_fusion import VerificationStatus

class MatchingEngine:
    """Implements the 6-Signal Scoring Algorithm."""
    
    def __init__(self):
        self.skill_ext = SkillExtractor()
        
        # 6-Signal Weights
        self.weights = {
            "semantic_similarity": 0.25,
            "skill_transferability": 0.20,
            "career_growth": 0.15,
            "code_quality": 0.15,
            "cross_source_verification": 0.15,
            "hidden_potential": 0.10,
        }

    def match(self, candidate: FusedCandidate, job: Job) -> MatchResult:
        """Scores a candidate against a job description across 6 dimensions."""
        
        breakdown = ScoreBreakdown()
        
        # 1 & 2. Semantic Similarity & Transferability
        matched = []
        partial = []
        missing = []
        
        sim_score_sum = 0
        transfer_score_sum = 0
        
        req_skills = job.required_skills
        if not req_skills:
            req_skills = []
            
        for req in req_skills:
            sim = self.skill_ext.calculate_similarity(candidate.skill_names, req)
            if sim == 1.0:
                matched.append(req)
                sim_score_sum += 100
                transfer_score_sum += 100
            elif sim >= 0.8:
                partial.append(req)
                sim_score_sum += (sim * 100)
                transfer_score_sum += 100 # They have a highly transferable skill
            elif sim > 0:
                partial.append(req)
                sim_score_sum += (sim * 100)
                transfer_score_sum += 50
            else:
                missing.append(req)
                
        req_len = len(req_skills) if req_skills else 1
        breakdown.semantic_similarity = sim_score_sum / req_len
        breakdown.skill_transferability = transfer_score_sum / req_len

        # 3. Career Growth Velocity
        breakdown.career_growth = candidate.growth_score

        # 4. Code Quality & Activity (GitHub)
        if candidate.github_profile:
            # Simple heuristic for demo: combination of repos, commits, and stars
            gh = candidate.github_profile
            activity_score = min((gh.public_repos * 2) + (gh.stars_received * 5) + (gh.followers * 2), 100)
            breakdown.code_quality = max(activity_score, 40) # Floor so they aren't totally penalized for quiet githubs
        else:
            breakdown.code_quality = 50 # Neutral baseline if no GitHub provided

        # 5. Cross-Source Verification
        if candidate.cross_source:
            breakdown.cross_source_verification = candidate.cross_source.overall_score
        else:
            breakdown.cross_source_verification = 50 # Neutral

        # 6. Hidden Potential
        potential_score = 50
        if candidate.cross_source and candidate.cross_source.status == VerificationStatus.UNDERSTATED:
            potential_score = 95 # High potential if they are humble on resume but great on GitHub
        elif candidate.growth_score > 80 and breakdown.semantic_similarity < 60:
            potential_score = 90 # High potential: fast learner even if they don't know the exact stack yet
        breakdown.hidden_potential = potential_score

        # Calculate Overall Score
        overall = (
            (breakdown.semantic_similarity * self.weights["semantic_similarity"]) +
            (breakdown.skill_transferability * self.weights["skill_transferability"]) +
            (breakdown.career_growth * self.weights["career_growth"]) +
            (breakdown.code_quality * self.weights["code_quality"]) +
            (breakdown.cross_source_verification * self.weights["cross_source_verification"]) +
            (breakdown.hidden_potential * self.weights["hidden_potential"])
        )

        return MatchResult(
            candidate=candidate,
            overall_score=round(overall, 1),
            breakdown=breakdown,
            matched_skills=matched,
            partial_skills=partial,
            missing_skills=missing,
            evidence_sources=candidate.sources_provided,
            is_hidden_gem=potential_score > 85,
            hidden_gem_reason="Candidate exhibits rapid career growth and highly transferable skills despite keyword mismatches." if potential_score > 85 else None
        )
