"""
TalentLens AI — Intelligent Candidate Ranking Engine v2
========================================================
Redrob Hackathon: Intelligent Candidate Discovery & Ranking Challenge

Ranks ~100K candidates against a Senior AI Engineer (Founding Team) JD.
Produces a top-100 shortlist CSV. Runs on CPU-only in <5 minutes.

Architecture:
  1. Hard Filters (instant disqualification)
  2. Multi-signal scoring across 7 dimensions
  3. Composite weighting with JD-aligned priorities
  4. Dynamic reasoning generation from verified profile data
"""

import argparse
import csv
import json
import math
import os
import re
from datetime import datetime

# ============================================================================
# JD-DERIVED CONFIGURATION
# ============================================================================

# Reference date for staleness calculations
REF_DATE = datetime(2026, 6, 1)

# --- MUST-HAVE skills (from JD: "Things you absolutely need") ---
# Embeddings/retrieval, vector DBs, Python, evaluation metrics
MUST_HAVE_SKILLS = {
    # Embeddings & retrieval (JD: "Production experience with embeddings-based retrieval")
    "embeddings": 1.5,
    "sentence-transformers": 1.4, "sentence transformers": 1.4,
    "retrieval": 1.4, "information retrieval": 1.3,
    "semantic search": 1.2, "vector search": 1.2,
    "bm25": 1.2, "rag": 1.1,
    # Vector databases (JD: "Production experience with vector databases")
    "qdrant": 1.3, "pinecone": 1.3, "milvus": 1.3,
    "weaviate": 1.3, "faiss": 1.3,
    "opensearch": 1.2, "elasticsearch": 1.2,
    # Evaluation (JD: "Hands-on experience designing evaluation frameworks")
    "ndcg": 1.4, "ranking": 1.3, "evaluation": 1.2,
    "mrr": 1.2, "map": 1.1,
    # Python (JD: "Strong Python")
    "python": 1.0,
}

# --- NICE-TO-HAVE skills (from JD: "Things we'd like you to have") ---
NICE_TO_HAVE_SKILLS = {
    "fine-tuning": 0.6, "fine-tuning llms": 0.6,
    "lora": 0.5, "qlora": 0.5, "peft": 0.5,
    "xgboost": 0.5, "learning-to-rank": 0.5,
    "llm": 0.4, "llms": 0.4,
    "hugging face transformers": 0.5,
    "recommendation systems": 0.5,
    "prompt engineering": 0.3,
}

# --- ANTI-SIGNAL skills (JD: "Things we explicitly do NOT want") ---
# LangChain-only is explicitly deprioritized by the JD
ANTI_SIGNAL_SKILLS = {
    "langchain": -0.3,  # JD: "Framework enthusiasts... LangChain tutorials"
}

# Proficiency multipliers for skill scoring
PROFICIENCY_MULT = {
    "beginner": 0.3,
    "intermediate": 0.6,
    "advanced": 0.85,
    "expert": 1.0,
}

# --- Semantic alias dictionary for keyword expansion (Semantic Search without LLM) ---
SEMANTIC_ALIASES = {
    "deep learning": ["neural networks", "neural", "neural search"],
    "similarity search": ["vector search", "faiss", "retrieval"],
    "vector indexing": ["vector database", "faiss", "vector search"],
    "approximate nearest neighbor": ["vector search", "faiss", "retrieval"],
    "ann search": ["vector search", "faiss", "retrieval"],
    "contrastive learning": ["embeddings", "sentence-transformers", "sentence transformers"],
    "representation learning": ["embeddings", "sentence-transformers", "sentence transformers"],
    "neural search": ["semantic search", "retrieval", "vector search"],
}

# --- Title alignment with JD role ---
# JD is for "Senior AI Engineer — Founding Team"
STRONG_TITLE_KEYWORDS = ['ai engineer', 'ml engineer', 'machine learning', 'data scientist',
                          'nlp engineer', 'research engineer', 'search engineer',
                          'ranking engineer', 'retrieval engineer', 'deep learning scientist',
                          'deep learning engineer', 'applied scientist', 'ml scientist',
                          'ai scientist', 'machine learning scientist', 'research scientist']
