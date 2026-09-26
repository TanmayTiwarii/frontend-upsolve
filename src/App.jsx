import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import AnalysisProgress from './components/AnalysisProgress';
import Dashboard from './components/Dashboard';
import ProblemGrid from './components/ProblemGrid';
import HowItWorks from './components/HowItWorks';
import { fetchRecommendations, fetchLeetCodeProfile } from './api/client';

// App view states
const VIEW = {
  LANDING: 'landing',                 // not logged in
  ANALYZING_LOGIN: 'analyzing-login', // fetching profile after login submit
  DASHBOARD: 'dashboard',            // logged in, choose mode
  ANALYZING_RECS: 'analyzing-recs',   // fetching recommendations
  RECOMMENDATIONS: 'recommendations', // showing 5 picks
  HOW_IT_WORKS: 'how-it-works',       // explanatory tab
};

// Parse current URL into view & params
const parseUrlRoute = () => {
  const path = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const type = searchParams.get('type') === 'different' ? 'different' : 'similar';

  if (path.startsWith('/how-it-works')) {
    return { view: VIEW.HOW_IT_WORKS, type };
  }
  if (path.startsWith('/recommendations')) {
    return { view: VIEW.RECOMMENDATIONS, type };
  }
  if (path.startsWith('/dashboard')) {
    return { view: VIEW.DASHBOARD, type };
  }
  if (path.startsWith('/login')) {
    return { view: VIEW.LANDING, type };
  }
  return { view: null, type };
};

// Map view & params to clean URL path
const getUrlForRoute = (v, type = 'similar') => {
  switch (v) {
    case VIEW.LANDING:
      return '/login';
    case VIEW.DASHBOARD:
      return '/dashboard';
    case VIEW.RECOMMENDATIONS:
    case VIEW.ANALYZING_RECS:
      return `/recommendations?type=${type}`;
    case VIEW.HOW_IT_WORKS:
      return '/how-it-works';
    default:
      return '/';
  }
};

