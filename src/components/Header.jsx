import React from 'react';
import { Terminal, BookOpen, LogOut } from 'lucide-react';
import logo from '../assets/image.png';

export default function Header({ username, activeTab, setActiveTab, avatarUrl, onLogout }) {
  // Get first letter of username for avatar content
  const getAvatarContent = () => {
    if (username && username.trim()) {
      return username.trim().substring(0, 1).toUpperCase();
    }
    return '?';
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-badge">
          <img src={logo} alt="Upsolve Logo" />
        </div>
        <span className="brand-title">Upsolve</span>
      </div>

      <div className="header-nav">
        <nav className="nav-links">
          <button
            type="button"
            className={`nav-link ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Terminal size={16} />
            <span>Recommendations</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'how-it-works' ? 'active' : ''}`}
            onClick={() => setActiveTab('how-it-works')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <BookOpen size={16} />
            <span>How It Works</span>
          </button>
        </nav>

        <div className="header-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="header-avatar" title={username || 'Guest Profile'}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              getAvatarContent()
            )}
          </div>
          {username && (
            <button 
              type="button" 
              onClick={onLogout}
              className="btn-logout"
              title="Logout"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