GOOD_TITLE_KEYWORDS = ['software engineer', 'backend engineer', 'data engineer',
                        'full stack developer', 'platform engineer']
WEAK_TITLE_KEYWORDS = ['devops', 'cloud engineer', 'mobile developer', 'java developer',
                        'qa engineer', 'frontend engineer']

# JD: "Things we explicitly do NOT want" — non-tech titles
NON_TECH_TITLES = {'hr manager', 'accountant', 'sales executive', 'marketing manager',
                   'content writer', 'graphic designer', 'civil engineer', 'mechanical engineer',
                   'customer support', 'operations manager', 'project manager', 'business analyst'}

# JD: consulting-only career is a disqualifier
CONSULTING_COMPANIES = {'tcs', 'infosys', 'wipro', 'accenture', 'cognizant', 'capgemini',
                        'hcl', 'mindtree', 'tech mahindra', 'cts', 'mphasis', 'l&t infotech'}

# AI career keywords for career description analysis
AI_CAREER_KEYWORDS = [
    'embedding', 'retrieval', 'vector', 'ranking', 'search engine', 'search system',
    'ndcg', 'mrr', 'recommendation', 'nlp', 'neural', 'transformer', 'fine-tun',
    'llm', 'rag', 'reranking', 're-ranking', 'bert', 'gpt', 'semantic',
    'information retrieval', 'dense retrieval', 'hybrid search', 'bm25',
    'sentence-transformer', 'faiss', 'pinecone', 'qdrant', 'milvus', 'weaviate',
    'evaluation framework', 'a/b test', 'feature store', 'model serving',
    'ml pipeline', 'machine learning', 'deep learning', 'pytorch', 'tensorflow',
    'hugging face', 'model training', 'inference', 'classification', 'regression',
    'similarity search', 'vector indexing', 'approximate nearest neighbor', 'ann search',
    'contrastive learning', 'representation learning', 'neural search',
]

# Non-AI career keywords (signals this is NOT an AI career)
NON_AI_CAREER_KEYWORDS = [
    'customer support', 'sales team', 'marketing campaign', 'content writing',
    'brand design', 'seo strategy', 'social media', 'recruitment', 'hr operations',
    'accounting', 'financial report', 'tax', 'audit', 'bookkeeping',
    'mechanical design', 'civil construction', 'structural analysis',
    'cad', 'solidworks', 'autocad', 'creo', 'ansys',
    'project management office', 'pmp', 'scrum master',
    'graphic design', 'photoshop', 'illustrator', 'figma',
]

# JD Location preferences
PREFERRED_LOCATIONS = ['pune', 'noida']
TIER1_CITIES = ['pune', 'noida', 'mumbai', 'delhi', 'hyderabad', 'bangalore', 'bengaluru',
                'gurgaon', 'gurugram', 'chennai', 'kolkata']


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def parse_date(date_str):
    """Parse a date string to datetime, return None on failure."""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except (ValueError, TypeError):
        return None


def safe_get(d, *keys, default=None):
    """Safely navigate nested dicts."""
    for key in keys:
        if isinstance(d, dict):
            d = d.get(key, default)
        else:
            return default
    return d if d is not None else default


# ============================================================================
# STAGE 1: HARD FILTERS (Honeypot & Disqualification)
# ============================================================================

