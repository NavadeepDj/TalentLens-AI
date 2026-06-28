"""Generate pipelineData.js from rank.py output files."""
import csv
import json
import re

def parse_reasoning(reasoning):
    """Parse the dynamic reasoning string into structured fields."""
    parts = reasoning.rstrip('.').split('; ')
    result = {
        'title': '', 'yoe': 0, 'company': '', 'skills': [],
        'responseRate': '', 'status': '', 'location': '', 'skillDepth': ''
    }
    if not parts:
        return result
    
    # First part: "Title (Xy)"
    m = re.match(r'^(.+?)\s*\((\d+\.?\d*)y\)', parts[0])
    if m:
        result['title'] = m.group(1)
        result['yoe'] = float(m.group(2))
    
    for part in parts[1:]:
        part = part.strip()
        if part.startswith('at '):
            result['company'] = part[3:]
        elif part.startswith('strong depth in '):
            result['skills'] = [s.strip() for s in part[16:].split(', ')]
            result['skillDepth'] = 'strong'
        elif part.startswith('relevant skills: '):
            result['skills'] = [s.strip() for s in part[17:].split(', ')]
            result['skillDepth'] = 'relevant'
        elif part.startswith('adjacent skills: '):
            result['skills'] = [s.strip() for s in part[17:].split(', ')]
            result['skillDepth'] = 'adjacent'
        elif part.startswith('response rate '):
            result['responseRate'] = part[14:]
        elif part in ('actively looking', 'passive candidate'):
            result['status'] = part
        elif part.startswith('based in '):
            result['location'] = part[9:]
    
    return result


