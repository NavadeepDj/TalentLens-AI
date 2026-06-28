"""Audit the top 100 output to verify ranking quality."""
import csv
import json
from collections import Counter

# Load the top 100
top100 = []
with open('team_talentlens.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        top100.append(row)

print(f"Total rows: {len(top100)}")
print(f"Score range: {top100[0]['score']} - {top100[-1]['score']}")

# Load candidate data to cross-check
cand_lookup = {}
with open(r'[PUB] India_runs_data_and_ai_challenge\[PUB] India_runs_data_and_ai_challenge\India_runs_data_and_ai_challenge\candidates.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        if line.strip():
            c = json.loads(line)
            cand_lookup[c['candidate_id']] = c

# Title distribution in top 100
titles = Counter()
industries = Counter()
companies = Counter()
locations = Counter()
yoe_distribution = []
open_count = 0

non_tech_titles = {'hr manager', 'accountant', 'sales executive', 'marketing manager',
                   'content writer', 'graphic designer', 'civil engineer', 'mechanical engineer',
                   'customer support', 'operations manager', 'project manager', 'business analyst'}

for row in top100:
    cid = row['candidate_id']
    c = cand_lookup.get(cid)
    if c:
        p = c['profile']
        title = p['current_title']
        titles[title] += 1
        industries[p.get('current_industry', 'Unknown')] += 1
        companies[p.get('current_company', 'Unknown')] += 1
        locations[p.get('location', 'Unknown')] += 1
        yoe_distribution.append(p.get('years_of_experience', 0))
        if c.get('redrob_signals', {}).get('open_to_work_flag'):
            open_count += 1
        
        # Check for any non-tech titles that slipped through
        if title.lower() in non_tech_titles:
            print(f"  WARNING: Non-tech title in top 100: {cid} = {title} (rank {row['rank']})")

print(f"\n=== TITLE DISTRIBUTION IN TOP 100 ===")
for title, count in titles.most_common(20):
    print(f"  {title}: {count}")

print(f"\n=== COMPANY DISTRIBUTION (top 15) ===")
for company, count in companies.most_common(15):
    print(f"  {company}: {count}")

print(f"\n=== INDUSTRY DISTRIBUTION ===")
for industry, count in industries.most_common(10):
    print(f"  {industry}: {count}")

print(f"\n=== LOCATION DISTRIBUTION (top 10) ===")
for loc, count in locations.most_common(10):
    print(f"  {loc}: {count}")

print(f"\n=== YOE STATS ===")
if yoe_distribution:
    yoe_distribution.sort()
    print(f"  Min: {min(yoe_distribution)}")
    print(f"  Max: {max(yoe_distribution)}")
    print(f"  Mean: {sum(yoe_distribution)/len(yoe_distribution):.1f}")
    print(f"  Median: {yoe_distribution[len(yoe_distribution)//2]}")
    
    # YOE band distribution
    bands = {'<3': 0, '3-5': 0, '5-7': 0, '7-9': 0, '9-12': 0, '12+': 0}
    for y in yoe_distribution:
        if y < 3: bands['<3'] += 1
        elif y < 5: bands['3-5'] += 1
        elif y < 7: bands['5-7'] += 1
        elif y < 9: bands['7-9'] += 1
        elif y < 12: bands['9-12'] += 1
        else: bands['12+'] += 1
    print(f"  YOE Bands: {bands}")

print(f"\n=== ENGAGEMENT ===")
print(f"  Open to work: {open_count}/100")

# Check for any reasoning quality issues
print(f"\n=== REASONING QUALITY CHECK ===")
reasoning_set = set()
empty_count = 0
for row in top100:
    r = row['reasoning'].strip()
    if not r:
        empty_count += 1
    reasoning_set.add(r)
print(f"  Unique reasoning strings: {len(reasoning_set)}/100")
print(f"  Empty reasoning: {empty_count}")

# Verify no honeypots in top 100
consulting = {'tcs', 'infosys', 'wipro', 'accenture', 'cognizant', 'capgemini', 'hcl', 'mindtree'}
consulting_only_count = 0
for row in top100:
    cid = row['candidate_id']
    c = cand_lookup.get(cid)
    if c:
        all_companies = [h.get('company', '').lower() for h in c.get('career_history', [])]
        if all_companies and all(any(con in comp for con in consulting) for comp in all_companies):
            consulting_only_count += 1
            if consulting_only_count <= 3:
                print(f"  Consulting-only in top 100: {cid} = {c['profile']['current_title']} at {c['profile']['current_company']} (rank {row['rank']})")

print(f"\n  Total consulting-only in top 100: {consulting_only_count}")
