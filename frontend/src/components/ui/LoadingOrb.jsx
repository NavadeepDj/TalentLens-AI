import './LoadingOrb.css';

export default function LoadingOrb({ text = 'Analyzing with AI...', size = 120 }) {
  return (
    <div className="loading-orb-container">
      <div className="loading-orb" style={{ width: size, height: size }}>
        <div className="orb-core" />
        <div className="orb-ring orb-ring-1" />
        <div className="orb-ring orb-ring-2" />
        <div className="orb-ring orb-ring-3" />
        <div className="orb-particle orb-particle-1" />
        <div className="orb-particle orb-particle-2" />
        <div className="orb-particle orb-particle-3" />
        <div className="orb-particle orb-particle-4" />
      </div>
      {text && <p className="loading-orb-text">{text}</p>}
    </div>
  );
}