# --- Parse top 100 ---
top100 = []
with open('team_talentlens.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        parsed = parse_reasoning(row['reasoning'])
        top100.append({
            'candidateId': row['candidate_id'],
            'rank': int(row['rank']),
            'score': float(row['score']),
            'reasoning': row['reasoning'],
            **parsed
        })

# --- Parse test suite ---
testSuite = []
with open('test_honeypot_output.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        score = float(row['score'])
        reasoning = row['reasoning']
        verdict = 'disqualified' if score == 0.0 else 'ranked'
        disqualifyReason = ''
        if verdict == 'disqualified':
            disqualifyReason = reasoning.replace('Disqualified: ', '')
        
        parsed = parse_reasoning(reasoning) if verdict == 'ranked' else {
            'title': '', 'yoe': 0, 'company': '', 'skills': [],
            'responseRate': '', 'status': '', 'location': '', 'skillDepth': ''
        }
        
        testSuite.append({
            'candidateId': row['candidate_id'],
            'rank': int(row['rank']),
            'score': score,
            'reasoning': reasoning,
            'verdict': verdict,
            'disqualifyReason': disqualifyReason,
            **parsed
        })

# --- Test suite candidate descriptions (for the honeypot showcase) ---
testProfiles = {
    'TEST_001': {'name': 'Arjun Verma', 'persona': 'Perfect Match — Sr. AI Engineer at Flipkart', 'type': 'genuine', 'icon': '🎯'},
    'TEST_002': {'name': 'Meera Krishnan', 'persona': 'Strong Match — ML Engineer at Paytm', 'type': 'genuine', 'icon': '✅'},
    'TEST_003': {'name': 'Ravi Kumar', 'persona': 'Adjacent Engineer — Backend at Razorpay', 'type': 'genuine', 'icon': '🔄'},
    'TEST_004': {'name': 'Sunita Reddy', 'persona': 'Keyword Stuffer — HR Manager at Wipro', 'type': 'honeypot', 'icon': '🚫'},
    'TEST_005': {'name': 'Vikram Sharma', 'persona': 'Overqualified Architect — No longer codes', 'type': 'genuine', 'icon': '📐'},
    'TEST_006': {'name': 'Amit Sharma', 'persona': 'Career-Duration Honeypot — 3y YOE, 10y career', 'type': 'honeypot', 'icon': '⏰'},
    'TEST_007': {'name': 'Rahul Gupta', 'persona': 'Zero-Duration Honeypot — 9 expert skills, 0 months', 'type': 'honeypot', 'icon': '💀'},
    'TEST_008': {'name': 'Deepa Menon', 'persona': 'Keyword Stuffer — Accountant at Dunder Mifflin', 'type': 'honeypot', 'icon': '🧮'},
    'TEST_009': {'name': 'Nisha Agarwal', 'persona': 'Good Fit — Data Scientist at HR-tech startup', 'type': 'genuine', 'icon': '💡'},
    'TEST_010': {'name': 'Karthik Iyer', 'persona': 'Passive Top Performer — Sr. ML Engineer at Google', 'type': 'genuine', 'icon': '🔍'},
    'TEST_011': {'name': 'Priya Singh', 'persona': 'Keyword Stuffer — Civil Engineer from abroad', 'type': 'honeypot', 'icon': '🏗️'},
    'TEST_012': {'name': 'Ghost Candidate', 'persona': 'Ghost Profile — 5% response rate, 10mo inactive', 'type': 'genuine', 'icon': '👻'},
    'TEST_013': {'name': 'Rohan Deshmukh', 'persona': 'Semantic Match — Deep Learning Scientist at Swiggy', 'type': 'genuine', 'icon': '🧠'},
    'TEST_014': {'name': 'Dr. Sandeep Nair', 'persona': 'Pure Academic — PhD + Postdoc, zero production', 'type': 'honeypot', 'icon': '🎓'},
    'TEST_015': {'name': 'Kunal Sen', 'persona': 'Consulting-Only — DL Consultant at Cognizant/TCS', 'type': 'genuine', 'icon': '🏢'},
}

# Merge profiles into test suite
for item in testSuite:
    cid = item['candidateId']
    if cid in testProfiles:
        item.update(testProfiles[cid])

# --- Build output ---
output = f"""// Auto-generated from rank.py output — DO NOT EDIT MANUALLY
// Generated by generate_pipeline_data.py

// ============================================================================
// PIPELINE STATISTICS
// ============================================================================
export const pipelineStats = {{
  totalCandidates: 100000,
  honepotsFiltered: 2835,
  unfitFiltered: 68062,
  scoredCandidates: 29103,
  topSelected: 100,
  runtimeSeconds: 12,
  topScore: {top100[0]['score']},
  bottomScore: {top100[-1]['score']},
}};

// ============================================================================
// SCORING WEIGHTS (from rank.py composite formula)
// ============================================================================
export const scoringWeights = [
  {{ name: 'Skill Match', weight: 0.25, color: '#00D4FF', description: 'JD must-have/nice-to-have skills with proficiency & assessment verification' }},
  {{ name: 'Career Depth', weight: 0.25, color: '#7C3AED', description: 'Actual AI/ML work evidence in career descriptions (the trap-breaker)' }},
  {{ name: 'Experience Fit', weight: 0.20, color: '#10B981', description: 'YOE band, title alignment, AI career trajectory, consulting penalty' }},
  {{ name: 'Behavioral', weight: 0.15, color: '#F59E0B', description: 'Response rate, recency, open-to-work, verification trust' }},
  {{ name: 'Engagement', weight: 0.08, color: '#F472B6', description: 'GitHub activity, assessments, recruiter saves, endorsements' }},
  {{ name: 'Availability', weight: 0.07, color: '#EF4444', description: 'Notice period, location, work mode, offer acceptance' }},
];

// ============================================================================
// SEMANTIC ALIASES (from rank.py SEMANTIC_ALIASES dict)
// ============================================================================
export const semanticAliases = {{
  'deep learning': ['neural networks', 'neural', 'neural search'],
  'similarity search': ['vector search', 'faiss', 'retrieval'],
  'vector indexing': ['vector database', 'faiss', 'vector search'],
  'approximate nearest neighbor': ['vector search', 'faiss', 'retrieval'],
  'ann search': ['vector search', 'faiss', 'retrieval'],
  'contrastive learning': ['embeddings', 'sentence-transformers', 'sentence transformers'],
  'representation learning': ['embeddings', 'sentence-transformers', 'sentence transformers'],
  'neural search': ['semantic search', 'retrieval', 'vector search'],
}};

// ============================================================================
// PIPELINE STAGES (for the funnel visualization)
// ============================================================================
export const pipelineStages = [
  {{
    id: 'input',
    label: 'Total Candidates',
    count: 100000,
    color: '#64748B',
    icon: 'Users',
    description: 'Raw candidate pool from Redrob platform',
  }},
  {{
    id: 'honeypot',
    label: 'Honeypot Detection',
    count: 2835,
    remaining: 97165,
    color: '#EF4444',
    icon: 'ShieldAlert',
    description: 'Impossible career durations, zero-duration expert skills, perfect metrics',
  }},
  {{
    id: 'unfit',
    label: 'JD Disqualification',
    count: 68062,
    remaining: 29103,
    color: '#F59E0B',
    icon: 'Filter',
    description: 'Non-tech titles without AI career evidence, pure academic researchers',
  }},
  {{
    id: 'scored',
    label: '7-Signal Scoring',
    count: 29103,
    remaining: 29103,
    color: '#7C3AED',
    icon: 'Brain',
    description: 'Multi-dimensional scoring across skills, career, behavioral, and platform signals',
  }},
  {{
    id: 'top100',
    label: 'Top 100 Selected',
    count: 100,
    remaining: 100,
    color: '#10B981',
    icon: 'Trophy',
    description: 'Final shortlist ranked by composite score with tie-breaking',
  }},
];

// ============================================================================
// TOP 100 RANKED CANDIDATES
// ============================================================================
export const top100Candidates = {json.dumps(top100, indent=2)};

// ============================================================================
// TEST SUITE RESULTS (15 profiles)
// ============================================================================
export const testSuiteResults = {json.dumps(testSuite, indent=2)};

// ============================================================================
// HONEYPOT DETECTION RULES
// ============================================================================
export const honeypotRules = [
  {{ id: 1, name: 'Career Duration Mismatch', description: 'Career history duration vastly exceeds stated YOE', icon: '⏰', caught: 'TEST_006' }},
  {{ id: 2, name: 'Zero-Duration Expert Skills', description: '6+ expert skills with zero months of actual usage', icon: '💀', caught: 'TEST_007' }},
  {{ id: 3, name: 'Impossibly Perfect Metrics', description: '4+ behavioral metrics at theoretical maximum', icon: '📊', caught: 'TEST_006' }},
  {{ id: 4, name: 'Title-Career Mismatch', description: 'Non-tech title but loaded with AI skills and no AI career evidence', icon: '🚫', caught: 'TEST_004, TEST_008, TEST_011' }},
  {{ id: 5, name: 'Pure Academic Career', description: 'Entire career in research labs, zero production deployment', icon: '🎓', caught: 'TEST_014' }},
];
"""

with open('frontend/src/data/pipelineData.js', 'w', encoding='utf-8') as f:
    f.write(output)

print("Generated frontend/src/data/pipelineData.js")
print(f"  Top 100 candidates: {len(top100)}")
print(f"  Test suite results: {len(testSuite)}")
