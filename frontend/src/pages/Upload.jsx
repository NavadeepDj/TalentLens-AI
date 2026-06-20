import { useState, useCallback } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle2, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import LoadingOrb from '../components/ui/LoadingOrb';
import './Upload.css';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles.map(f => ({ file: f, status: 'pending' }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    multiple: true,
  });

  const handleProcess = () => {
    setProcessing(true);
    // Simulate processing
    let i = 0;
    const interval = setInterval(() => {
      if (i < files.length) {
        setProcessed(prev => [...prev, {
          name: files[i].file.name,
          skills: ['Python', 'FastAPI', 'Docker', 'PostgreSQL'].slice(0, 2 + Math.floor(Math.random() * 3)),
          experience: Math.floor(Math.random() * 8) + 1,
        }]);
        i++;
      } else {
        clearInterval(interval);
        setProcessing(false);
      }
    }, 1500);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-page page-enter">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title"><UploadIcon size={24} /> Upload Resumes</h1>
          <p className="page-subtitle">Upload candidate resumes for AI analysis and skill extraction</p>
        </div>
      </div>

      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className={`dropzone glass ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-icon">📄</div>
        <h3 style={{ marginBottom: 'var(--space-sm)' }}>
          {isDragActive ? 'Drop resumes here...' : 'Drag & drop resumes here'}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>
          Supports PDF and TXT files. AI will extract skills, experience, and projects automatically.
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="upload-files glass" style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 700 }}>
            {files.length} file{files.length > 1 ? 's' : ''} ready
          </h3>
          <div className="file-list">
            {files.map((f, i) => (
              <div key={i} className="file-item">
                <FileText size={18} color="var(--color-primary)" />
                <span className="file-name">{f.file.name}</span>
                <span className="file-size">{(f.file.size / 1024).toFixed(1)} KB</span>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); removeFile(i); }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleProcess} disabled={processing} style={{ marginTop: 'var(--space-md)' }}>
            {processing ? 'Processing...' : '🧠 Process with AI'}
          </button>
        </div>
      )}

      {/* Processing */}
      {processing && (
        <div style={{ padding: 'var(--space-2xl) 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingOrb text="AI is parsing resumes and extracting skills..." />
        </div>
      )}

      {/* Processed Results */}
      {processed.length > 0 && !processing && (
        <div className="processed-results glass" style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 700 }}>
            <CheckCircle2 size={18} color="var(--color-success)" style={{ marginRight: 8 }} />
            {processed.length} Resume{processed.length > 1 ? 's' : ''} Processed
          </h3>
          {processed.map((p, i) => (
            <div key={i} className="processed-item">
              <FileText size={16} color="var(--color-success)" />
              <span className="file-name">{p.name}</span>
              <div className="processed-skills">
                {p.skills.map(s => (
                  <span key={s} className="skill-badge skill-badge-match">{s}</span>
                ))}
              </div>
              <span className="processed-exp">{p.experience}y exp</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
