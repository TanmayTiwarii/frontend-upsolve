import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ProblemGrid from './components/ProblemGrid';
import { fetchRecommendations } from './api/client';

export default function App() {
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
    } catch (err) {
      setError(err.message);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="bg-glow-orb orb-1"></div>
      <div className="bg-glow-orb orb-2"></div>
      <Header />

      <main className="app-main">
        <ControlPanel
          username={username}
          setUsername={setUsername}
          onFetch={handleFetchRecommendations}
          loading={loading}
        />

        <div style={{ marginTop: '2.5rem' }}>
          <ProblemGrid
            problems={problems}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
            showSimilarity={recommendationType === 'similar'}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Upsolve Recommendation Client © 2026. Made with ❤️ for competitive programmers.
          {" | "}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            Documentation
          </a>
        </p>
      </footer>
    </div>
  );
}
