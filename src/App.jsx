import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProblemGrid from './components/ProblemGrid';
import HowItWorks from './components/HowItWorks';
import { fetchRecommendations } from './api/client';
import { Terminal } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('recommendations');

  // Username State (loaded from localStorage on init)
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('upsolve_username') || '';
  });

  // Keep localStorage updated when username changes
  useEffect(() => {
    localStorage.setItem('upsolve_username', username);
  }, [username]);

  // Results State
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recommendationType, setRecommendationType] = useState('similar');

  // Triggered when requesting recommendations
  const handleFetchRecommendations = async (type) => {
    if (!username.trim()) {
      setError('Please enter a valid LeetCode username.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecommendations(type, username);
      setProblems(data);
      setRecommendationType(type);
      setHasSearched(true);
      // Auto-switch to recommendations tab when fetching new data
      setActiveTab('recommendations');
    } catch (err) {
      setError(err.message);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header Navigation and Profile */}
      <Header
        username={username}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Conditional tab rendering */}
      {activeTab === 'recommendations' ? (
        <>
          {/* Main Dashboard Layout */}
          <main className="app-main">
            {/* Left column (welcome message, username input, daily recommendations) */}
            <div className="main-column">
              <section className="welcome-section">
                <div className="welcome-title-group">
                  <h1>Welcome back, Engineer</h1>
                  <p>Analyze your LeetCode performance and conquer your next challenge.</p>
                </div>

                <div className="username-input-group">
                  <label htmlFor="usernameInput" className="username-label">
                    LeetCode Username
                  </label>
                  <div className="terminal-input-wrapper">
                    <Terminal size={16} className="terminal-icon" />
                    <input
                      id="usernameInput"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="larry_the_dev"
                      className="terminal-input"
                    />
                  </div>
                </div>
              </section>

              <ProblemGrid
                problems={problems}
                loading={loading}
                error={error}
                hasSearched={hasSearched}
                showSimilarity={recommendationType === 'similar'}
              />
            </div>

            {/* Right sidebar column */}
            <Sidebar
              username={username}
              onFetch={handleFetchRecommendations}
              loading={loading}
            />
          </main>

          {/* Bottom Skill Trajectory */}
          <section className="trajectory-panel">
            <div className="trajectory-header">
              <h3 className="trajectory-title">Current Skill Trajectory</h3>
              <div className="trajectory-progress-row">
                <div className="trajectory-progress-bar-wrapper">
                  <div
                    className="trajectory-progress-bar-fill"
                    style={{ width: hasSearched ? '75%' : '0%' }}
                  />
                </div>
                <span className="trajectory-percent">
                  {hasSearched ? '75% Complete' : '—% Complete'}
                </span>
              </div>
            </div>

            <div className="trajectory-stats-row">
              <div className="trajectory-stat-box">
                <span className="box-label">Solved</span>
                <span className="box-value">—</span>
              </div>
              <div className="trajectory-stat-box">
                <span className="box-label">Streak</span>
                <span className="box-value text-streak">—</span>
              </div>
              <div className="trajectory-stat-box">
                <span className="box-label">Global Rank</span>
                <span className="box-value">—</span>
              </div>
              <div className="trajectory-stat-box">
                <span className="box-label">Points</span>
                <span className="box-value">—</span>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Explanatory page explaining recommendations algorithms */
        <HowItWorks />
      )}
    </div>
  );
}
