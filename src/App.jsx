import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProblemGrid from './components/ProblemGrid';
import HowItWorks from './components/HowItWorks';
import { fetchRecommendations, fetchLeetCodeProfile } from './api/client';
import { Terminal } from 'lucide-react';
const DEFAULT_PROBLEMS = [
  {
    id: 146,
    problem_name: 'LRU Cache',
    difficulty: 'Hard',
    topics: 'Hash Table, Linked List, Design',
    similarity: 0.412
  },
  {
    id: 1,
    problem_name: 'Two Sum',
    difficulty: 'Easy',
    topics: 'Array',
    similarity: 0.85
  },
  {
    id: 3,
    problem_name: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topics: 'String, Sliding Window',
    similarity: 0.72
  },
  {
    id: 11,
    problem_name: 'Container With Most Water',
    difficulty: 'Medium',
    topics: 'Greedy, Two Pointers',
    similarity: 0.65
  },
  {
    id: 23,
    problem_name: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    topics: 'Heap, Divide & Conquer',
    similarity: 0.58
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('recommendations');

  // Username State (loaded from localStorage on init)
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('upsolve_username') || '';
  });

  // Temporary Input Value State
  const [inputValue, setInputValue] = useState(() => {
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

  // Results State (initialized with default problems so it is never empty)
  const [problems, setProblems] = useState(DEFAULT_PROBLEMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recommendationType, setRecommendationType] = useState('similar');

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

  // Triggered when LeetCode Username input is submitted
  const handleUsernameSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    setProfileLoading(true);
    setProfileError(null);
    try {
      const profile = await fetchLeetCodeProfile(inputValue);
      setProfileData(profile);
      setUsername(inputValue); // Only update resolved username on successful fetch
    } catch (err) {
      console.error('[App] Failed to fetch LeetCode profile:', err);
      setProfileError(err.message || 'Failed to load LeetCode profile.');
      setProfileData(null);
    } finally {
      setProfileLoading(false);
    }
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

  return (
    <div className="app-container">
      {/* Header Navigation and Profile */}
      <Header
        username={username}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        avatarUrl={profileData?.avatar}
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
                  <form onSubmit={handleUsernameSubmit} className="terminal-input-wrapper">
                    <Terminal size={16} className="terminal-icon" />
                    <input
                      id="usernameInput"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="larry_the_dev"
                      className="terminal-input"
                      style={{ paddingRight: '80px' }}
                    />
                    <button
                      type="submit"
                      className="btn-input-enter"
                      disabled={profileLoading || !inputValue.trim()}
                    >
                      {profileLoading ? '...' : 'Enter'}
                    </button>
                  </form>
                </div>
              </section>

              <ProblemGrid
                problems={problems}
                loading={loading}
                error={error}
                showSimilarity={recommendationType === 'similar'}
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