def detect_honeypot(cand):
    """
    Detect honeypot profiles with impossible or contradictory data.
    Returns (is_honeypot: bool, reason: str).
    
    The dataset contains ~80 honeypots designed to trap keyword-matchers.
    """
    profile = cand.get("profile", {})
    skills = cand.get("skills", [])
    history = cand.get("career_history", [])
    yoe = profile.get("years_of_experience", 0)

    # --- Rule 1: Career duration vastly exceeds stated YOE ---
    total_career_months = sum(h.get("duration_months", 0) for h in history)
    if yoe > 0 and total_career_months > 0:
        career_years = total_career_months / 12.0
        if career_years > (yoe + 5):
            return True, f"Career duration ({career_years:.1f}y) vastly exceeds stated YOE ({yoe}y)"

    # --- Rule 2: Many expert skills with zero duration ---
    expert_zero = sum(
        1 for s in skills
        if s.get("proficiency") == "expert" and s.get("duration_months", 0) == 0
    )
    if expert_zero >= 6:
        return True, f"{expert_zero} expert skills with zero months experience"

    # --- Rule 3: Impossibly high skill durations relative to YOE ---
    for s in skills:
        dur = s.get("duration_months", 0)
        if dur > 0 and yoe > 0:
            if dur > (yoe * 12 + 24):  # More than YOE + 2 years buffer
                return True, f"Skill '{s['name']}' duration ({dur}mo) exceeds career span ({yoe}y)"

    # --- Rule 4: Impossibly perfect metrics (all 1.0 or 100) ---
    signals = cand.get("redrob_signals", {})
    perfect_count = 0
    if signals.get("recruiter_response_rate", 0) >= 1.0: perfect_count += 1
    if signals.get("interview_completion_rate", 0) >= 1.0: perfect_count += 1
    if signals.get("offer_acceptance_rate", 0) >= 1.0: perfect_count += 1
    if signals.get("github_activity_score", 0) >= 100.0: perfect_count += 1
    if signals.get("profile_completeness_score", 0) >= 99.0: perfect_count += 1
    if perfect_count >= 4:
        return True, f"Impossibly perfect metrics ({perfect_count}/5 at maximum)"

    # --- Rule 5: Single duration_months exceeds 360 (30 years) ---
    for h in history:
        if h.get("duration_months", 0) > 360:
            return True, f"Single role duration ({h['duration_months']}mo) exceeds 30 years"

    return False, ""


def is_fundamentally_unfit(cand):
    """
    JD-based hard disqualifiers. Not honeypots, but clearly wrong for this role.
    Returns (is_unfit: bool, reason: str).
    """
    profile = cand.get("profile", {})
    title = (profile.get("current_title") or "").lower()
    yoe = profile.get("years_of_experience", 0)
    skills = cand.get("skills", [])
    history = cand.get("career_history", [])

    # Non-tech title + no AI in career descriptions = keyword stuffer trap
    if title in NON_TECH_TITLES:
        career_text = " ".join(h.get("description", "").lower() for h in history)
        summary = (profile.get("summary") or "").lower()
        combined_text = career_text + " " + summary

        ai_career_evidence = sum(1 for k in AI_CAREER_KEYWORDS if k in combined_text)

        # Non-tech title with <3 career AI mentions is very likely a trap
        # The JD says: "A candidate who has all the AI keywords listed as skills
        # but whose title is 'Marketing Manager' is not a fit"
        if ai_career_evidence < 4:
            return True, f"Non-tech title '{title}' with insufficient AI career evidence ({ai_career_evidence} mentions)"

    # Pure academic/research environment check
    # JD: "If you've spent your career in pure research environments (academic labs, research-only roles)
    # without any production deployment — we will not move forward."
    academic_titles = {'postdoctoral', 'postdoc', 'research assistant', 'research fellow', 
                       'academic researcher', 'phd scholar', 'teaching assistant', 'professor', 
                       'graduate researcher', 'phd candidate'}
    academic_companies = {'university', 'college', 'institute of technology', 'iisc', 'iit',
                          'stanford', 'mit', 'academic lab', 'research lab', 'research institute'}
    
    total_roles = len(history)
    academic_roles_count = 0
    production_mentions = 0
    
    for h in history:
        h_title = (h.get("title") or "").lower()
        h_company = (h.get("company") or "").lower()
        h_desc = (h.get("description") or "").lower()
        
        is_acad_title = any(k in h_title for k in academic_titles)
        is_acad_comp = any(k in h_company for k in academic_companies)
        
        if is_acad_title or is_acad_comp:
            academic_roles_count += 1
            
        if any(k in h_desc for k in ['production', 'deploy', 'scale', 'shipped', 'product', 'latency', 'real users', 'a/b test', 'pipeline', 'infrastructure']):
            production_mentions += 1
            
    if total_roles > 0 and academic_roles_count == total_roles and production_mentions == 0:
        return True, "Pure academic/research career without production deployment experience"

    return False, ""


