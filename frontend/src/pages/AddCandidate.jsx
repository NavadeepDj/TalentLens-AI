import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle2, 
  X, 
  Link as LinkIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Github, Linkedin } from '../components/ui/BrandIcons';
import { useDropzone } from 'react-dropzone';
import LoadingOrb from '../components/ui/LoadingOrb';
import './AddCandidate.css';

export default function AddCandidate() {
  const navigate = useNavigate();
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleProcess = async () => {
    if (!githubUrl && !linkedinUrl && !resumeFile) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      if (githubUrl) formData.append('github_url', githubUrl);
      if (linkedinUrl) formData.append('linkedin_url', linkedinUrl);
      if (resumeFile) formData.append('resume', resumeFile);

      const response = await fetch('http://localhost:8000/api/candidates/add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to build profile: ${response.statusText}`);
      }

      const data = await response.json();
      const cand = data.candidate;

      setResult({
        id: cand.id,
        name: cand.name,
        verification_score: cand.cross_source ? Math.round(cand.cross_source.overall_score) : 0,
        sources_found: cand.sources_provided || [],
        skills_extracted: cand.skill_names ? cand.skill_names.length : 0,
        hidden_signals: cand.hidden_gem ? 1 : 0
      });
    } catch (err) {
      console.error("Error building candidate profile:", err);
      setError(err.message || "Failed to connect to the backend server. Make sure it is running.");
    } finally {
      setProcessing(false);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setResumeFile(null);
  };

  if (result) {
    return (
      <div className="add-candidate-page page-enter">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title"><Sparkles size={24} className="text-primary" /> Profile Fused Successfully</h1>
            <p className="page-subtitle">Multi-source intelligence profile generated</p>
          </div>
        </div>

        <div className="result-card glass">
          <div className="result-header">
            <div className="result-score-circle" style={{ background: `conic-gradient(var(--color-success) ${result.verification_score}%, rgba(255, 255, 255, 0.1) 0)` }}>
              <span className="score-val">{result.verification_score}%</span>
              <span className="score-lbl">Verified</span>
            </div>
            <div className="result-summary">
              <h3>Cross-Source Intelligence Built</h3>
              <p>AI has merged {result.sources_found.length} sources to create a unified talent profile.</p>
            </div>
          </div>
          
          <div className="result-stats">
            <div className="stat-box">
              <span className="stat-num">{result.skills_extracted}</span>
              <span className="stat-label">Unique Skills Found</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{result.hidden_signals}</span>
              <span className="stat-label">Hidden Gems Discovered</span>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => navigate(`/candidates/${result.id}`)}>
              View Full Profile <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setResult(null)}>
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-candidate-page page-enter">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title"><Sparkles size={24} /> Multi-Source Intake</h1>
          <p className="page-subtitle">Provide up to 3 sources for AI cross-verification</p>
        </div>
      </div>

      <div className="intake-grid">
        {/* GitHub Source */}
        <div className="source-card glass">
          <div className="source-header">
            <div className="source-icon github-icon"><Github size={20} /></div>
            <h3>GitHub Profile</h3>
            <span className="source-badge">Code Quality</span>
          </div>
          <div className="source-input">
            <LinkIcon size={16} className="input-icon" />
            <input 
              type="text" 
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
          <p className="source-desc">AI will extract languages, frameworks, contribution velocity, and repo complexity.</p>
        </div>

        {/* LinkedIn Source */}
        <div className="source-card glass">
          <div className="source-header">
            <div className="source-icon linkedin-icon"><Linkedin size={20} /></div>
            <h3>LinkedIn Profile</h3>
            <span className="source-badge">Career Growth</span>
          </div>
          <div className="source-input">
            <LinkIcon size={16} className="input-icon" />
            <input 
              type="text" 
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>
          <p className="source-desc">AI will extract career timeline, promotion velocity, and peer endorsements.</p>
        </div>

        {/* Resume Source */}
        <div className="source-card glass" style={{ gridColumn: '1 / -1' }}>
          <div className="source-header">
            <div className="source-icon resume-icon"><FileText size={20} /></div>
            <h3>Resume PDF</h3>
            <span className="source-badge">Explicit Claims</span>
          </div>
          
          {!resumeFile ? (
            <div 
              {...getRootProps()} 
              className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="dropzone-icon">📄</div>
              <h4>{isDragActive ? 'Drop resume here...' : 'Drag & drop resume PDF here'}</h4>
            </div>
          ) : (
            <div className="file-ready">
              <FileText size={24} color="var(--color-primary)" />
              <div className="file-info">
                <span className="file-name">{resumeFile.name}</span>
                <span className="file-size">{(resumeFile.size / 1024).toFixed(1)} KB</span>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={removeFile}>
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          color: '#EF4444', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '16px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="action-row">
        <button 
          className="btn btn-primary btn-lg" 
          onClick={handleProcess} 
          disabled={processing || (!githubUrl && !linkedinUrl && !resumeFile)}
        >
          {processing ? 'Fusing Intelligence...' : '🧠 Build Intelligence Profile'}
        </button>
      </div>

      {processing && (
        <div className="processing-overlay">
          <div className="processing-content glass">
            <LoadingOrb text="AI is cross-referencing GitHub, LinkedIn, and Resume..." />
            <div className="processing-steps">
              <div className="proc-step active">1. Extracting repositories & commits</div>
              <div className="proc-step active">2. Calculating career velocity</div>
              <div className="proc-step">3. Running cross-source verification</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
