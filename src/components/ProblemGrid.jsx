import React from 'react';
import ProblemCard from './ProblemCard';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ProblemGrid({ problems, loading, error, showSimilarity }) {
  // Get a deterministic daily index based on current date string (e.g. "2026-06-04")
  const getDailyIndex = (length) => {
    if (length <= 1) return 0;
    const dateStr = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % length;
  };

  const heroIndex = problems.length > 0 ? getDailyIndex(problems.length) : 0;
  const heroProblem = problems.length > 0 ? problems[heroIndex] : null;
  const gridProblems = problems.length > 0 ? problems.filter((_, idx) => idx !== heroIndex) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Section Title - Always visible */}
      <div className="section-header-row">
        <h2 className="section-title">⚡ Daily Recommendations</h2>
      </div>

      {/* Render content based on state */}
      {loading ? (
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
      ) : error ? (
        <div className="status-container status-error" style={{ padding: '3rem 2rem' }}>
          <AlertCircle className="status-error-icon" size={36} />
          <h2 className="status-title">Connection Error</h2>
          <p className="status-desc">{error}</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="status-container" style={{ padding: '3rem 2rem' }}>
          <RefreshCw className="status-icon" size={36} />
          <h2 className="status-title">No Recommendations Found</h2>
          <p className="status-desc">
            We couldn't retrieve recommendations. Please check the profile and try again.
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