# ============================================================================
# STAGE 2: MULTI-SIGNAL SCORING
# ============================================================================

def score_skills(cand):
    """
    Score skill alignment with JD requirements.
    Checks structured skills AND career text for evidence.
    Returns (score: 0-100, matched_skills: list).
    """
    skills = cand.get("skills", [])
    history = cand.get("career_history", [])
    profile = cand.get("profile", {})
    signals = cand.get("redrob_signals", {})
    assessment_scores = signals.get("skill_assessment_scores", {})

    # Build skill map
    skill_map = {s.get("name", "").lower(): s for s in skills}
    
    # Augment skill map with semantic aliases
    augmented_skill_map = skill_map.copy()
    for actual_skill, alias_list in SEMANTIC_ALIASES.items():
        if actual_skill in skill_map:
            for alias in alias_list:
                if alias not in augmented_skill_map:
                    actual_s = skill_map[actual_skill]
                    augmented_skill_map[alias] = {
                        "name": alias,
                        "proficiency": actual_s.get("proficiency", "intermediate"),
                        "duration_months": actual_s.get("duration_months", 0),
                        "endorsements": actual_s.get("endorsements", 0)
                    }

    # Career and summary text for implicit skill detection
    career_text = " ".join(h.get("description", "").lower() for h in history)
    summary_text = (profile.get("summary") or "").lower()
    combined_text = career_text + " " + summary_text

    score = 0.0
    matched = []
    must_have_count = 0
    nice_to_have_count = 0

    # Score must-have skills
    for skill_name, weight in MUST_HAVE_SKILLS.items():
        found = False
        prof_mult = 0.4
        dur_bonus = 0.5

        if skill_name in augmented_skill_map:
            found = True
            s = augmented_skill_map[skill_name]
            prof_mult = PROFICIENCY_MULT.get(s.get("proficiency", "intermediate"), 0.6)
            dur = s.get("duration_months", 0)
            dur_bonus = min(dur / 30.0, 1.5) if dur > 0 else 0.3

            # Boost if there's a platform assessment score for this skill
            for assess_name, assess_score in assessment_scores.items():
                if assess_name.lower() == skill_name or skill_name in assess_name.lower():
                    # High assessment score = verified competence
                    if assess_score >= 70:
                        dur_bonus *= 1.3
                    elif assess_score >= 50:
                        dur_bonus *= 1.1
                    elif assess_score < 30:
                        dur_bonus *= 0.6  # Low score = skill claimed but not verified
        elif skill_name in combined_text:
            found = True
            prof_mult = 0.5
            dur_bonus = 0.6

        if found:
            skill_score = weight * prof_mult * dur_bonus
            score += skill_score
            matched.append(skill_name)
            must_have_count += 1

    # Score nice-to-have skills
    for skill_name, weight in NICE_TO_HAVE_SKILLS.items():
        if skill_name in skill_map or skill_name in combined_text:
            if skill_name in skill_map:
                s = skill_map[skill_name]
                prof_mult = PROFICIENCY_MULT.get(s.get("proficiency", "intermediate"), 0.6)
            else:
                prof_mult = 0.5
            score += weight * prof_mult
            nice_to_have_count += 1

    # Anti-signal penalty (LangChain without depth)
    for skill_name, penalty in ANTI_SIGNAL_SKILLS.items():
        if skill_name in skill_map:
            # Only penalize if LangChain is present but must-have depth is shallow
            if must_have_count < 4:
                score += penalty

    # Normalize to 0-100
    max_score = sum(MUST_HAVE_SKILLS.values()) * 1.5 + sum(NICE_TO_HAVE_SKILLS.values())
    norm_score = min((score / max_score) * 100, 100) if max_score > 0 else 0

    return norm_score, matched, must_have_count


