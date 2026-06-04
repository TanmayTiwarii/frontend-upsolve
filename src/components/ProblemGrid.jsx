import React from 'react';
import ProblemCard from './ProblemCard';
import { AlertCircle, Layers, CheckCircle } from 'lucide-react';

export default function ProblemGrid({ problems, loading, error, hasSearched, showSimilarity }) {
  if (loading) {
    return (
      <div className="grid-container">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="problem-card skeleton glass">
            <div className="skeleton-line skeleton-header" />
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-progress" />
            <div className="skeleton-line skeleton-tags" />
            <div className="skeleton-line skeleton-button" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container glass state-error">
        <AlertCircle className="status-icon text-red animate-bounce" size={48} />
        <h2>Connection Error</h2>
        <p className="status-message">{error}</p>
        <p className="help-text">Verify that the backend is online and the LeetCode profile exists.</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="status-container glass state-prompt">
        <Layers className="status-icon text-indigo" size={48} />
        <h2>Ready for Upsolving</h2>
        <p className="status-message">
          Enter a LeetCode username in the input panel and click on either "Recommend Similar" to practice related problems, or "Recommend Different" to expand your skills.
        </p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="status-container glass state-empty">
        <Layers className="status-icon text-muted" size={48} />
        <h2>No Recommendations Found</h2>
        <p className="status-message">
          No problem recommendations were returned for this LeetCode username. Ensure that the profile is active and has solved problems.
        </p>
      </div>
    );
  }

  return (
    <div className="results-wrapper">
      <div className="results-meta">
        <CheckCircle size={14} className="text-emerald" />
        <span>Found {problems.length} recommendation{problems.length === 1 ? '' : 's'}</span>
      </div>
      <div className="grid-container">
        {problems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} showSimilarity={showSimilarity} />
        ))}
      </div>
    </div>
  );
}
