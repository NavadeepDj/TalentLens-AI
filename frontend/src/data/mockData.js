// TalentLens AI — Mock Data for Demo
// Realistic synthetic candidates with diverse backgrounds

export const mockCandidates = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    title: "Senior Backend Engineer",
    location: "Bengaluru, India",
    experience: 6,
    avatar_color: "linear-gradient(135deg, #00D4FF, #7C3AED)",
    summary: "Passionate backend engineer with expertise in building scalable microservices and distributed systems. Led migration of monolith to microservices architecture serving 10M+ users.",
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "GraphQL", "Celery", "MongoDB"],
    career_trajectory: [
      { title: "Software Intern", company: "TCS", year: 2018, level: 1 },
      { title: "Junior Developer", company: "Infosys", year: 2019, level: 2 },
      { title: "Backend Developer", company: "Razorpay", year: 2020, level: 3 },
      { title: "Senior Backend Engineer", company: "Swiggy", year: 2022, level: 4 },
    ],
    projects: [
      {
        name: "Payment Gateway Microservice",
        description: "Built a high-throughput payment processing service handling 50K+ transactions/minute using FastAPI and Redis queues",
        extracted_skills: ["FastAPI", "Redis", "Distributed Systems", "Payment Processing"]
      },
      {
        name: "Real-time Analytics Pipeline",
        description: "Designed and implemented real-time event streaming pipeline using Kafka and ClickHouse for business intelligence",
        extracted_skills: ["Kafka", "ClickHouse", "Data Engineering", "Event-Driven Architecture"]
      }
    ],
    education: "B.Tech Computer Science, NIT Trichy",
    growth_score: 92,
    hidden_gem: false,
  },
  {
    id: 2,
    name: "Arjun Menon",
    email: "arjun.menon@email.com",
    title: "ML Engineer",
    location: "Hyderabad, India",
    experience: 4,
    avatar_color: "linear-gradient(135deg, #7C3AED, #F472B6)",
    summary: "ML engineer specializing in NLP and recommendation systems. Built production ML pipelines serving personalized content to 5M+ users daily.",
    skills: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "FastAPI", "Docker", "MLflow", "Hugging Face", "SQL", "Spark"],
    career_trajectory: [
      { title: "Data Science Intern", company: "Microsoft", year: 2020, level: 2 },
      { title: "Junior ML Engineer", company: "Flipkart", year: 2021, level: 3 },
      { title: "ML Engineer", company: "ShareChat", year: 2023, level: 4 },
    ],
    projects: [
      {
        name: "Recommendation Engine v2",
        description: "Built collaborative filtering + content-based hybrid recommendation system using PyTorch, improving engagement by 34%",
        extracted_skills: ["PyTorch", "Recommendation Systems", "Collaborative Filtering", "A/B Testing"]
      },
      {
        name: "Multilingual Sentiment Analyzer",
        description: "Fine-tuned IndicBERT for sentiment analysis across 8 Indian languages with 91% accuracy",
        extracted_skills: ["NLP", "Transfer Learning", "Hugging Face", "Multi-language ML"]
      }
    ],
    education: "M.Tech AI, IIT Hyderabad",
    growth_score: 88,
    hidden_gem: false,
  },
  {
    id: 3,
    name: "Sneha Patel",
    email: "sneha.patel@email.com",
    title: "Full Stack Developer",
    location: "Pune, India",
    experience: 3,
    avatar_color: "linear-gradient(135deg, #10B981, #00D4FF)",
    summary: "Full-stack developer with a unique blend of frontend finesse and backend robustness. Self-taught systems design enthusiast who built a personal project reaching 100K users.",
    skills: ["JavaScript", "React", "Node.js", "Python", "Flask", "PostgreSQL", "Tailwind CSS", "Git", "REST APIs", "Firebase"],
    career_trajectory: [
      { title: "Freelance Developer", company: "Self-employed", year: 2021, level: 2 },
      { title: "Frontend Developer", company: "Zoho", year: 2022, level: 3 },
      { title: "Full Stack Developer", company: "Freshworks", year: 2023, level: 3 },
    ],
    projects: [
      {
        name: "StudyBuddy – Peer Learning Platform",
        description: "Built end-to-end platform with video calls, collaborative whiteboard, and AI-powered study group matching. 100K+ registered users.",
        extracted_skills: ["React", "WebRTC", "Node.js", "AI Matching", "Full Stack"]
      },
      {
        name: "Inventory Management System",
        description: "Designed REST API backend with Flask for SME inventory tracking with barcode scanning and analytics dashboard",
        extracted_skills: ["Flask", "REST APIs", "Database Design", "Analytics"]
      }
    ],
    education: "BCA, Symbiosis University",
    growth_score: 85,
    hidden_gem: true,
    hidden_gem_reason: "Strong project portfolio despite non-traditional education. Flask experience directly transferable to FastAPI. Growth trajectory shows rapid self-learning."
  },
  {
    id: 4,
    name: "Rahul Gupta",
    email: "rahul.gupta@email.com",
    title: "DevOps Engineer",
    location: "Delhi NCR, India",
    experience: 5,
    avatar_color: "linear-gradient(135deg, #F59E0B, #EF4444)",
    summary: "DevOps engineer with deep infrastructure expertise. Architected CI/CD pipelines and Kubernetes clusters serving enterprise applications.",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Python", "Bash", "Ansible", "Prometheus", "GitHub Actions"],
    career_trajectory: [
      { title: "System Administrator", company: "Wipro", year: 2019, level: 2 },
      { title: "Cloud Engineer", company: "HCL", year: 2020, level: 3 },
      { title: "Senior DevOps Engineer", company: "Atlassian", year: 2022, level: 4 },
    ],
    projects: [
      {
        name: "Zero-Downtime Deployment Pipeline",
        description: "Implemented blue-green deployment strategy with automated rollback using Kubernetes and ArgoCD, achieving 99.99% uptime",
        extracted_skills: ["Kubernetes", "CI/CD", "ArgoCD", "High Availability"]
      }
    ],
    education: "B.Tech IT, DTU",
    growth_score: 78,
    hidden_gem: true,
    hidden_gem_reason: "Strong Python scripting and automation skills rarely visible in DevOps resumes. Infrastructure knowledge valuable for backend architecture decisions."
  },
  {
    id: 5,
    name: "Kavitha Sundaram",
    email: "kavitha.s@email.com",
    title: "Data Engineer",
    location: "Chennai, India",
    experience: 4,
    avatar_color: "linear-gradient(135deg, #F472B6, #7C3AED)",
    summary: "Data engineer building robust ETL pipelines and data warehouses. Passionate about data quality and governance.",
    skills: ["Python", "SQL", "Apache Spark", "Airflow", "dbt", "Snowflake", "AWS Glue", "Kafka", "Pandas", "Great Expectations"],
    career_trajectory: [
      { title: "Data Analyst", company: "Cognizant", year: 2020, level: 2 },
      { title: "Junior Data Engineer", company: "Mu Sigma", year: 2021, level: 3 },
      { title: "Data Engineer", company: "Walmart Labs", year: 2023, level: 4 },
    ],
    projects: [
      {
        name: "Real-time Supply Chain Analytics",
        description: "Built streaming data pipeline processing 1M+ events/hour from 5000+ stores using Spark Structured Streaming and Kafka",
        extracted_skills: ["Spark", "Kafka", "Real-time Processing", "Data Pipeline"]
      },
      {
        name: "Data Quality Framework",
        description: "Implemented automated data quality checks using Great Expectations, reducing data incidents by 60%",
        extracted_skills: ["Data Quality", "Testing", "Automation", "Data Governance"]
      }
    ],
    education: "M.Sc Data Science, PSG Tech",
    growth_score: 82,
    hidden_gem: false,
  },
  {
    id: 6,
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    title: "Research Engineer",
    location: "Bengaluru, India",
    experience: 2,
    avatar_color: "linear-gradient(135deg, #00D4FF, #10B981)",
    summary: "Research engineer with 3 published papers in top-tier conferences. Working on LLM fine-tuning and RAG systems.",
    skills: ["Python", "PyTorch", "LangChain", "RAG", "Vector Databases", "Transformers", "CUDA", "Docker", "FastAPI", "Qdrant"],
    career_trajectory: [
      { title: "Research Intern", company: "Google Research", year: 2022, level: 3 },
      { title: "Research Engineer", company: "AI4Bharat", year: 2023, level: 4 },
    ],
    projects: [
      {
        name: "Multilingual RAG System",
        description: "Built retrieval-augmented generation system supporting 11 Indian languages using Qdrant and custom fine-tuned embeddings",
        extracted_skills: ["RAG", "Vector Search", "Embeddings", "Multi-language NLP", "Qdrant"]
      },
      {
        name: "Efficient LLM Inference",
        description: "Optimized LLM serving pipeline achieving 3x throughput improvement using quantization and batching strategies",
        extracted_skills: ["LLM", "Model Optimization", "Quantization", "System Design"]
      }
    ],
    education: "M.Tech CS, IISc Bangalore",
    growth_score: 95,
    hidden_gem: true,
    hidden_gem_reason: "Only 2 years experience but exceptional growth trajectory. Research background shows deep technical understanding. RAG + Vector DB experience is cutting-edge."
  },
  {
    id: 7,
    name: "Ananya Krishnan",
    email: "ananya.k@email.com",
    title: "Software Engineer",
    location: "Kochi, India",
    experience: 3,
    avatar_color: "linear-gradient(135deg, #7C3AED, #00D4FF)",
    summary: "Versatile software engineer who transitioned from mechanical engineering. Strong problem-solving skills with competitive programming background (Codeforces Expert).",
    skills: ["Python", "C++", "Django", "React", "PostgreSQL", "Redis", "Docker", "System Design", "DSA", "REST APIs"],
    career_trajectory: [
      { title: "Mechanical Engineer", company: "L&T", year: 2021, level: 1 },
      { title: "Software Trainee", company: "UST Global", year: 2022, level: 2 },
      { title: "Software Engineer", company: "Thoughtworks", year: 2023, level: 3 },
    ],
    projects: [
      {
        name: "E-commerce Order Management",
        description: "Built scalable order management system handling 10K+ orders/day with Django and PostgreSQL, including inventory sync and payment integration",
        extracted_skills: ["Django", "PostgreSQL", "System Design", "E-commerce", "Payment Integration"]
      }
    ],
    education: "B.Tech Mechanical, NIT Calicut + Self-taught CS",
    growth_score: 90,
    hidden_gem: true,
    hidden_gem_reason: "Career switcher from mechanical engineering. Competitive programming expert (Codeforces) indicates strong algorithmic thinking. Django ≈ FastAPI transition is natural."
  },
  {
    id: 8,
    name: "Deepak Joshi",
    email: "deepak.j@email.com",
    title: "Principal Engineer",
    location: "Mumbai, India",
    experience: 10,
    avatar_color: "linear-gradient(135deg, #F59E0B, #F472B6)",
    summary: "Seasoned principal engineer with experience building systems at scale. Led engineering teams of 15+ members. Expert in distributed systems and cloud architecture.",
    skills: ["Java", "Python", "Go", "Kubernetes", "AWS", "System Design", "Microservices", "DynamoDB", "gRPC", "Team Leadership"],
    career_trajectory: [
      { title: "Software Engineer", company: "Oracle", year: 2014, level: 2 },
      { title: "Senior Engineer", company: "Amazon", year: 2017, level: 4 },
      { title: "Staff Engineer", company: "Uber", year: 2020, level: 5 },
      { title: "Principal Engineer", company: "Zerodha", year: 2023, level: 6 },
    ],
    projects: [
      {
        name: "High-Frequency Trading Platform",
        description: "Architected low-latency trading system processing 100K+ orders/second with sub-millisecond response times using Go and custom protocols",
        extracted_skills: ["Go", "Low-latency Systems", "High Performance", "Financial Technology"]
      },
      {
        name: "Global Content Delivery Network",
        description: "Designed and implemented CDN serving 1B+ requests/day across 40+ PoPs worldwide",
        extracted_skills: ["Distributed Systems", "CDN", "Global Scale", "Network Engineering"]
      }
    ],
    education: "B.Tech + M.Tech CS, IIT Bombay",
    growth_score: 75,
    hidden_gem: false,
  },
  {
    id: 9,
    name: "Meera Nair",
    email: "meera.nair@email.com",
    title: "Backend Developer",
    location: "Thiruvananthapuram, India",
    experience: 2,
    avatar_color: "linear-gradient(135deg, #10B981, #7C3AED)",
    summary: "Backend developer with strong API design skills. Open source contributor to multiple Python frameworks. Active tech community speaker.",
    skills: ["Python", "Flask", "SQLAlchemy", "PostgreSQL", "Redis", "Celery", "Docker", "pytest", "REST APIs", "OpenAPI"],
    career_trajectory: [
      { title: "Backend Intern", company: "MakeMyTrip", year: 2022, level: 2 },
      { title: "Backend Developer", company: "Postman", year: 2023, level: 3 },
    ],
    projects: [
      {
        name: "API Testing Framework",
        description: "Built automated API testing and documentation framework with OpenAPI spec generation, adopted by 3 internal teams",
        extracted_skills: ["API Design", "Testing", "OpenAPI", "Developer Tools"]
      },
      {
        name: "Event-Driven Notification Service",
        description: "Designed notification microservice with Celery and Redis supporting email, SMS, and push notifications at scale",
        extracted_skills: ["Celery", "Redis", "Microservices", "Event-Driven", "Notification Systems"]
      }
    ],
    education: "B.Tech CS, College of Engineering Trivandrum",
    growth_score: 87,
    hidden_gem: true,
    hidden_gem_reason: "Flask + SQLAlchemy expertise is 90% transferable to FastAPI. Open source contributions demonstrate initiative. Strong testing discipline rare in junior devs."
  },
  {
    id: 10,
    name: "Aditya Bhatt",
    email: "aditya.bhatt@email.com",
    title: "Platform Engineer",
    location: "Bengaluru, India",
    experience: 5,
    avatar_color: "linear-gradient(135deg, #EF4444, #F59E0B)",
    summary: "Platform engineer building internal developer tools and CI/CD infrastructure. Reduced deployment time by 80% across the organization.",
    skills: ["Go", "Python", "Kubernetes", "Terraform", "AWS", "Docker", "PostgreSQL", "gRPC", "Prometheus", "Grafana"],
    career_trajectory: [
      { title: "Software Engineer", company: "SAP", year: 2019, level: 2 },
      { title: "Backend Engineer", company: "Gojek", year: 2021, level: 3 },
      { title: "Platform Engineer", company: "Confluent", year: 2023, level: 4 },
    ],
    projects: [
      {
        name: "Internal Developer Platform",
        description: "Built self-service developer platform enabling teams to provision infrastructure, deploy services, and monitor applications through a unified interface",
        extracted_skills: ["Platform Engineering", "Developer Experience", "Self-service Infrastructure"]
      }
    ],
    education: "B.E Computer Science, BITS Pilani",
    growth_score: 80,
    hidden_gem: false,
  },
];