def score_experience(cand):
    """
    Score experience alignment with JD.
    JD: 5-9 years ideal, "6-8 years total experience, of which 4-5 are in applied ML/AI"
    """
    profile = cand.get("profile", {})
    history = cand.get("career_history", [])
    yoe = profile.get("years_of_experience", 0)
    title = (profile.get("current_title") or "").lower()

    # --- YOE band scoring ---
    # JD says 5-9 years, ideal is 6-8
    if 6.0 <= yoe <= 8.0:
        yoe_score = 100
    elif 5.0 <= yoe < 6.0 or 8.0 < yoe <= 9.0:
        yoe_score = 90
    elif 4.0 <= yoe < 5.0 or 9.0 < yoe <= 12.0:
        yoe_score = 65
    elif 3.0 <= yoe < 4.0:
        yoe_score = 45
    elif 12.0 < yoe <= 15.0:
        yoe_score = 40
    else:
        yoe_score = 20

    # --- Title alignment ---
    title_score = 30  # baseline for unknown titles
    if any(k in title for k in STRONG_TITLE_KEYWORDS):
        title_score = 100
    elif any(k in title for k in GOOD_TITLE_KEYWORDS):
        title_score = 75
    elif any(k in title for k in WEAK_TITLE_KEYWORDS):
        title_score = 50
    elif title in NON_TECH_TITLES:
        title_score = 10

    # --- Career trajectory: AI career progression ---
    ai_role_months = 0
    total_career_months = 0
    product_company_exp = False

    for h in history:
        dur = h.get("duration_months", 0)
        total_career_months += dur
        h_title = (h.get("title") or "").lower()
        h_desc = (h.get("description") or "").lower()
        h_company = (h.get("company") or "").lower()
        h_industry = (h.get("industry") or "").lower()

        # Count AI-relevant career months
        is_ai_role = any(k in h_title for k in ['ai', 'ml', 'machine learning', 'data scien', 'nlp', 'research'])
        has_ai_work = sum(1 for k in AI_CAREER_KEYWORDS if k in h_desc) >= 2

        if is_ai_role or has_ai_work:
            ai_role_months += dur

        # Product company experience (JD values this)
        if not any(cons in h_company for cons in CONSULTING_COMPANIES):
            if h_industry not in ('it services', 'consulting'):
                product_company_exp = True

    # JD says "4-5 years in applied ML/AI roles at product companies"
    ai_years = ai_role_months / 12.0
    if ai_years >= 4:
        ai_career_score = 100
    elif ai_years >= 2:
        ai_career_score = 70
    elif ai_years >= 1:
        ai_career_score = 45
    else:
        ai_career_score = 15

    # Product company bonus
    product_bonus = 10 if product_company_exp else 0

    # --- Consulting-only penalty ---
    # JD: "People who have only worked at consulting firms... We've had bad fit"
    all_companies = [h.get("company", "").lower() for h in history]
    all_consulting = len(all_companies) > 0 and all(
        any(cons in comp for cons in CONSULTING_COMPANIES) for comp in all_companies
    )
    consulting_penalty = -20 if all_consulting else 0

    # Composite
    exp_score = (
        yoe_score * 0.30 +
        title_score * 0.25 +
        ai_career_score * 0.35 +
        product_bonus +
        consulting_penalty
    )
    return max(0, min(exp_score + 10, 100))  # +10 baseline shift, clamp


