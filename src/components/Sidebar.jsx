import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

export default function Sidebar({ username, onFetch, loading }) {
  // Get initials for profile avatar
  const getAvatarContent = () => {
    if (username && username.trim()) {
      return username.trim().substring(0, 1).toUpperCase();
    }
    return 'G';
  };

  const handleFetch = (type) => {
    if (username && username.trim()) {
      onFetch(type);
    }
  };

  const isBtnDisabled = loading || !username || !username.trim();

  return (
    <aside className="sidebar-column">
      {/* Next Steps Panel */}
      <section className="sidebar-panel">
        <span className="sidebar-panel-label">Next Steps</span>
        
        <div className="next-steps-buttons">
          <button
            type="button"
            className="btn-sidebar btn-sidebar-primary"
            onClick={() => handleFetch('similar')}
            disabled={isBtnDisabled}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Loading...' : 'Recommend Similar'}</span>
          </button>

          <button
            type="button"
            className="btn-sidebar btn-sidebar-secondary"
            onClick={() => handleFetch('different')}
            disabled={isBtnDisabled}
          >
            <Zap size={16} />
            <span>{loading ? 'Loading...' : 'Recommend Different'}</span>
          </button>
        </div>

        <p className="sidebar-panel-footer">
          Based on your current session and historical performance.
        </p>
      </section>

      {/* Profile Panel */}
      <section className="sidebar-panel">
        <div className="profile-row">
          <div className="profile-avatar-large">
            {getAvatarContent()}
          </div>
          <div className="profile-name-group">
            <span className="profile-name">{username.trim() || 'guest_engineer'}</span>
            {username.trim() && <span className="profile-tier">Gold Tier Engineer</span>}
          </div>
        </div>

        <div className="profile-stats-list">
          <div className="profile-stat-row">
            <span className="stat-label">Problems Solved</span>
            <span className="stat-value">—</span>
          </div>
          <div className="profile-stat-row">
            <span className="stat-label">Top Weakness</span>
            <span className="stat-value text-weakness">—</span>
          </div>
          <div className="profile-stat-row">
            <span className="stat-label">Recent Activity</span>
            <span className="stat-value text-activity">—</span>
          </div>
        </div>
      </section>
    </aside>
  );
}