export const mockJobs = [
  {
    id: 1,
    title: "Senior Python Backend Engineer",
    company: "TechCorp India",
    location: "Bengaluru, India",
    type: "Full-time",
    posted: "2 days ago",
    description: "We are looking for a Senior Python Backend Engineer to build and maintain our core API platform. The ideal candidate has experience with FastAPI or similar frameworks, understands database design, and can architect scalable microservices.",
    required_skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "REST APIs"],
    nice_to_have: ["Kubernetes", "Redis", "GraphQL", "CI/CD", "AWS"],
    experience_range: "4-7 years",
    candidates_matched: 8,
    status: "active",
  },
  {
    id: 2,
    title: "ML Platform Engineer",
    company: "AI Startup Inc",
    location: "Remote, India",
    type: "Full-time",
    posted: "5 days ago",
    description: "Join our team to build and scale ML infrastructure. You'll work on model serving, feature stores, and experiment tracking platforms.",
    required_skills: ["Python", "PyTorch", "Docker", "Kubernetes", "MLflow"],
    nice_to_have: ["Spark", "Airflow", "Ray", "Triton", "AWS SageMaker"],
    experience_range: "3-6 years",
    candidates_matched: 5,
    status: "active",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "FinTech Solutions",
    location: "Mumbai, India",
    type: "Full-time",
    posted: "1 day ago",
    description: "Build modern web applications for our fintech platform. Must be comfortable with both frontend (React) and backend (Python/Node.js) development.",
    required_skills: ["React", "Python", "Node.js", "PostgreSQL", "REST APIs"],
    nice_to_have: ["TypeScript", "GraphQL", "Redis", "Docker", "Payment APIs"],
    experience_range: "2-5 years",
    candidates_matched: 6,
    status: "active",
  },
];

