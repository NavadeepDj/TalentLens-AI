import httpx
import asyncio
from typing import Optional, Dict, Any, List, Set
import os
import base64
import re
from datetime import datetime
from ..models.schemas import GitHubProfile, GitHubRepo

# Noise keywords for Layer 1
NOISE_KEYWORDS = {
    "tutorial", "homework", "assignment", "course", "bootcamp", 
    "starter", "template", "dotfiles", "practice", "demo", "sample", "test-repo"
}

# Known tech map for Layer 2 dependency matching
KNOWN_FRAMEWORKS = {
    # Python
    "fastapi", "flask", "django", "celery", "sqlalchemy", "pydantic", "pytest", 
    "redis", "pandas", "numpy", "scikit-learn", "torch", "tensorflow", "langchain", "qdrant",
    # JS / TS
    "react", "next", "vue", "nuxt", "svelte", "express", "nest", "graphql", 
    "tailwind", "prisma", "redux", "zustand", "jest", "vitest", "docker", "kubernetes"
}

class GitHubAnalyzer:
    """4-Layer Deep GitHub Code Intelligence Engine."""
    
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        token = os.environ.get("GITHUB_TOKEN")
        if token:
            self.headers["Authorization"] = f"token {token}"

    async def _fetch(self, client: httpx.AsyncClient, url: str) -> Optional[Any]:
        try:
            response = await client.get(url, headers=self.headers, timeout=10.0)
            if response.status_code == 404:
                return None
            response.raise_for_status()
            return response.json()
        except Exception:
            return None

    async def _fetch_raw(self, client: httpx.AsyncClient, url: str) -> Optional[str]:
        try:
            response = await client.get(url, headers=self.headers, timeout=10.0)
            if response.status_code == 200:
                return response.text
            return None
        except Exception:
            return None

    def _is_signal_repo(self, repo: Dict[str, Any]) -> bool:
        """Layer 1: Filter out noise repos."""
        if repo.get("fork"):
            return False
        name = (repo.get("name") or "").lower()
        desc = (repo.get("description") or "").lower()
        stars = repo.get("stargazers_count", 0)
        
        # If high stars, always keep
        if stars >= 5:
            return True
            
        for noise in NOISE_KEYWORDS:
            if noise in name or noise in desc:
                return False
        return True

    def _extract_deps_from_text(self, text: str) -> List[str]:
        """Extract known engineering frameworks from raw package/requirements text."""
        found = set()
        text_lower = text.lower()
        for kw in KNOWN_FRAMEWORKS:
            if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                found.add(kw)
        return sorted(list(found))

    async def _analyze_repo_deep(self, client: httpx.AsyncClient, username: str, repo: Dict[str, Any]) -> GitHubRepo:
        """Layers 2 & 3: Deep AST tree scan & Tech-Tree extraction."""
        repo_name = repo.get("name")
        stars = repo.get("stargazers_count", 0)
        
        repo_obj = GitHubRepo(
            name=repo_name,
            description=repo.get("description"),
            language=repo.get("language"),
            stars=stars,
            forks=repo.get("forks_count", 0),
            topics=repo.get("topics", []),
            is_fork=False,
            updated_at=repo.get("updated_at")
        )

        # Probing git tree API for root layout
        tree_data = await self._fetch(client, f"{self.base_url}/repos/{username}/{repo_name}/git/trees/HEAD")
        files = {}
        if tree_data and isinstance(tree_data, dict) and "tree" in tree_data:
            files = {item["path"]: item["type"] for item in tree_data["tree"]}

        # Check Seniority Architecture signals
        if ".github" in files:
            repo_obj.has_cicd = True
            repo_obj.complexity_score += 15
        if "Dockerfile" in files or "docker-compose.yml" in files:
            repo_obj.has_docker = True
            repo_obj.complexity_score += 15
        if any(t in files for t in ["tests", "test", "__tests__"]):
            repo_obj.has_tests = True
            repo_obj.complexity_score += 20

        # Probe dependency files
        deps = set()
        default_branch = repo.get("default_branch", "main")
        raw_base = f"https://raw.githubusercontent.com/{username}/{repo_name}/{default_branch}"

        if "package.json" in files:
            pkg_txt = await self._fetch_raw(client, f"{raw_base}/package.json")
            if pkg_txt: deps.update(self._extract_deps_from_text(pkg_txt))
            
        if any(f in files for f in ["requirements.txt", "pyproject.toml"]):
            req_file = "requirements.txt" if "requirements.txt" in files else "pyproject.toml"
            req_txt = await self._fetch_raw(client, f"{raw_base}/{req_file}")
            if req_txt: deps.update(self._extract_deps_from_text(req_txt))

        if "go.mod" in files:
            go_txt = await self._fetch_raw(client, f"{raw_base}/go.mod")
            if go_txt: deps.update(self._extract_deps_from_text(go_txt))

        repo_obj.dependencies_extracted = sorted(list(deps))
        return repo_obj

    def _extract_username(self, github_url: str) -> str:
        url = github_url.rstrip("/")
        return url.split("/")[-1]

    async def analyze_profile(self, github_url: str) -> Optional[GitHubProfile]:
        username = self._extract_username(github_url)
        
        async with httpx.AsyncClient() as client:
            user_data = await self._fetch(client, f"{self.base_url}/users/{username}")
            if not user_data:
                return None

            repos_data = await self._fetch(client, f"{self.base_url}/users/{username}/repos?sort=updated&per_page=100")
            repos_data = repos_data or []

            # Layer 1: Filter
            signal_repos = [r for r in repos_data if self._is_signal_repo(r)]
            signal_repos.sort(key=lambda x: (x.get("stargazers_count", 0), x.get("updated_at")), reverse=True)
            
            # Deep dive top 6 signal repos
            deep_dive_targets = signal_repos[:6]

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

            # Concurrent analysis
            tasks = [self._analyze_repo_deep(client, username, r) for r in deep_dive_targets]
            lang_tasks = [self._fetch(client, r.get("languages_url")) for r in deep_dive_targets]
            
            repo_results, lang_results = await asyncio.gather(
                asyncio.gather(*tasks),
                asyncio.gather(*lang_tasks)
            )

            total_languages: Dict[str, int] = {}
            all_tech_tree: Set[str] = set()
            seniority_score = 0
            stars_received = 0

            for r_obj, langs in zip(repo_results, lang_results):
                stars_received += r_obj.stars
                seniority_score += r_obj.complexity_score
                
                # Collect deps & topics
                all_tech_tree.update([d.lower() for d in r_obj.dependencies_extracted])
                all_tech_tree.update([t.lower() for t in r_obj.topics])
                if r_obj.language:
                    all_tech_tree.add(r_obj.language.lower())

                if langs and isinstance(langs, dict):
                    for lang, b_count in langs.items():
                        total_languages[lang] = total_languages.get(lang, 0) + b_count

            total_bytes = sum(total_languages.values())
            if total_bytes > 0:
                profile.languages = {
                    lang: round((b / total_bytes) * 100, 1)
                    for lang, b in sorted(total_languages.items(), key=lambda item: item[1], reverse=True)
                }

            profile.top_repos = list(repo_results)
            profile.stars_received = stars_received
            profile.tech_tree = sorted(list(all_tech_tree))
            profile.seniority_score = seniority_score
            profile.contribution_count = sum([r.get("size", 0) for r in signal_repos])

            return profile
