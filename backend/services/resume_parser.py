import fitz  # PyMuPDF
import io
from ..models.schemas import ResumeProfile
from .ai_service import ai_client

class ResumeParser:
    """Parses Resume PDFs into structured data using Gemini."""
    
    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        """Extract raw text from PDF bytes."""
        text = ""
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            print(f"Failed to parse PDF: {e}")
            return ""

    def parse_resume(self, pdf_bytes: bytes) -> ResumeProfile:
        """Parses a resume PDF into a structured ResumeProfile."""
        text = self.extract_text_from_pdf(pdf_bytes)
        
        if not text.strip():
            return ResumeProfile()

        prompt = (
            "You are an expert technical recruiter and resume parser. "
            "Extract the candidate's information from the following resume text. "
            "Be extremely accurate with skills, pulling out every programming language, "
            "framework, tool, and concept mentioned. For projects, extract the inferred skills "
            "even if they aren't explicitly listed in a 'skills' section."
        )
        
        profile = ai_client.extract_structured_data(text, ResumeProfile, prompt)
        
        # Calculate total experience roughly if not provided by AI
        if profile.total_experience_years == 0.0 and profile.experience:
            # A very rough fallback calculation
            profile.total_experience_years = float(len(profile.experience)) * 1.5 
            
        return profile
