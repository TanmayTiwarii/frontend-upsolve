import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import AnalysisProgress from './components/AnalysisProgress';
import Dashboard from './components/Dashboard';
import ProblemGrid from './components/ProblemGrid';
import HowItWorks from './components/HowItWorks';
import { fetchRecommendations, fetchLeetCodeProfile } from './api/client';

// App view states
const VIEW = {
  LANDING: 'landing',           // not logged in
  ANALYZING_LOGIN: 'analyzing-login', // fetching profile after login submit
  DASHBOARD: 'dashboard',        // logged in, no recommendations yet
  ANALYZING_RECS: 'analyzing-recs',   // fetching recommendations
  RECOMMENDATIONS: 'recommendations', // showing 5 picks
  HOW_IT_WORKS: 'how-it-works', // explanatory tab
};

export default function App() {
  // Persist username in localStorage
  const [username, setUsername] = useState(() => localStorage.getItem('upsolve_username') || '');

  // Profile
  const [profileData, setProfileData] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // Recommendations
  const [problems, setProblems] = useState([]);
  const [recError, setRecError] = useState(null);
  const [recommendationType, setRecommendationType] = useState('similar');

  // View routing
  const [view, setView] = useState(username ? VIEW.DASHBOARD : VIEW.LANDING);

  // Sync username to localStorage
  useEffect(() => {
    if (username) {
      localStorage.setItem('upsolve_username', username);
    } else {
      localStorage.removeItem('upsolve_username');
    }
  }, [username]);

  // On initial mount, if username stored, try fetching profile
  useEffect(() => {
    const stored = localStorage.getItem('upsolve_username');
    if (stored) {
      fetchProfileSilent(stored);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Silently fetch profile (no view change)
  const fetchProfileSilent = async (name) => {
    try {
      const profile = await fetchLeetCodeProfile(name);
      setProfileData(profile);
      setProfileError(null);
    } catch (err) {
      setProfileError(err.message);
    }
  };

  // ---------- Login flow ----------
  const handleLogin = async (inputName) => {
    if (!inputName.trim()) return;
    setProfileError(null);
    setView(VIEW.ANALYZING_LOGIN);

    try {
      const profile = await fetchLeetCodeProfile(inputName.trim());
      setProfileData(profile);
      setUsername(inputName.trim());
      setView(VIEW.DASHBOARD);
    } catch (err) {
      setProfileError(err.message || 'Failed to load LeetCode profile.');
      setView(VIEW.LANDING);
    }
  };

  // ---------- Logout ----------
  const handleLogout = () => {
    setUsername('');
    setProfileData(null);
    setProblems([]);
    setRecError(null);
    setProfileError(null);
    setView(VIEW.LANDING);
  };

  // ---------- Fetch recommendations ----------
  const handleFetchRecommendations = async (type) => {
    if (!username.trim()) return;

    setRecError(null);
    setRecommendationType(type);
    setView(VIEW.ANALYZING_RECS);

    // Refresh profile in background
    fetchProfileSilent(username);

    try {
      const data = await fetchRecommendations(type, username);
      setProblems(data);
      setView(VIEW.RECOMMENDATIONS);
    } catch (err) {
      setRecError(err.message);
      setView(VIEW.RECOMMENDATIONS); // show error state inside ProblemGrid
    }
  };

  // ---------- Nav tab switch ----------
  const handleTabSwitch = (tab) => {
    if (tab === 'how-it-works') {
      setView(VIEW.HOW_IT_WORKS);
    } else {
      // 'recommendations' tab → go back to dashboard or recs
      if (view === VIEW.RECOMMENDATIONS || view === VIEW.ANALYZING_RECS) {
        setView(VIEW.RECOMMENDATIONS);
      } else {
        setView(VIEW.DASHBOARD);
      }
    }
  };

  // Back from recommendations → dashboard
  const handleBackToDashboard = () => {
    setProblems([]);
    setRecError(null);
    setView(VIEW.DASHBOARD);
  };

  // ============================================================
  // RENDER
  // ============================================================

  // 1. Not logged in → Landing
  if (view === VIEW.LANDING) {
    return (
      <Login
        onLogin={handleLogin}
        loading={false}
        error={profileError}
      />
    );
  }

  // 2. Analyzing login (fetching profile after submit)
  if (view === VIEW.ANALYZING_LOGIN) {
    return (
      <AnalysisProgress username={username || ''} />
    );
  }

  // 3. Main app shell (logged in)
  const activeTab =
    view === VIEW.HOW_IT_WORKS ? 'how-it-works' : 'recommendations';

  return (
    <div className="app-container">
      <Header
        username={username}
        activeTab={activeTab}
        setActiveTab={handleTabSwitch}
        avatarUrl={profileData?.avatar}
        onLogout={handleLogout}
      />

      <main className="app-main">
        {/* --- How It Works tab --- */}
        {view === VIEW.HOW_IT_WORKS && <HowItWorks />}

        {/* --- Dashboard (choose mode) --- */}
        {view === VIEW.DASHBOARD && (
          <Dashboard
            username={username}
            profileData={profileData}
            profileLoading={false}
            onFetch={handleFetchRecommendations}
            loading={false}
          />
        )}

        {/* --- Analyzing recommendations --- */}
        {view === VIEW.ANALYZING_RECS && (
          <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnalysisProgress username={username} />
          </div>
        )}

        {/* --- Recommendations screen --- */}
        {view === VIEW.RECOMMENDATIONS && (
          <ProblemGrid
            problems={problems}
            loading={false}
            error={recError}
            recommendationType={recommendationType}
            onBack={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  );
}
