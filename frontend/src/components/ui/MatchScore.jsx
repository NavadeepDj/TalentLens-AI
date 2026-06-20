import { useEffect, useRef, useState } from 'react';

export default function MatchScore({ score, size = 80, strokeWidth = 6, animated = true }) {
  const [offset, setOffset] = useState(animated ? 283 : 0);
  const ref = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 85) return 'var(--color-success)';
    if (score >= 70) return 'var(--color-primary)';
    if (score >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getGlow = () => {
    if (score >= 85) return '0 0 20px rgba(16, 185, 129, 0.4)';
    if (score >= 70) return '0 0 20px rgba(0, 212, 255, 0.4)';
    if (score >= 50) return '0 0 20px rgba(245, 158, 11, 0.4)';
    return '0 0 20px rgba(239, 68, 68, 0.4)';
  };

  useEffect(() => {
    if (!animated) {
      setOffset(targetOffset);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setOffset(targetOffset), 200);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score, animated, targetOffset]);

  return (
    <div className="match-score-ring" ref={ref} style={{ width: size, height: size, filter: `drop-shadow(${getGlow()})` }}>
      <svg width={size} height={size}>
        <circle
          className="score-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="score-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={getColor()}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <span className="score-value" style={{
        fontSize: size * 0.28,
        color: getColor(),
      }}>
        {score}
      </span>
    </div>
  );
}
