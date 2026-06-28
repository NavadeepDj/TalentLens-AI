import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trophy, 
  ShieldAlert, 
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Pipeline Flow' },
  { path: '/rankings', icon: Trophy, label: 'Top 100 Rankings', badge: 'AI' },
  { path: '/honeypots', icon: ShieldAlert, label: 'Honeypot Trap', badge: '15' },
  { path: '/how-it-works', icon: Brain, label: 'Semantic Engine' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar glass ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo">
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-name">TalentLens</span>
              <span className="logo-badge">v2</span>
            </div>
          )}
        </NavLink>
        <button 
          className="sidebar-toggle btn-ghost btn-icon" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} className="sidebar-icon" />
            {!collapsed && (
              <>
                <span className="sidebar-label">{label}</span>
                {badge && <span className="sidebar-badge">{badge}</span>}
              </>
            )}
            {collapsed && (
              <div className="sidebar-tooltip">{label}</div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-link" style={{ cursor: 'default', opacity: 0.7 }}>
          <Sparkles size={20} className="sidebar-icon" style={{ color: 'var(--color-primary)' }} />
          {!collapsed && <span className="sidebar-label" style={{ fontSize: '0.75rem' }}>100K Analyzed in 12s</span>}
        </div>
      </div>
    </aside>
  );
}
