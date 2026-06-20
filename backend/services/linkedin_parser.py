import fitz  # PyMuPDF
from ..models.schemas import LinkedInProfile
from .ai_service import ai_client

class LinkedInParser:
    """Parses LinkedIn PDF exports or structured form data."""

    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        """Extract raw text from PDF bytes."""
        text = ""
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            print(f"Failed to parse LinkedIn PDF: {e}")
            return ""

    def _calculate_career_velocity(self, profile: LinkedInProfile) -> float:
        """
        Calculates career growth velocity based on the experience timeline.
        Higher score = faster progression to senior roles.
        """
        if not profile.experience or len(profile.experience) < 2:
            return 0.5 # Default baseline
            
        try:
            # Sort experience chronologically
            exp_sorted = sorted(
                [e for e in profile.experience if e.start_year], 
                key=lambda x: x.start_year
            )
            
            if not exp_sorted:
                return 0.5
                
            first_role = exp_sorted[0]
            latest_role = exp_sorted[-1]
            
            years_diff = (latest_role.start_year or 0) - (first_role.start_year or 0)
            level_diff = latest_role.level - first_role.level
            
            if years_diff <= 0:
                return 1.0 if level_diff > 0 else 0.5
                
            # levels gained per year
            velocity = level_diff / years_diff
            
            # Normalize to a reasonable 0-1 scale (e.g. 1 level per year is extremely fast = 1.0)
            normalized = min(max(velocity, 0.0), 1.0)
            return normalized
        except Exception as e:
            print(f"Error calculating velocity: {e}")
            return 0.5

    def parse_pdf(self, pdf_bytes: bytes) -> LinkedInProfile:
        """Parses a LinkedIn PDF export."""
        text = self.extract_text_from_pdf(pdf_bytes)
        
        if not text.strip():
            return LinkedInProfile()

        prompt = (
            "You are an expert talent analyst. Parse the following LinkedIn profile data export. "
            "Extract the headline, summary, detailed experience timeline, education, and skills. "
            "Crucially, for each experience entry, assign a 'level' from 1 to 6 where: "
            "1=Intern/Trainee, 2=Junior/Entry, 3=Mid-level, 4=Senior, 5=Lead/Manager, 6=Principal/Director/VP."
        )
        
        profile = ai_client.extract_structured_data(text, LinkedInProfile, prompt)
        profile.career_velocity = self._calculate_career_velocity(profile)
        
        return profile