// Pre-computed match results for demo
export const mockMatchResults = {
  1: [ // Job ID 1: Senior Python Backend Engineer
    {
      candidate: mockCandidates[0], // Priya Sharma
      overall_score: 94,
      breakdown: {
        semantic_similarity: 96,
        skill_overlap: 92,
        career_trajectory: 92,
        project_relevance: 95,
        hidden_potential: 90,
      },
      matched_skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "REST APIs"],
      partial_skills: ["Kubernetes", "Redis", "GraphQL"],
      missing_skills: ["CI/CD"],
      strengths: [
        "Direct FastAPI production experience at Swiggy",
        "Payment gateway microservice demonstrates high-throughput API design",
        "Strong career growth: Intern → Senior in 4 years",
        "Experience with 50K+ TPS systems",
      ],
      gaps: [
        "No explicit CI/CD pipeline setup experience (but Docker/K8s implies familiarity)",
      ],
      is_hidden_gem: false,
    },
    {
      candidate: mockCandidates[8], // Meera Nair
      overall_score: 82,
      breakdown: {
        semantic_similarity: 85,
        skill_overlap: 75,
        career_trajectory: 87,
        project_relevance: 80,
        hidden_potential: 92,
      },
      matched_skills: ["Python", "PostgreSQL", "Docker", "REST APIs"],
      partial_skills: ["Flask → FastAPI", "SQLAlchemy", "Celery"],
      missing_skills: ["FastAPI", "Kubernetes"],
      strengths: [
        "Flask + SQLAlchemy experience is 90% transferable to FastAPI",
        "Strong API design discipline (OpenAPI spec generation)",
        "Open source contributions demonstrate self-motivation",
        "Testing expertise rare in 2-year developers",
      ],
      gaps: [
        "No direct FastAPI experience (but Flask → FastAPI is minimal transition)",
        "No Kubernetes experience",
      ],
      is_hidden_gem: true,
      hidden_gem_reason: "Traditional ATS would filter this candidate for missing 'FastAPI' keyword, but Flask experience is directly transferable. Strong API design fundamentals matter more than framework choice."
    },
    {
      candidate: mockCandidates[2], // Sneha Patel
      overall_score: 76,
      breakdown: {
        semantic_similarity: 78,
        skill_overlap: 68,
        career_trajectory: 85,
        project_relevance: 72,
        hidden_potential: 88,
      },
      matched_skills: ["Python", "PostgreSQL", "REST APIs"],
      partial_skills: ["Flask → FastAPI", "Firebase → Cloud"],
      missing_skills: ["FastAPI", "Docker", "Kubernetes"],
      strengths: [
        "Built platform reaching 100K+ users — demonstrates real-world scale thinking",
        "Flask experience transferable to FastAPI",
        "Full-stack perspective valuable for API design decisions",
        "Self-taught, rapid learner — BCA to building 100K user platforms",
      ],
      gaps: [
        "No Docker/containerization experience",
        "Limited backend-focused experience (more full-stack)",
      ],
      is_hidden_gem: true,
      hidden_gem_reason: "Non-traditional education (BCA) would be filtered by most ATS systems. But 100K user platform and rapid growth trajectory indicate exceptional potential."
    },
    {
      candidate: mockCandidates[6], // Ananya Krishnan
      overall_score: 74,
      breakdown: {
        semantic_similarity: 72,
        skill_overlap: 65,
        career_trajectory: 90,
        project_relevance: 70,
        hidden_potential: 85,
      },
      matched_skills: ["Python", "PostgreSQL", "Docker", "REST APIs"],
      partial_skills: ["Django → FastAPI", "System Design"],
      missing_skills: ["FastAPI", "Redis"],
      strengths: [
        "Career transition from Mechanical → CS shows exceptional adaptability",
        "Codeforces Expert rating — strong algorithmic foundation",
        "Django experience maps well to FastAPI",
        "E-commerce order management at 10K+ orders/day",
      ],
      gaps: [
        "Shorter software career (career switcher)",
        "No FastAPI specific experience",
      ],
      is_hidden_gem: true,
      hidden_gem_reason: "Career switcher from mechanical engineering. Traditional ATS sees '2 years CS experience' and rejects. TalentLens sees Codeforces Expert + rapid growth + strong system design skills."
    },
    {
      candidate: mockCandidates[3], // Rahul Gupta (DevOps)
      overall_score: 65,
      breakdown: {
        semantic_similarity: 60,
        skill_overlap: 55,
        career_trajectory: 78,
        project_relevance: 58,
        hidden_potential: 75,
      },
      matched_skills: ["Python", "Docker"],
      partial_skills: ["Kubernetes", "AWS", "CI/CD"],
      missing_skills: ["FastAPI", "PostgreSQL", "REST APIs"],
      strengths: [
        "Deep infrastructure knowledge valuable for backend architecture",
        "Python automation scripting experience",
        "Kubernetes expertise for deploying the services they'd build",
      ],
      gaps: [
        "Primary role is DevOps, not backend development",
        "No web framework experience",
        "No database design experience",
      ],
      is_hidden_gem: false,
    },
  ],
};

