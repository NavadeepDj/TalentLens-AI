class SkillExtractor:
    """
    Handles skill taxonomy, grouping, and similarity mapping.
    This acts as a local fallback to the Gemini LLM for standard frameworks.
    """
    
    def __init__(self):
        # A static similarity graph for the demo to ensure fast, deterministic matching
        # In production, this would be backed by a vector database or LLM embeddings
        self.similarity_map = {
            "web_frameworks": {
                "fastapi": ["flask", "django", "express", "spring boot", "gin"],
                "flask": ["fastapi", "django"],
                "django": ["flask", "fastapi"],
                "react": ["vue.js", "angular", "next.js"],
            },
            "infrastructure": {
                "kubernetes": ["docker swarm", "ecs", "nomad", "docker"],
                "docker": ["podman", "containerd", "kubernetes"],
                "aws": ["gcp", "azure"],
            },
            "databases": {
                "postgresql": ["mysql", "sql server", "oracle"],
                "redis": ["memcached"],
                "mongodb": ["dynamodb", "couchbase"],
            },
            "ml_ai": {
                "pytorch": ["tensorflow", "keras", "jax"],
                "tensorflow": ["pytorch", "keras"],
                "langchain": ["llamaindex"],
                "qdrant": ["pinecone", "milvus", "weaviate", "chroma"],
            }
        }
        
    def get_transferable_skills(self, required_skill: str) -> list[str]:
        """Returns a list of highly transferable skills for a given requirement."""
        req_norm = required_skill.lower()
        
        for category, mappings in self.similarity_map.items():
            if req_norm in mappings:
                return mappings[req_norm]
                
        return []

    def calculate_similarity(self, candidate_skills: list[str], required_skill: str) -> float:
        """
        Calculates how closely a candidate's skills match a required skill.
        Returns:
            1.0 = exact match
            0.8-0.9 = highly transferable (e.g. Flask -> FastAPI)
            0.0 = no match
        """
        req_norm = required_skill.lower()
        cand_norm = [s.lower() for s in candidate_skills]
        
        # Exact match
        if req_norm in cand_norm:
            return 1.0
            
        # Check transferability
        transferable = self.get_transferable_skills(required_skill)
        for t_skill in transferable:
            if t_skill in cand_norm:
                return 0.85 # High similarity penalty for transfer
                
        # For the demo, if they have the broader language, give partial credit
        # e.g., They know Python but not FastAPI specifically
        if req_norm in ["fastapi", "flask", "django"] and "python" in cand_norm:
            return 0.5
            
        return 0.0
