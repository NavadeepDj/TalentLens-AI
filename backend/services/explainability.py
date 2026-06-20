from ..models.schemas import MatchResult, Job
from .ai_service import ai_client
from pydantic import BaseModel

class ExplanationOutput(BaseModel):
    strengths: list[str]
    gaps: list[str]
    summary: str

class ExplainabilityService:
    """
    Uses Gemini to generate human-readable, evidence-backed explanations
    for why a candidate matches a job.
    """

    def generate_explanation(self, match_result: MatchResult, job: Job) -> MatchResult:
        """Enriches a MatchResult with natural language explanations."""
        
        cand = match_result.candidate
        
        # Prepare context for the prompt
        context = f"Job Required Skills: {', '.join(job.required_skills)}\n"
        context += f"Candidate Matched Skills: {', '.join(match_result.matched_skills)}\n"
        context += f"Candidate Partial/Transferable Skills: {', '.join(match_result.partial_skills)}\n"
        
        if cand.github_profile:
            context += f"GitHub Data: {cand.github_profile.public_repos} repos, top languages: {list(cand.github_profile.languages.keys())[:3]}\n"
        
        if cand.cross_source:
            context += f"Cross-Source Verification: {cand.cross_source.status.value}\n"
            context += f"Verified Skills: {', '.join(cand.cross_source.verified_skills)}\n"
        
        prompt = (
            "You are an expert technical recruiter AI. Given the candidate's match data against a job, "
            "generate exactly 3 concise 'strengths' and 1-2 'gaps'. "
            "CRITICAL: If the candidate has GitHub or Cross-Source data provided, you MUST cite that evidence "
            "in your strengths (e.g. 'GitHub confirms expertise in X with Y repos')."
            "Keep bullet points under 15 words."
        )

        try:
            explanation = ai_client.extract_structured_data(context, ExplanationOutput, prompt)
            
            # If the AI returns empty due to missing key, provide fallback text
            if not explanation.strengths:
                self._apply_fallback_explanation(match_result)
            else:
                match_result.strengths = explanation.strengths
                match_result.gaps = explanation.gaps
                # We could add the summary to the hidden_gem_reason if needed
                
        except Exception as e:
            print(f"Explanation failed: {e}")
            self._apply_fallback_explanation(match_result)
            
        return match_result

    def _apply_fallback_explanation(self, match_result: MatchResult):
        """Fallback if Gemini is unavailable or fails."""
        match_result.strengths = [
            f"Matches {len(match_result.matched_skills)} exact required skills",
            f"Brings {len(match_result.partial_skills)} highly transferable skills"
        ]
        if match_result.candidate.github_profile:
            match_result.strengths.append(f"Strong code quality signals from GitHub ({match_result.candidate.github_profile.public_repos} repos)")
            
        match_result.gaps = [f"Missing direct experience in {s}" for s in match_result.missing_skills[:2]]
        if not match_result.gaps:
            match_result.gaps = ["No major skill gaps identified"]
