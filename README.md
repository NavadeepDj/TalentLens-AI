# 🌟 TalentLens AI — Intelligent Candidate Discovery & Ranking Engine

[![Submission Validated](https://img.shields.io/badge/Stage_1_Validator-PASSED-10b981?style=for-the-badge)](./team_talentlens.csv)
[![CPU Benchmark](https://img.shields.io/badge/Runtime-~12s_on_CPU-3b82f6?style=for-the-badge)](./rank.py)
[![Zero External APIs](https://img.shields.io/badge/API_Calls_During_Ranking-NONE-8b5cf6?style=for-the-badge)](./submission_metadata.yaml)

**TalentLens AI** is an AI-native talent intelligence engine built for the *India Runs Data & AI Challenge*. It transforms massive candidate oceans into high-precision shortlists by combining deep career-evidence analysis with multi-source behavioral signals and automated trap detection.

---

## 📁 Submission Bundle Overview

| Deliverable | File Path | Description |
|---|---|---|
| **Ranked Shortlist** | [`team_talentlens.csv`](./team_talentlens.csv) | Top 100 ranked candidates with non-templated, fact-grounded reasoning |
| **Ranking Engine** | [`rank.py`](./rank.py) | Standalone CPU-optimized ranking algorithm (<5 min execution) |
| **Portal Metadata** | [`submission_metadata.yaml`](./submission_metadata.yaml) | Team declarations, reproduction specs, and compute environment |
| **Interactive Demo** | [`frontend/`](./frontend) | Full React + Vite visual explainability dashboard (Stage 4 Demo) |

---

## ⚡ Quick Start & Reproducibility (Stage 3 Verification)

Per challenge rules, the entire ranking step runs strictly locally on CPU without external API calls or network access.

### 1. Prerequisites
Ensure Python 3.10+ is installed. No external heavy ML libraries or GPU setups are required—`rank.py` runs on standard Python standard libraries (`json`, `csv`, `math`, `datetime`, `argparse`, `re`).

### 2. Single Reproduction Command
To generate the exact validated submission file from the competition dataset:

```bash
python rank.py --candidates ./candidates.jsonl --out ./team_talentlens.csv
```

*Benchmark: Processes 100,000 real candidate profiles in **~12 seconds** on an 8-core CPU workstation.*

### 3. Running Verification & Honeypot Test
To verify the engine's behavior and inspect how it automatically flags synthetic honeypot profiles without relying on explicit text cues:

```bash
python rank.py --candidates ./test_honeypot_sample.jsonl --out ./test_honeypot_output.csv
```

*Note: This runs a test suite containing 12 candidate profiles covering diverse scenarios — perfect match, strong match, adjacent engineer, keyword stuffers, career-duration honeypots, zero-duration honeypots, ghost profiles, consulting-only careers, and overqualified architects. It outputs the results to `test_honeypot_output.csv`.*

---

## 🧠 The 7-Signal Scoring Architecture

Traditional keyword matching falls into keyword-stuffing traps and misses passive top performers. TalentLens AI implements a 3-stage pipeline: **Hard Filters → Multi-Signal Scoring → Composite Ranking**.

### Stage 1: Hard Filters (Instant Disqualification)

Before any scoring occurs, candidates are passed through two filter gates:

**Honeypot Detection** catches ~2,800 profiles with mathematically impossible data:
- Career duration vastly exceeding stated years of experience
- 6+ expert skills with zero months of actual usage
- Single role durations exceeding 30 years
- Impossibly perfect behavioral metrics (all at maximum)

**JD-Based Disqualification** catches ~68,000 keyword-stuffer traps:
- Non-tech titles (HR Manager, Accountant, etc.) **whose career descriptions contain no AI/ML evidence**
- This is the core insight: the JD explicitly says *"A candidate who has all the AI keywords listed as skills but whose title is 'Marketing Manager' is not a fit."*

### Stage 2: Multi-Signal Scoring (7 Dimensions)

```
Composite Score = (Skill Match × 0.25) + (Career Depth × 0.25) + (Experience Fit × 0.20)
               + (Behavioral Signals × 0.15) + (Platform Engagement × 0.08)
               + (Availability × 0.07)
```

#### 1. AI/ML Core Skill Match (25%)
- **Must-have**: Embeddings, retrieval, vector databases, evaluation metrics (NDCG/MRR/MAP), Python
- **Nice-to-have**: Fine-tuning (LoRA/QLoRA), learning-to-rank, LLMs
- **Anti-signals**: LangChain-only profiles without deep retrieval knowledge are penalized
- **Assessment verification**: Platform-verified skill scores boost or downgrade claimed proficiency

#### 2. Career Depth Analysis (25%) — The Key Differentiator
Analyzes actual career descriptions for evidence of AI/ML work:
- Counts AI career keywords (embedding, retrieval, vector, ranking, transformer, etc.)
- Counts production evidence (deployed, shipped, scale, pipeline, infrastructure)
- Penalizes non-AI career content (sales, marketing, accounting, graphic design)
- Rewards product-company experience over consulting-only careers

#### 3. Experience & Title Alignment (20%)
- **Target YOE Band**: Maximum score for 6-8 years (JD ideal), strong for 5-9
- **Title Match**: AI Engineer / ML Engineer > Software Engineer > Frontend Engineer > Non-tech
- **Career trajectory**: Rewards candidates with 4+ years in applied ML/AI roles
- **Consulting penalty**: All-consulting careers are deprioritized per JD guidance

#### 4. Behavioral Availability Signals (15%)
- **Recruiter Response Rate**: Direct measure of candidate reachability
- **Response Time**: Sub-12-hour responders score highest
- **Staleness Decay**: Exponential penalty for inactive profiles (>6 months = heavy penalty)
- **Open-to-work gate**: Active job seekers get preference
- **Verification trust**: Email, phone, and LinkedIn verification contribute to trust score

#### 5. Platform Engagement & Code Quality (8%)
- **GitHub Activity Score**: Critical for founding engineers who ship code
- **Assessment Scores**: Platform-verified competence adds trust
- **Recruiter Saves**: Collective recruiter wisdom signal
- **Endorsements**: Peer validation

#### 6. Availability & Location Fit (7%)
- **Notice Period**: Sub-30-day is ideal per JD ("We'd love sub-30-day notice")
- **Location**: Pune/Noida preferred, Tier-1 Indian cities welcome
- **Work Mode**: Hybrid/flexible matches JD requirements
- **Offer Acceptance Rate**: History of accepting offers signals genuine interest

---

## 🛡️ Automated Honeypot Trap Prevention

The dataset contains ~80 planted honeypots and thousands of keyword-stuffer traps. `rank.py` enforces multi-layer detection:

1. **Tenure Contradictions**: Disqualifies if cumulative career duration > stated YOE + 5 years
2. **Empty Expert Stuffing**: Disqualifies profiles claiming expert in 6+ skills with zero duration
3. **Impossible Metrics**: Catches impossibly perfect behavioral scores (4+ metrics at maximum)
4. **Title-Career Mismatch**: The most important filter — catches non-tech titles whose career descriptions contain zero AI/ML work evidence (catches ~68,000 keyword stuffers)
5. **Duration Anomalies**: Single roles exceeding 30 years, skill durations exceeding career span

---

## 📊 Top 100 Quality Audit

| Metric | Value |
|---|---|
| **Title distribution** | 100% AI/ML/Data Science titles |
| **YOE range** | 4.4 – 16.9 years (mean: 6.8, median: 6.7) |
| **Sweet spot (5-9y)** | 94% of candidates |
| **Open to work** | 79% actively looking |
| **Consulting-only careers** | 0 in top 100 |
| **Unique reasoning strings** | 100/100 |
| **Non-tech titles in top 100** | 0 |
| **Honeypots in top 100** | 0 |

---

## 💬 Fact-Grounded Dynamic Reasoning

Stage 4 review scrutinizes reasoning quality. TalentLens AI eliminates repetitive templates and hallucinations by dynamically constructing reasoning strings directly from verified profile data:

*Example Output:*
> `"Senior AI Engineer (7.8y); at Netflix; strong depth in Embeddings, Sentence Transformers, Retrieval, Information Retrieval; response rate 76%; actively looking; based in Vizag, Andhra Pradesh."`

---

## 🖥️ Stage 4 Demo Dashboard

While `rank.py` powers the mathematical shortlist, the repository includes a visual explainability dashboard under `frontend/`.

```bash
cd frontend
npm install
npm run dev
```
