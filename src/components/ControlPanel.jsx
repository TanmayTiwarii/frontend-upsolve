import React from 'react';
import { Flame, Shuffle, User } from 'lucide-react';

export default function ControlPanel({
  username,
  setUsername,
  onFetch,
  loading
}) {
  const handleSubmit = (e, type) => {
    e.preventDefault();
    onFetch(type);
  };

  return (
    <div className="control-panel glass single-column">
      <div className="panel-section">
        <div className="section-header">
          <User size={16} className="text-violet" />
          <h2>Enter Profile</h2>
        </div>
        <form className="request-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="usernameInputText" className="form-label">LeetCode Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon text-muted" />
              <input
                id="usernameInputText"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. tiwaritanmay424"
                className="search-input"
              />
            </div>
            <p className="help-text">Input a LeetCode username to analyze and recommend problems.</p>
          </div>

          <div className="button-group">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'similar')}
              disabled={loading || !username.trim()}
              className="btn-recommend btn-similar"
            >
              <Flame size={16} />
              <span>{loading ? 'Recommending...' : 'Recommend Similar'}</span>
            </button>
            
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'different')}
              disabled={loading || !username.trim()}
              className="btn-recommend btn-different"
            >
              <Shuffle size={16} />
              <span>{loading ? 'Recommending...' : 'Recommend Different'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
