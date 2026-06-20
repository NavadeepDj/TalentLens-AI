import { CheckCircle2, AlertTriangle, HelpCircle, Sparkles } from 'lucide-react';
import './VerificationBadge.css';

export default function VerificationBadge({ status, score }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle2 size={14} />,
          text: 'Verified',
          className: 'badge-verified',
        };
      case 'understated':
        return {
          icon: <Sparkles size={14} />,
          text: 'Hidden Gem',
          className: 'badge-understated',
        };
      case 'overstated':
        return {
          icon: <AlertTriangle size={14} />,
          text: 'Warning',
          className: 'badge-overstated',
        };
      default:
        return {
          icon: <HelpCircle size={14} />,
          text: 'Unverified',
          className: 'badge-unverified',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className={`verification-badge ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
      {score !== undefined && <span className="badge-score">{Math.round(score)}%</span>}
    </div>
  );
}
