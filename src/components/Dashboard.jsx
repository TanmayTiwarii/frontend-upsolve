import React from 'react';
import { Layers, Zap, ArrowRight } from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5)  return 'Up late';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good evening';
}

export default function Dashboard({ username, profileData, profileLoading, onFetch, loading }) {
  const stats = [
    {
      label: 'Solved',
      value: profileData?.totalSolved ?? profileData?.solved_count ?? '—',
      cls: '',
    },
    {
      label: 'Easy',
      value: profileData?.easySolved ?? '—',
      cls: 'accent',
    },
    {
      label: 'Medium',
      value: profileData?.mediumSolved ?? '—',
      cls: 'amber',
    },
    {
      label: 'Hard',
      value: profileData?.hardSolved ?? '—',
      cls: '',
    },
    {
      label: 'Streak',
      value: profileData?.streak ? `${profileData.streak}d` : '—',
      cls: 'accent',
    },
    {
      label: 'Global Rank',
      value: profileData?.globalRanking ? `#${profileData.globalRanking.toLocaleString()}` : '—',
      cls: '',
    },
    {
      label: 'Rating',
      value: profileData?.rating ? Math.round(profileData.rating) : '—',
      cls: 'amber',
    },
    {
      label: 'Top Weakness',
      value: profileData?.topWeakness ?? '—',
      cls: '',
    }
  ];

  return (
    <div className="dashboard">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <span className="greeting-salutation">{getGreeting()}</span>
        <h1 className="greeting-headline">
          {getGreeting()},{' '}
          <span className="greeting-username">
            {username || 'solver'}
          </span>
          .
        </h1>
        <p className="greeting-sub">
          Pick a mode below. We'll find the best 5 problems for you right now.
        </p>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-item-label">{s.label}</span>
            <span className={`stat-item-value ${s.cls}`}>
              {profileLoading ? '…' : s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="action-cards-grid">
        {/* Similar */}
        <button
          className="action-card indigo"
          onClick={() => onFetch('similar')}
          disabled={loading}
          type="button"
        >
          <div className="action-card-icon">
            <Layers size={18} />
          </div>
          <div className="action-card-body">
            <span className="action-card-title">Continue Learning</span>
            <p className="action-card-desc">
              5 problems that match your solving patterns — same algorithmic
              structures, new variations.
            </p>
          </div>
          <div className="action-card-btn">
            <span>Get similar problems</span>
            <span className="btn-arrow">
              <ArrowRight size={14} />
            </span>
          </div>
        </button>

        {/* Different */}
        <button
          className="action-card violet"
          onClick={() => onFetch('different')}
          disabled={loading}
          type="button"
        >
          <div className="action-card-icon">
            <Zap size={18} />
          </div>
          <div className="action-card-body">
            <span className="action-card-title">Explore New Territory</span>
            <p className="action-card-desc">
              5 problems in topics you haven't touched — scored by novelty and
              gap in your profile.
            </p>
          </div>
          <div className="action-card-btn">
            <span>Expand my skill set</span>
            <span className="btn-arrow">
              <ArrowRight size={14} />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
