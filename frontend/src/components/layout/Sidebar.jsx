import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Upload, 
  BriefcaseBusiness, 
  Users, 
  Sparkles,
  Gem,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/jobs', icon: BriefcaseBusiness, label: 'Jobs' },
  { path: '/candidates', icon: Users, label: 'Candidates' },
  { path: '/match', icon: Sparkles, label: 'Match', badge: 'AI' },
  { path: '/discover', icon: Gem, label: 'Hidden Talent' },
  { path: '/add', icon: Upload, label: 'Add Candidate' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
              <span className="logo-badge">AI</span>
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
        <NavLink to="/settings" className="sidebar-link">
          <Settings size={20} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-label">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
