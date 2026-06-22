import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProblemGrid from './components/ProblemGrid';
import HowItWorks from './components/HowItWorks';
import Login from './components/Login';
import { fetchRecommendations, fetchLeetCodeProfile } from './api/client';
import { Terminal } from 'lucide-react';
import { getDailyProblems } from './data/problems';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('recommendations');

  // Username State (loaded from localStorage on init)
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('upsolve_username') || '';
  });



  // LeetCode Profile GraphQL State
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Keep localStorage updated when username changes
  useEffect(() => {
    localStorage.setItem('upsolve_username', username);
  }, [username]);

  // Fetch profile on initial load if username is already saved
  useEffect(() => {
    const storedUsername = localStorage.getItem('upsolve_username') || '';
    if (storedUsername.trim()) {
      fetchProfileDetails(storedUsername);
    }
  }, []);

  // Results State
  const [problems, setProblems] = useState(() => getDailyProblems());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recommendationType, setRecommendationType] = useState('similar');
  const [isDaily, setIsDaily] = useState(true);

  // Fetches LeetCode GraphQL profile details
  const fetchProfileDetails = async (name) => {
    if (!name || !name.trim()) return;
    setProfileLoading(true);
    setProfileError(null);
    try {
      const profile = await fetchLeetCodeProfile(name);
      setProfileData(profile);
    } catch (err) {
      console.error('[App] Failed to fetch LeetCode profile:', err);
      setProfileError(err.message || 'Failed to load LeetCode profile.');
      setProfileData(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogin = async (inputName) => {
    if (!inputName.trim()) return;

    setProfileLoading(true);
    setProfileError(null);
    try {
      const profile = await fetchLeetCodeProfile(inputName);
      setProfileData(profile);
      setUsername(inputName); // Only update resolved username on successful fetch
    } catch (err) {
      console.error('[App] Failed to fetch LeetCode profile:', err);
      setProfileError(err.message || 'Failed to load LeetCode profile.');
      setProfileData(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    setUsername('');
    setProfileData(null);
    setProblems(getDailyProblems());
    setIsDaily(true);
    setActiveTab('recommendations');
    localStorage.removeItem('upsolve_username');
  };

  // Triggered when requesting recommendations
  const handleFetchRecommendations = async (type) => {
    if (!username.trim()) {
      setError('Please enter a LeetCode username and press Enter first.');
      return;
    }
    
    // Refresh profile details alongside recommendations
    fetchProfileDetails(username);

    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecommendations(type, username);
      setProblems(data);
      setRecommendationType(type);
      setHasSearched(true);
      setIsDaily(false);
      // Auto-switch to recommendations tab when fetching new data
      setActiveTab('recommendations');
    } catch (err) {
      setError(err.message);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };



  const getSolvedStat = () => {
    if (profileLoading) return '...';
    if (profileData && profileData.solved !== null) return profileData.solved;
    return '—';
  };

  const getStreakStat = () => {
    if (profileLoading) return '...';
    if (profileData && profileData.streak !== null) return `${profileData.streak} Days`;
    return '—';
  };

  const getRankStat = () => {
    if (profileLoading) return '...';
    if (profileData && profileData.globalRanking !== null) {
      return `#${profileData.globalRanking.toLocaleString()}`;
    }
    return '—';
  };

  const getPointsStat = () => {
    if (profileLoading) return '...';
    if (profileData && profileData.rating !== null) {
      return Math.round(profileData.rating).toLocaleString();
    }
    return '—';
  };

  if (!username) {
    return <Login onLogin={handleLogin} loading={profileLoading} error={profileError} />;
  }

  return (
    <div className="app-container">
      {/* Header Navigation and Profile */}
      <Header
        username={username}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        avatarUrl={profileData?.avatar}
        onLogout={handleLogout}
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
                  <h1>Welcome back</h1>
                  <p>Analyze your LeetCode performance and conquer your next challenge.</p>
                </div>


              </section>

              <ProblemGrid
                problems={problems}
                loading={loading}
                error={error}
                showSimilarity={recommendationType === 'similar' && !isDaily}
                isDaily={isDaily}
              />
            </div>

            {/* Right sidebar column */}
            <Sidebar
              username={username}
              onFetch={handleFetchRecommendations}
              loading={loading}
              profileData={profileData}
              profileLoading={profileLoading}
              profileError={profileError}
              onLogout={handleLogout}
            />
          </main>

          {/* Bottom Skill Trajectory */}
          <section className="trajectory-panel">
            <div className="trajectory-header">
              <h3 className="trajectory-title">Current Skill Trajectory</h3>
            </div>

            <div className="trajectory-stats-row">
              <div className="trajectory-stat-box">
                <span className="box-label">Solved</span>
                <span className="box-value">{getSolvedStat()}</span>
              </div>
              <div className="trajectory-stat-box">
                <span className="box-label">Streak</span>
                <span className="box-value text-streak">{getStreakStat()}</span>
              </div>
              <div className="trajectory-stat-box">
                <span className="box-label">Global Rank</span>
                <span className="box-value">{getRankStat()}</span>
              </div>
              <div className="trajectory-stat-box">
                <span className="box-label">Points</span>
                <span className="box-value">{getPointsStat()}</span>
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
