import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle2, 
  X, 
  Github, 
  Linkedin, 
  Link as LinkIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react';
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

  const handleProcess = () => {
    if (!githubUrl && !linkedinUrl && !resumeFile) return;
    
    setProcessing(true);
    
    // Simulate API call to backend multi-source fusion
    setTimeout(() => {
      setProcessing(false);
      setResult({
        name: "Mock Candidate",
        verification_score: 92,
        sources_found: [
          githubUrl ? 'github' : null,
          linkedinUrl ? 'linkedin' : null,
          resumeFile ? 'resume' : null
        ].filter(Boolean),
        skills_extracted: 18,
        hidden_signals: 3
      });
    }, 4500);
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
            <div className="result-score-circle">
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
            <button className="btn btn-primary" onClick={() => navigate('/candidates')}>
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
