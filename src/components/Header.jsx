import React from 'react';
import { LayoutDashboard, BookOpen, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Header({ username, activeTab, setActiveTab, avatarUrl, onLogout }) {
  const getInitial = () => (username?.trim() ? username.trim()[0].toUpperCase() : '?');

  return (
    <header className="app-header">
      {/* Brand */}
      <div className="header-brand">
        <div className="logo-badge">
          <img src={logo} alt="Upsolve" />
        </div>
        <span className="brand-title">Upsolve</span>
      </div>

      {/* Nav */}
      <div className="header-nav">
        <nav className="nav-links" aria-label="Main navigation">
          <button
            type="button"
            id="nav-recommendations"
            className={`nav-link ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            id="nav-how-it-works"
            className={`nav-link ${activeTab === 'how-it-works' ? 'active' : ''}`}
            onClick={() => setActiveTab('how-it-works')}
          >
            <BookOpen size={14} />
            <span>How It Works</span>
          </button>
        </nav>

        {/* Profile + logout */}
        <div className="header-profile">
          <a 
            href={`https://leetcode.com/u/${username}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="header-avatar" 
            title={`View ${username}'s LeetCode Profile`}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} />
            ) : (
              getInitial()
            )}
          </a>
          {username && (
            <button
              type="button"
              id="btn-logout"
              onClick={onLogout}
              className="btn-logout"
              title="Sign out"
            >
              <LogOut size={13} />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