def score_behavioral(cand):
    """
    Score behavioral engagement signals.
    JD: "A perfect-on-paper candidate who hasn't logged in for 6 months
    and has a 5% recruiter response rate is, for hiring purposes, not actually available."
    """
    signals = cand.get("redrob_signals", {})

    # --- Response & engagement ---
    resp_rate = signals.get("recruiter_response_rate", 0)
    int_rate = signals.get("interview_completion_rate", 0)
    avg_resp_time = signals.get("avg_response_time_hours", 168)  # Default 1 week

    # Response rate score (0-30)
    resp_score = resp_rate * 30

    # Response time score (0-15) — faster is better
    if avg_resp_time <= 12:
        time_score = 15
    elif avg_resp_time <= 24:
        time_score = 12
    elif avg_resp_time <= 48:
        time_score = 9
    elif avg_resp_time <= 96:
        time_score = 5
    else:
        time_score = 2

    # Interview completion (0-15)
    int_score = int_rate * 15

    # --- Staleness decay ---
    last_active = parse_date(signals.get("last_active_date"))
    if last_active:
        days_inactive = (REF_DATE - last_active).days
        if days_inactive < 0:
            days_inactive = 0  # Active after ref date
        # JD: "hasn't logged in for 6 months" is a problem
        if days_inactive <= 30:
            stale_score = 20
        elif days_inactive <= 90:
            stale_score = 15
        elif days_inactive <= 180:
            stale_score = 8
        else:
            stale_score = 2
    else:
        stale_score = 5

    # --- Open to work flag ---
    open_to_work = signals.get("open_to_work_flag", False)
    open_score = 10 if open_to_work else 3

    # --- Verification trust ---
    verified = 0
    if signals.get("verified_email"): verified += 3
    if signals.get("verified_phone"): verified += 3
    if signals.get("linkedin_connected"): verified += 4

    total = resp_score + time_score + int_score + stale_score + open_score + verified
    return min(total, 100)


def score_platform_engagement(cand):
    """Score platform engagement and code quality signals."""
    signals = cand.get("redrob_signals", {})

    # GitHub activity (JD: founding engineers who ship real code)
    gh_score = signals.get("github_activity_score", -1)
    if gh_score < 0:
        gh_component = 15  # No GitHub linked — not ideal but not disqualifying
    elif gh_score >= 80:
        gh_component = 40
    elif gh_score >= 50:
        gh_component = 30
    elif gh_score >= 20:
        gh_component = 20
    else:
        gh_component = 10

    # Profile completeness
    completeness = signals.get("profile_completeness_score", 50)
    comp_component = (completeness / 100.0) * 20

    # Saved by recruiters (collective wisdom)
    saved = min(signals.get("saved_by_recruiters_30d", 0), 50)
    saved_component = (saved / 50.0) * 20

    # Endorsements received (peer validation)
    endorsements = min(signals.get("endorsements_received", 0), 200)
    endorse_component = (endorsements / 200.0) * 10

    # Assessment scores — verified competence
    assessments = signals.get("skill_assessment_scores", {})
    if assessments:
        avg_assess = sum(assessments.values()) / len(assessments)
        assess_component = min((avg_assess / 100.0) * 10, 10)
    else:
        assess_component = 3

    total = gh_component + comp_component + saved_component + endorse_component + assess_component
    return min(total, 100)


def score_availability(cand):
    """Score candidate availability and location fit."""
    profile = cand.get("profile", {})
    signals = cand.get("redrob_signals", {})

    # --- Notice period ---
    # JD: "We'd love sub-30-day notice. We can buy out up to 30 days.
    # 30+ day notice candidates are still in scope but the bar gets higher."
    notice = signals.get("notice_period_days", 60)
    if notice <= 30:
        notice_score = 40
    elif notice <= 45:
        notice_score = 30
    elif notice <= 60:
        notice_score = 20
    elif notice <= 90:
        notice_score = 12
    else:
        notice_score = 5

    # --- Location ---
    # JD: "Pune/Noida-preferred... Hyderabad, Pune, Mumbai, Delhi NCR welcome"
    location = (profile.get("location") or "").lower()
    country = (profile.get("country") or "").lower()
    relocate = signals.get("willing_to_relocate", False)

    if any(city in location for city in PREFERRED_LOCATIONS):
        loc_score = 30
    elif any(city in location for city in TIER1_CITIES):
        loc_score = 25
    elif country == "india":
        loc_score = 18 if relocate else 12
    elif relocate:
        loc_score = 10
    else:
        loc_score = 5

    # --- Work mode alignment ---
    # JD: "Hybrid — flexible cadence"
    work_mode = signals.get("preferred_work_mode", "onsite")
    if work_mode in ("hybrid", "flexible"):
        mode_score = 15
    elif work_mode == "remote":
        mode_score = 10
    elif work_mode == "onsite":
        mode_score = 12
    else:
        mode_score = 8

    # --- Offer acceptance rate ---
    offer_rate = signals.get("offer_acceptance_rate", -1)
    if offer_rate < 0:
        offer_score = 8  # No history
    elif offer_rate >= 0.7:
        offer_score = 15
    elif offer_rate >= 0.4:
        offer_score = 10
    else:
        offer_score = 4

    total = notice_score + loc_score + mode_score + offer_score
    return min(total, 100)


