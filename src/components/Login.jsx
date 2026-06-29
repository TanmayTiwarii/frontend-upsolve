import React, { useState } from 'react';
import { User, ArrowRight, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Login({ onLogin, loading, error }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) onLogin(inputValue.trim());
  };

  return (
    <div className="login-page">
      {/* LEFT — editorial hero */}
      <div className="login-left">
        {/* Top brand */}
        <div className="login-left-top">
          <div className="login-left-logo">
            <img src={logo} alt="Upsolve" />
          </div>
          <span className="login-left-brand">Upsolve</span>
        </div>

        {/* Main hero text */}
        <div className="login-left-hero">
          <span className="login-eyebrow">LeetCode · AI Recommendations</span>
          <h1 className="login-headline">
            Know what to<br />
            solve <em>next.</em>
          </h1>
          <p className="login-desc">
            Analyzes your LeetCode solved history and surfaces
            exactly 5 curated problems — using semantic embeddings,
            not random picks.
          </p>
        </div>

        {/* Footer stats */}
        <div className="login-left-footer">
          <div className="login-stat">
            <span className="login-stat-num">5</span>
            <span className="login-stat-label">Curated picks</span>
          </div>
          <div className="login-stat-divider" />
          <div className="login-stat">
            <span className="login-stat-num">ML</span>
            <span className="login-stat-label">Powered engine</span>
          </div>
          <div className="login-stat-divider" />
          <div className="login-stat">
            <span className="login-stat-num">2</span>
            <span className="login-stat-label">Learning modes</span>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="login-right">
        <div className="login-right-label">Get started</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2 className="login-right-heading">
            Enter your username to analyze your profile.
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label" htmlFor="lc-username">
              LeetCode Username
            </label>
            <div className="input-wrapper">
              <User size={15} className="input-icon" />
              <input
                id="lc-username"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="your_username"
                className="text-input"
                disabled={loading}
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-ghost)', marginTop: '0.1rem' }}>
              Want to try it out? Use demo account:{' '}
              <button 
                type="button" 
                onClick={() => setInputValue('tiwaritanmay424')} 
                style={{ 
                  background: 'transparent', border: 'none', 
                  color: 'var(--coral)', cursor: 'pointer', 
                  padding: 0, fontFamily: 'var(--font-mono)',
                  textDecoration: 'underline'
                }}
              >
                tiwaritanmay424
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-cta"
            disabled={!inputValue.trim() || loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <span>Analyze Profile</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="error-box">
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>
              {error.includes('Failed to fetch')
                ? 'Network error — check your connection or try again.'
                : error.replace(/^Error:\s*/i, '')}
            </span>
          </div>
        )}

        <div className="login-right-footer">
          <span style={{ fontFamily: 'var(--font-mono)' }}>↳</span>
          <span>Powered by paraphrase-MiniLM-L3-v2 embeddings</span>
        </div>
      </div>
    </div>
  );
}
