import React from 'react';
import ProblemCard from './ProblemCard';
import { AlertCircle, Terminal, RefreshCw } from 'lucide-react';

export default function ProblemGrid({ problems, loading, error, hasSearched, showSimilarity }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Hero Card Skeleton */}
        <div className="skeleton-card" style={{ height: '240px' }}>
          <div className="skeleton-shimmer sk-line-sm" />
          <div className="skeleton-shimmer sk-line-md" style={{ height: '36px', marginTop: '10px' }} />
          <div className="skeleton-shimmer sk-line-lg" style={{ height: '16px', marginTop: '10px' }} />
          <div className="skeleton-shimmer sk-tags" style={{ marginTop: '20px' }} />
        </div>
        {/* Grid Skeletons */}
        <div className="problems-grid">
          {[1, 2, 4].map((idx) => (
            <div key={idx} className="skeleton-card" style={{ height: '180px' }}>
              <div className="skeleton-shimmer sk-line-sm" />
              <div className="skeleton-shimmer sk-line-md" style={{ marginTop: '10px' }} />
              <div className="skeleton-shimmer sk-tags" style={{ marginTop: '20px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container status-error">
        <AlertCircle className="status-error-icon" size={36} />
        <h2 className="status-title">Connection Error</h2>
        <p className="status-desc">{error}</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="status-container">
        <Terminal className="status-icon" size={36} />
        <h2 className="status-title">Ready for Recommendations</h2>
        <p className="status-desc">
          Enter a LeetCode username in the field above and request recommendations using the buttons in the sidebar.
        </p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="status-container">
        <RefreshCw className="status-icon" size={36} />
        <h2 className="status-title">No Recommendations Found</h2>
        <p className="status-desc">
          We couldn't retrieve recommendations for this username. Please ensure the profile is public and has active submissions.
        </p>
      </div>
    );
  }

  const heroProblem = problems[0];
  const gridProblems = problems.slice(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Section Title */}
      <div className="section-header-row">
        <h2 className="section-title">⚡ Daily Recommendations</h2>
        <span className="session-pill">SESSION: #412</span>
      </div>

      {/* Hero card pick */}
      {heroProblem && (
        <ProblemCard
          problem={heroProblem}
          showSimilarity={showSimilarity}
          isHero={true}
        />
      )}

      {/* Remaining recommendations grid */}
      {gridProblems.length > 0 && (
        <div className="problems-grid">
          {gridProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              showSimilarity={showSimilarity}
              isHero={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