def score_career_depth(cand):
    """
    Score the depth of AI/ML career evidence in career descriptions and summary.
    This is the KEY differentiator that separates genuine candidates from keyword stuffers.
    
    JD: "The right answer involves reasoning about the gap between what the JD says
    and what the JD means. A Tier 5 candidate may not use the words 'RAG' or 'Pinecone'
    in their profile, but if their career history shows they built a recommendation
    system at a product company, they're a fit."
    """
    profile = cand.get("profile", {})
    history = cand.get("career_history", [])

    career_text = " ".join(h.get("description", "").lower() for h in history)
    summary_text = (profile.get("summary") or "").lower()
    combined = career_text + " " + summary_text

    # Count AI career evidence
    ai_evidence = 0
    for keyword in AI_CAREER_KEYWORDS:
        if keyword in combined:
            ai_evidence += 1

    # Count non-AI career evidence (negative signal)
    non_ai_evidence = 0
    for keyword in NON_AI_CAREER_KEYWORDS:
        if keyword in combined:
            non_ai_evidence += 1

    # Career descriptions that mention production systems
    production_keywords = ['production', 'deployed', 'shipped', 'scale', 'real users',
                          'serving', 'pipeline', 'infrastructure', 'latency', 'throughput',
                          'api', 'microservice', 'distributed', 'real-time']
    prod_evidence = sum(1 for k in production_keywords if k in combined)

    # Career at product companies (not just consulting)
    has_product_career = False
    for h in history:
        company = (h.get("company") or "").lower()
        industry = (h.get("industry") or "").lower()
        if not any(cons in company for cons in CONSULTING_COMPANIES):
            if industry not in ('it services', 'consulting', 'staffing'):
                has_product_career = True
                break

    # Score composition
    ai_score = min(ai_evidence * 5, 50)  # Up to 50 points from AI evidence
    prod_score = min(prod_evidence * 4, 20)  # Up to 20 from production evidence
    product_co_score = 15 if has_product_career else 0
    non_ai_penalty = min(non_ai_evidence * 3, 20)  # Penalty for non-AI careers

    total = ai_score + prod_score + product_co_score - non_ai_penalty
    return max(0, min(total, 100))


# ============================================================================
# STAGE 3: COMPOSITE SCORING & REASONING
# ============================================================================

