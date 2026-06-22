import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

export default function Sidebar({
  username,
  onFetch,
  loading,
  profileData,
  profileLoading,
  profileError
}) {
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

  // Determine value text
  const getSolvedText = () => {
    if (profileLoading) return '...';
    if (profileData && profileData.solved !== null) {
      return profileData.solved;
    }
    return '—';
  };

  const getWeaknessText = () => {
    if (profileLoading) return '...';
    if (profileData && profileData.topWeakness) {
      return profileData.topWeakness;
    }
    return '—';
  };

  const getActivityText = () => {
    if (profileLoading) return '...';
    if (profileData) return 'Active';
    return '—';
  };

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
            {profileData && profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt={username}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              getAvatarContent()
            )}
          </div>
          <div className="profile-name-group" style={{ flex: 1 }}>
            <span className="profile-name">{username.trim() || 'guest_engineer'}</span>
          </div>
        </div>

        <div className="profile-stats-list">
          <div className="profile-stat-row">
            <span className="stat-label">Problems Solved</span>
            <span className="stat-value">{getSolvedText()}</span>
          </div>
          <div className="profile-stat-row">
            <span className="stat-label">Top Weakness</span>
            <span className="stat-value text-weakness">{getWeaknessText()}</span>
          </div>
          <div className="profile-stat-row">
            <span className="stat-label">Recent Activity</span>
            <span className="stat-value text-activity">{getActivityText()}</span>
          </div>
        </div>

        {/* Display profile fetching errors (e.g. CORS block, user not found) */}
        {profileError && (
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--color-hard)',
            background: 'var(--color-hard-bg)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(231, 76, 60, 0.1)',
            marginTop: '0.5rem',
            lineHeight: 1.4
          }}>
            {profileError.includes('Failed to fetch')
              ? '⚠️ LeetCode profile blocked by browser CORS policy.'
              : `⚠️ LeetCode profile error: ${profileError}`}
          </div>
        )}
      </section>
    </aside>
  );
}
