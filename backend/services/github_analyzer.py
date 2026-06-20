import httpx
import asyncio
from typing import Optional, Dict, Any, List
import os
import base64
from datetime import datetime
from ..models.schemas import GitHubProfile, GitHubRepo

class GitHubAnalyzer:
    """Analyzes a GitHub profile to extract candidate intelligence."""
    
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        # Use token if available to avoid 60 req/hr rate limit
        token = os.environ.get("GITHUB_TOKEN")
        if token:
            self.headers["Authorization"] = f"token {token}"

    async def _fetch(self, client: httpx.AsyncClient, url: str) -> Optional[Dict[str, Any]]:
        """Helper to make GitHub API requests."""
        try:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            print(f"GitHub API Error: {e.response.status_code} for {url}")
            return None
        except Exception as e:
            print(f"Request failed: {e}")
            return None

    async def _fetch_repo_languages(self, client: httpx.AsyncClient, lang_url: str) -> Dict[str, int]:
        """Fetch bytes of code per language for a specific repo."""
        data = await self._fetch(client, lang_url)
        return data if data else {}

    def _extract_username(self, github_url: str) -> str:
        """Extract username from various GitHub URL formats."""
        # Simple extraction logic. Assumes format like https://github.com/username
        url = github_url.rstrip("/")
        return url.split("/")[-1]

    async def analyze_profile(self, github_url: str) -> Optional[GitHubProfile]:
        """Builds a complete intelligence profile from a GitHub user URL."""
        username = self._extract_username(github_url)
        
        async with httpx.AsyncClient() as client:
            # 1. Fetch User Profile
            user_data = await self._fetch(client, f"{self.base_url}/users/{username}")
            if not user_data:
                return None

            # 2. Fetch User Repos (max 100 recent)
            repos_data = await self._fetch(client, f"{self.base_url}/users/{username}/repos?sort=updated&per_page=100")
            repos_data = repos_data or []

            # Initialize profile
            profile = GitHubProfile(
                username=username,
                name=user_data.get("name"),
                bio=user_data.get("bio"),
                avatar_url=user_data.get("avatar_url"),
                public_repos=user_data.get("public_repos", 0),
                followers=user_data.get("followers", 0),
                following=user_data.get("following", 0),
                account_created=user_data.get("created_at")
            )

            total_languages: Dict[str, int] = {}
            parsed_repos: List[GitHubRepo] = []
            stars_received = 0

            # Concurrently fetch languages for top repos to speed up analysis
            # We'll prioritize non-forks that have recent activity or stars
            target_repos = [r for r in repos_data if not r.get("fork")]
            # Sort by stars, then updated
            target_repos.sort(key=lambda x: (x.get("stargazers_count", 0), x.get("updated_at")), reverse=True)
            
            # Analyze top 10 repos deeply to save rate limits
            deep_dive_repos = target_repos[:10]
            
            # Tasks for concurrent language fetching
            lang_tasks = []
            for r in deep_dive_repos:
                lang_tasks.append(self._fetch_repo_languages(client, r.get("languages_url")))
            
            lang_results = await asyncio.gather(*lang_tasks)

            for repo_data, langs in zip(deep_dive_repos, lang_results):
                stars = repo_data.get("stargazers_count", 0)
                stars_received += stars
                
                # Aggregate language bytes
                for lang, bytes_count in langs.items():
                    total_languages[lang] = total_languages.get(lang, 0) + bytes_count
                
                # We won't call the raw content API for READMEs here yet unless we really need to,
                # as that adds many API calls. We'll rely on the repo description and topics first.
                
                repo_obj = GitHubRepo(
                    name=repo_data.get("name"),
                    description=repo_data.get("description"),
                    language=repo_data.get("language"),
                    stars=stars,
                    forks=repo_data.get("forks_count", 0),
                    topics=repo_data.get("topics", []),
                    is_fork=False,
                    updated_at=repo_data.get("updated_at")
                )
                parsed_repos.append(repo_obj)
            
            # Calculate language percentages
            total_bytes = sum(total_languages.values())
            if total_bytes > 0:
                profile.languages = {
                    lang: round((bytes_count / total_bytes) * 100, 1)
                    for lang, bytes_count in sorted(total_languages.items(), key=lambda item: item[1], reverse=True)
                }

            profile.top_repos = parsed_repos
            profile.stars_received = stars_received
            
            # TODO: Extract frameworks from languages/topics (e.g. if topic='fastapi', add to frameworks)
            # We will use Gemini later in the pipeline to analyze `top_repos` descriptions and topics
            # to extract implied frameworks and skills.

            return profile

# Quick test if run directly
if __name__ == "__main__":
    async def test():
        analyzer = GitHubAnalyzer()
        profile = await analyzer.analyze_profile("https://github.com/tiangolo")
        if profile:
            print(f"Analyzed {profile.name} ({profile.username})")
            print(f"Top languages: {profile.languages}")
            print(f"Stars received: {profile.stars_received}")
    asyncio.run(test())