def calculate_score(cand):
    """
    Calculate final composite score for a candidate.
    Returns (score: float 0-1, reasoning: str).
    """
    # --- Stage 1: Hard filters ---
    is_hp, hp_reason = detect_honeypot(cand)
    if is_hp:
        return 0.0, f"Disqualified: {hp_reason}"

    is_unfit, unfit_reason = is_fundamentally_unfit(cand)
    if is_unfit:
        return 0.0, f"Disqualified: {unfit_reason}"

    # --- Stage 2: Multi-signal scoring ---
    skill_score, matched_skills, must_have_count = score_skills(cand)
    exp_score = score_experience(cand)
    behav_score = score_behavioral(cand)
    engage_score = score_platform_engagement(cand)
    avail_score = score_availability(cand)
    career_score = score_career_depth(cand)

    # --- Stage 3: Weighted composite ---
    # Weights reflect JD priorities:
    #   Skills matter most, but career depth is the differentiator
    #   Behavioral signals gate whether they're actually hireable
    composite = (
        skill_score   * 0.25 +   # Do they have the right skills?
        career_score  * 0.25 +   # Did they actually DO AI work?
        exp_score     * 0.20 +   # Right seniority, title, trajectory?
        behav_score   * 0.15 +   # Are they actually reachable?
        engage_score  * 0.08 +   # GitHub, assessments, platform presence?
        avail_score   * 0.07     # Notice, location, work mode?
    )

    # Normalize to 0-1, clamped to valid range
    final = round(min(max(composite / 100.0, 0.0001), 0.9999), 4)

    # --- Stage 4: Dynamic reasoning ---
    profile = cand.get("profile", {})
    signals = cand.get("redrob_signals", {})
    yoe = profile.get("years_of_experience", 0)
    actual_title = profile.get("current_title") or "Engineer"
    resp_rate = signals.get("recruiter_response_rate", 0)
    open_flag = signals.get("open_to_work_flag", False)
    company = profile.get("current_company", "")
    location = profile.get("location", "")

    top_skills = [s.title() for s in matched_skills[:4]]
    skill_str = ", ".join(top_skills) if top_skills else "general engineering"

    parts = [f"{actual_title} ({yoe}y)"]

    if company:
        parts.append(f"at {company}")

    if must_have_count >= 4:
        parts.append(f"strong depth in {skill_str}")
    elif must_have_count >= 2:
        parts.append(f"relevant skills: {skill_str}")
    else:
        parts.append(f"adjacent skills: {skill_str}")

    parts.append(f"response rate {resp_rate:.0%}")
    parts.append("actively looking" if open_flag else "passive candidate")

    if location:
        parts.append(f"based in {location}")

    reasoning = "; ".join(parts) + "."

    return final, reasoning


# ============================================================================
# MAIN
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description="TalentLens AI — Candidate Ranking Engine v2")
    parser.add_argument("--candidates", required=True, help="Path to candidates.jsonl or .json")
    parser.add_argument("--out", required=True, help="Output CSV file path")
    args = parser.parse_args()

    # Load candidates
    candidates = []
    print(f"Loading candidates from {args.candidates}...")

    with open(args.candidates, "r", encoding="utf-8") as f:
        if args.candidates.endswith(".jsonl"):
            for line in f:
                if line.strip():
                    candidates.append(json.loads(line))
        else:
            data = json.load(f)
            if isinstance(data, list):
                candidates = data
            elif isinstance(data, dict) and "candidates" in data:
                candidates = data["candidates"]

    print(f"Scoring {len(candidates)} candidates...")

    # Score all candidates
    scored = []
    honeypot_count = 0
    unfit_count = 0
    for cand in candidates:
        cid = cand.get("candidate_id")
        if not cid:
            continue
        score, reasoning = calculate_score(cand)
        if score == 0.0:
            if "Honeypot" in reasoning or "impossible" in reasoning.lower() or "vastly exceeds" in reasoning.lower() or "expert skills" in reasoning.lower() or "perfect metrics" in reasoning.lower() or "exceeds career" in reasoning.lower() or "30 years" in reasoning.lower():
                honeypot_count += 1
            else:
                unfit_count += 1
        scored.append({
            "candidate_id": cid,
            "score": score,
            "reasoning": reasoning,
        })

    # Sort: descending by score, ascending by candidate_id for tie-break
    scored.sort(key=lambda x: (-x["score"], x["candidate_id"]))

    # Take top 100
    top_100 = scored[:100]

    # Write output
    print(f"Writing Top 100 to {args.out}...")
    os.makedirs(os.path.dirname(os.path.abspath(args.out)) or ".", exist_ok=True)

    with open(args.out, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["candidate_id", "rank", "score", "reasoning"])
        for idx, item in enumerate(top_100, start=1):
            writer.writerow([
                item["candidate_id"],
                idx,
                f"{item['score']:.4f}",
                item["reasoning"],
            ])

    print(f"\nRanking complete!")
    print(f"  Honeypots filtered: {honeypot_count}")
    print(f"  Unfit profiles filtered: {unfit_count}")
    print(f"  Scored candidates: {len(scored) - honeypot_count - unfit_count}")
    if top_100:
        print(f"  Top score: {top_100[0]['score']:.4f}")
        print(f"  Bottom score: {top_100[-1]['score']:.4f}")


if __name__ == "__main__":
    main()
