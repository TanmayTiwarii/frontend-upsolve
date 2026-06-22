import React, { useState } from 'react';
import { Terminal, Loader2 } from 'lucide-react';
import logo from '../assets/image.png';

export default function Login({ onLogin, loading, error }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onLogin(inputValue.trim());
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
          <Loader2 className="animate-spin" size={48} style={{ color: 'var(--color-primary, #3498db)', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text, #fff)' }}>Authenticating...</h2>
          <p style={{ color: 'var(--color-text-secondary, #a0aabf)', textAlign: 'center', fontSize: '0.9rem' }}>
            Fetching your LeetCode profile securely.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="logo-badge">
            <img src={logo} alt="Upsolve Logo" />
          </div>
          <h1 className="brand-title">Upsolve</h1>
        </div>
        
        <p className="login-subtitle">Enter your LeetCode username to continue.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="terminal-input-wrapper">
            <Terminal size={18} className="terminal-icon" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="leetcode_username"
              className="terminal-input"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn-login-submit"
            disabled={!inputValue.trim() || loading}
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        </form>
        {error && (
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--color-hard, #e74c3c)',
            background: 'var(--color-hard-bg, rgba(231, 76, 60, 0.1))',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm, 6px)',
            border: '1px solid rgba(231, 76, 60, 0.2)',
            marginTop: '1.25rem',
            lineHeight: 1.4,
            textAlign: 'center'
          }}>
            {error.includes('Failed to fetch')
              ? '⚠️ Network error or CORS policy blocked the request.'
              : `⚠️ ${error}`}
          </div>
        )}
      </div>
    </div>
  );
}