export const dashboardStats = {
  candidates_analyzed: 2847,
  active_jobs: 12,
  avg_match_rate: 73,
  hidden_gems_found: 186,
  candidates_trend: "+12%",
  jobs_trend: "+3",
  match_trend: "+5%",
  gems_trend: "+24",
};

// Skill similarity map for demo visualization
export const skillSimilarityPairs = [
  { skill1: "FastAPI", skill2: "Flask", similarity: 0.89, category: "Web Framework" },
  { skill1: "FastAPI", skill2: "Django", similarity: 0.82, category: "Web Framework" },
  { skill1: "PyTorch", skill2: "TensorFlow", similarity: 0.91, category: "ML Framework" },
  { skill1: "AWS", skill2: "Azure", similarity: 0.85, category: "Cloud Platform" },
  { skill1: "AWS", skill2: "GCP", similarity: 0.87, category: "Cloud Platform" },
  { skill1: "PostgreSQL", skill2: "MySQL", similarity: 0.92, category: "Database" },
  { skill1: "Docker", skill2: "Podman", similarity: 0.94, category: "Containerization" },
  { skill1: "Kubernetes", skill2: "Docker Swarm", similarity: 0.78, category: "Orchestration" },
  { skill1: "React", skill2: "Vue.js", similarity: 0.84, category: "Frontend" },
  { skill1: "Redis", skill2: "Memcached", similarity: 0.88, category: "Caching" },
  { skill1: "Kafka", skill2: "RabbitMQ", similarity: 0.80, category: "Message Queue" },
  { skill1: "GraphQL", skill2: "REST APIs", similarity: 0.76, category: "API Design" },
];
