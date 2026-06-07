import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import logo from '../assets/image.png';

export default function Login({ onLogin, loading }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onLogin(inputValue.trim());
    }
  };

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
      </div>
    </div>
  );
}
