# 🌟 TalentLens AI — *See Beyond the Resume*

[![Redrob AI Challenge](https://img.shields.io/badge/Redrob%20AI-India%20Runs-purple?style=for-the-badge)](https://redrob.com/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-yellow?style=for-the-badge&logo=vite)](https://vite.dev/)

> **Winning Angle:** *"Finding candidates that recruiters would miss."* TalentLens AI looks beyond literal keyword matches and basic semantic search, analyzing career growth speed, transferable skill mappings, project achievements, and raw potential.

---

## 📖 Introduction

Traditional Applicant Tracking Systems (ATS) and recruiters reject thousands of highly qualified candidates every day because of literal keyword mismatches. If a job requires **FastAPI** but the candidate has **Flask**, a keyword filter rejects them.

**TalentLens AI** is designed to bridge this gap. By mapping the deep relationship between skills, analyzing career velocity, and extracting project insights, TalentLens uncovers the **"hidden gems"** that traditional search pipelines miss.

---

## ✨ Features

- **🧠 Skill Similarity Engine:** Maps non-identical but highly transferable skills (e.g., `Flask ≈ FastAPI` at 89%, `Kubernetes ⊃ Docker` at 94%) using dynamic similarity mappings.
- **📈 Career Trajectory Velocity:** Measures career acceleration. For example, a candidate jumping from Intern to Senior Engineer in 3 years signals exceptional talent, even if their total years of experience is slightly below the job requirement.
- **🔍 Project Intelligence:** Extracted insights from portfolios. Instead of scanning titles, AI parses project descriptions to auto-extract implied skills (e.g., "built low-latency trading engine" extracts C++, Concurrency, and System Design).
- **📊 5-Signal Score & Explainability:** Provides a comprehensive matching score based on 5 dimensions: Skill Similarity, Skill Overlap, Career Growth, Project Relevance, and Hidden Potential. Every match is fully explainable with explicit strengths and gaps.
- **💎 Hidden Talent Discovery:** Features a "Find Similar" tool to search for candidates based on career/skill profiles of top performers rather than rigid search criteria.
- **📤 Smart Resume Parser & Job Builder:** Instantly extract skill graphs from job descriptions and simulate parser outputs on PDF resume uploads.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** React 19, JavaScript (ES6+), React Router DOM (v7)
- **Styling:** Vanilla CSS Custom Variables (Design System tokens), Glassmorphic effects, Glowing orb animations, and fully responsive layouts. No bulky utility CSS frameworks.
- **Charts & Motion:** Framer Motion (for fluid micro-interactions and smooth page transitions), Recharts (for candidate trajectory rendering and 5-signal match breakdowns)
- **Icons:** Lucide React

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/       # App wrapper & Navigation Sidebar
│   │   └── ui/           # Reusable UI elements (Animated Counters, Loading Orb, Match Score)
│   ├── data/             # Mock databases (candidates, job requirements, skill similarity maps)
│   ├── pages/            # View pages (Landing Page, Dashboard, Jobs, Candidates, Candidate Details, Hidden Talent, Upload)
│   ├── App.jsx           # App routing & component wiring
│   ├── index.css         # CSS variables & core design tokens
│   └── main.jsx          # Entry point
```

---

## 🚀 Running Guidelines

Follow these steps to run the application locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Installation
Navigate to the frontend directory and install the project dependencies:
```bash
cd frontend
npm install
```

### 2. Development Mode
To spin up the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production Build
To compile the production-ready build folder:
```bash
npm run build
```

### 4. Production Preview
To preview the production build locally:
```bash
npm run preview
```

---

## 📝 Commit Guidelines

To maintain clean repository histories, we follow conventional commit patterns. Please prefix all commit messages with one of the following scopes:

| Prefix | Description | Example |
| :--- | :--- | :--- |
| **`feat`** | A new feature | `feat: add 5-signal radar charts to candidate profiles` |
| **`fix`** | A bug fix | `fix: resolve missing Upload icon import in LandingPage` |
| **`docs`** | Documentation changes only | `docs: add running guidelines to README` |
| **`style`** | Code formatting, spacing, missing semicolons, etc. | `style: align grid spacing on candidate list page` |
| **`refactor`**| Restructuring code without behavior changes | `refactor: extract dashboard cards into reusable component` |
| **`perf`** | Code changes improving execution speed/performance| `perf: optimize Framer Motion rendering on orb animation` |
| **`test`** | Adding or correcting test cases | `test: add unit tests for skill similarity calculator` |
| **`chore`** | Build scripts, config changes, dependencies | `chore: upgrade lucide-react to latest version` |
| **`ci`** | CI pipeline config or deployment scripts | `ci: setup vercel deployment integration` |

---

## 🔮 Future Roadmap

1. **Backend Integration:** Migrate from mock datasets to a Python/FastAPI server connected to **Qdrant Vector Database** for actual semantic skill-graph vector indexing.
2. **Framework Migration:** Effortlessly port pages to **Next.js** by wrapping components with Next.js App Router folders if complex server-side rendering is required.
3. **Containerization:** Add Dockerfiles for single-command microservice packaging and orchestration.
