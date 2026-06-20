import os
import json
from typing import Type, TypeVar, Any
from google import genai
from pydantic import BaseModel

T = TypeVar('T', bound=BaseModel)

class AIService:
    """Wrapper around Google Gemini for structured data extraction."""
    
    def __init__(self):
        # We assume GEMINI_API_KEY is in the environment
        api_key = os.environ.get("GEMINI_API_KEY")
        # In a real setup, we'd handle missing keys more gracefully or use a fallback
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None
            print("WARNING: GEMINI_API_KEY not found. AI features will fail or need mocking.")

    def extract_structured_data(self, text: str, schema: Type[T], prompt_context: str) -> T:
        """
        Uses Gemini to extract structured data matching a Pydantic schema from unstructured text.
        """
        if not self.client:
            # Fallback/mock mode if no API key is provided during demo setup
            print(f"MOCK: Extracting {schema.__name__} from text.")
            return schema() # Returns empty model
            
        try:
            # Using gemini-2.5-flash as it's fast and good for structured extraction
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"{prompt_context}\n\nText to analyze:\n{text}",
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': schema,
                    'temperature': 0.1, # Low temperature for factual extraction
                },
            )
            
            # The response is a JSON string matching the Pydantic schema
            data_dict = json.loads(response.text)
            return schema(**data_dict)
            
        except Exception as e:
            print(f"Gemini API Error: {e}")
            # Return an empty model on failure to prevent crashes
            return schema()

# Singleton instance
ai_client = AIService()
