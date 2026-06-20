from typing import List
from ..models.schemas import FusedCandidate, Job, MatchResult
from .matching_engine import MatchingEngine

class DiscoveryService:
    """
    Finds candidates similar to a top performer or discovers 'hidden gems'.
    """
    
    def __init__(self):
        self.matcher = MatchingEngine()
        
    def find_similar(self, source_candidate: FusedCandidate, all_candidates: List[FusedCandidate]) -> List[MatchResult]:
        """
        Treats the source candidate's profile as the 'Job Requirement' and scores 
        all other candidates against it to find patterns.
        """
        
        # 1. Build a synthetic job description based on the source candidate
        synthetic_job = Job(
            title=f"Like {source_candidate.name}",
            description="Finding candidates matching this profile.",
            required_skills=source_candidate.skill_names[:5], # Top 5 skills
            nice_to_have=source_candidate.skill_names[5:10],
            experience_range=f"{max(0, source_candidate.total_experience_years - 2)}-{source_candidate.total_experience_years + 2} years"
        )
        
        # 2. Score everyone against this synthetic job
        results = []
        for cand in all_candidates:
            if cand.id == source_candidate.id:
                continue # Skip self
                
            match = self.matcher.match(cand, synthetic_job)
            
            # Boost the score if they share similar growth velocity
            growth_diff = abs(cand.growth_score - source_candidate.growth_score)
            if growth_diff < 15:
                match.overall_score = min(match.overall_score + 5, 100)
                
            results.append(match)
            
        # 3. Sort and return top
        results.sort(key=lambda x: x.overall_score, reverse=True)
        return results[:10]

    def find_hidden_gems(self, all_candidates: List[FusedCandidate]) -> List[FusedCandidate]:
        """Returns candidates specifically flagged as high potential / hidden gems."""
        return [c for c in all_candidates if c.hidden_gem or c.cross_source and c.cross_source.status == "understated"]