const updateDocumentTitle = (v, type = 'similar') => {
  switch (v) {
    case VIEW.DASHBOARD:
      document.title = 'Upsolve — Dashboard';
      break;
    case VIEW.RECOMMENDATIONS:
    case VIEW.ANALYZING_RECS:
      document.title = type === 'different' ? 'Upsolve — Exploration Picks' : 'Upsolve — Similar Picks';
      break;
    case VIEW.HOW_IT_WORKS:
      document.title = 'Upsolve — How It Works';
      break;
    case VIEW.LANDING:
    default:
      document.title = 'Upsolve — Know what to solve next';
      break;
  }
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
  const [recommendationType, setRecommendationType] = useState(() => {
    const route = parseUrlRoute();
    return route.type || 'similar';
  });

  // Initial view derived from URL & login state
  const [view, setView] = useState(() => {
    const stored = localStorage.getItem('upsolve_username');
    const route = parseUrlRoute();
    if (stored) {
      if (route.view && route.view !== VIEW.LANDING) {
        return route.view;
      }
      return VIEW.DASHBOARD;
    }
    if (route.view === VIEW.HOW_IT_WORKS) {
      return VIEW.HOW_IT_WORKS;
    }
    return VIEW.LANDING;
  });

  const lastFetchedRef = useRef({ username: '', type: '' });

  // Sync username to localStorage
  useEffect(() => {
    if (username) {
      localStorage.setItem('upsolve_username', username);
    } else {
      localStorage.removeItem('upsolve_username');
    }
  }, [username]);

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

  // Navigate helper: pushes or replaces history entry and updates document title
  const navigateTo = useCallback((targetView, params = {}, replace = false) => {
    const type = params.type || recommendationType;
    const targetUrl = getUrlForRoute(targetView, type);
    const stateObj = { app: true, view: targetView, type };

    if (replace) {
      window.history.replaceState(stateObj, '', targetUrl);
    } else {
      window.history.pushState(stateObj, '', targetUrl);
    }

    setView(targetView);
    if (params.type) {
      setRecommendationType(params.type);
    }
    updateDocumentTitle(targetView, type);
  }, [recommendationType]);

  // Fetch recommendations helper
  const fetchRecs = useCallback(async (type, user) => {
    if (!user) return;
    setRecError(null);
    setRecommendationType(type);
    lastFetchedRef.current = { username: user, type };

    try {
      const data = await fetchRecommendations(type, user);
      setProblems(data);
      setView(VIEW.RECOMMENDATIONS);
      updateDocumentTitle(VIEW.RECOMMENDATIONS, type);
    } catch (err) {
      setRecError(err.message);
      setView(VIEW.RECOMMENDATIONS);
      updateDocumentTitle(VIEW.RECOMMENDATIONS, type);
    }
  }, []);

  // Initial mount: synchronize URL and fetch data if appropriate
  useEffect(() => {
    const route = parseUrlRoute();
    const currentUrl = getUrlForRoute(view, recommendationType);
    window.history.replaceState({ app: true, view, type: recommendationType }, '', currentUrl);
    updateDocumentTitle(view, recommendationType);

    if (username) {
      fetchProfileSilent(username);

      // If user refreshed or landed directly on recommendations route
      if (route.view === VIEW.RECOMMENDATIONS) {
        setView(VIEW.ANALYZING_RECS);
        fetchRecs(route.type, username);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle browser Back and Forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      const route = parseUrlRoute();
      const state = event.state;
      const targetView = state?.view || route.view || (username ? VIEW.DASHBOARD : VIEW.LANDING);
      const targetType = state?.type || route.type || 'similar';

      setRecommendationType(targetType);
      setView(targetView);
      updateDocumentTitle(targetView, targetType);

      // If returning to recommendations via back/forward and no problems loaded yet
      if (targetView === VIEW.RECOMMENDATIONS && username) {
        if (
          problems.length === 0 ||
          lastFetchedRef.current.type !== targetType ||
          lastFetchedRef.current.username !== username
        ) {
          setView(VIEW.ANALYZING_RECS);
          fetchRecs(targetType, username);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [username, problems.length, fetchRecs]);

  // ---------- Login flow ----------
  const handleLogin = async (inputName) => {
    if (!inputName.trim()) return;
    const cleanName = inputName.trim();
    setProfileError(null);
    setView(VIEW.ANALYZING_LOGIN);

    try {
      const profile = await fetchLeetCodeProfile(cleanName);
      setProfileData(profile);
      setUsername(cleanName);
      navigateTo(VIEW.DASHBOARD, {}, true);
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
    navigateTo(VIEW.LANDING, {}, true);
  };

  // ---------- Fetch recommendations ----------
  const handleFetchRecommendations = async (type) => {
    if (!username.trim()) return;

    setRecError(null);
    setRecommendationType(type);

    // Push new history state pointing to /recommendations?type=...
    navigateTo(VIEW.ANALYZING_RECS, { type });

    // Refresh profile in background
    fetchProfileSilent(username);

    try {
      lastFetchedRef.current = { username, type };
      const data = await fetchRecommendations(type, username);
      setProblems(data);
      // Replace the analyzing state with recommendations in the same history slot
      navigateTo(VIEW.RECOMMENDATIONS, { type }, true);
    } catch (err) {
      setRecError(err.message);
      navigateTo(VIEW.RECOMMENDATIONS, { type }, true);
    }
  };

  // ---------- Nav tab switch ----------
  const handleTabSwitch = (tab) => {
    if (tab === 'how-it-works') {
      navigateTo(VIEW.HOW_IT_WORKS);
    } else {
      navigateTo(VIEW.DASHBOARD);
    }
  };

  // ---------- Back to dashboard ----------
  const handleBackToDashboard = () => {
    if (window.history.state?.app && window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo(username ? VIEW.DASHBOARD : VIEW.LANDING);
    }
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

  // 3. Main app shell (logged in or exploring How It Works)
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
        {view === VIEW.HOW_IT_WORKS && (
          <HowItWorks onBack={handleBackToDashboard} />
        )}

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
