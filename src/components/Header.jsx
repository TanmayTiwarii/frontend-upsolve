import React from 'react';
import { Terminal, BookOpen } from 'lucide-react';
import logo from '../assets/image.png';

export default function Header({ username, activeTab, setActiveTab }) {
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

        <div className="header-profile">
          <div className="header-avatar" title={username || 'Guest Profile'}>
            {getAvatarContent()}
          </div>
        </div>
      </div>
    </header>
  );
}
