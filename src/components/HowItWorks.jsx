import React from 'react';
import { Brain, HelpCircle, Database, Compass, Layers, Zap, GitBranch, Clock } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="hiw-page">
      {/* Hero header */}
      <div className="hiw-hero">
        <h1>
          <HelpCircle size={24} style={{ color: 'var(--coral)' }} />
          How It Works
        </h1>
        <p>
          Upsolve uses a Machine Learning–powered engine built with FastAPI and Python to analyze
          your LeetCode profile and recommend exactly 5 curated coding challenges — tailored to you.
        </p>
      </div>

      {/* Core architecture */}
      <div className="hiw-card">
        <div className="hiw-card-header">
          <span className="hiw-card-tag">
            <Brain size={11} /> Architecture
          </span>
          <span className="difficulty-badge easy" style={{ fontSize: '0.68rem' }}>FastAPI + Python</span>
        </div>
        <h3>
          <Database size={18} style={{ color: 'var(--coral)' }} />
          Recommendation Pipeline
        </h3>
        <p>
          When you enter your username, the backend retrieves your recent 20 submissions via
          LeetCode's GraphQL API and resolves them into solved problem IDs. The engine then
          runs ML algorithms locally in RAM — using offline-computed embeddings — to identify
          which 5 problems to surface next. No runtime inference delays.
        </p>
      </div>

      {/* Two-column: similar vs different */}
      <div className="hiw-grid-2">
        <div className="hiw-card">
          <div className="hiw-card-header">
            <span className="hiw-card-tag">
              <Layers size={11} /> Similar Mode
            </span>
          </div>
          <h3>
            <Compass size={17} style={{ color: 'var(--coral)' }} />
            Cosine Similarity Engine
          </h3>
          <p>
            Retrieves high-dimensional vector embeddings generated offline using{' '}
            <strong style={{ color: 'var(--text-secondary)' }}>paraphrase-MiniLM-L3-v2</strong>.
            Averages your recently solved problem vectors into a <em>User Profile Vector</em>,
            then ranks all other problems by cosine similarity. A hybrid difficulty mixer
            aligns suggestions with your Easy/Medium/Hard ratio.
          </p>
        </div>

        <div className="hiw-card">
          <div className="hiw-card-header">
            <span className="hiw-card-tag amber">
              <Zap size={11} /> Different Mode
            </span>
          </div>
          <h3>
            <Zap size={17} style={{ color: 'var(--amber)' }} />
            Tag-Weight Diversity Engine
          </h3>
          <p>
            Uses a pre-built tag-to-problem inverted index to extract your practiced tags,
            then filters for <strong style={{ color: 'var(--text-secondary)' }}>unseen topics</strong>.
            Unseen topics receive a weight of 100 while practiced topics receive 1.
            Candidates are sampled probabilistically — dynamically surfacing fresh, unexplored areas.
          </p>
        </div>
      </div>

      {/* Performance stats */}
      <div className="hiw-card">
        <div className="hiw-card-header">
          <span className="hiw-card-tag">
            <Clock size={11} /> Performance
          </span>
        </div>
        <h3 style={{ marginBottom: '1rem' }}>
          <Brain size={18} style={{ color: 'var(--coral)' }} />
          Optimizations
        </h3>
        <div className="hiw-stat-grid">
          <div className="hiw-stat-box">
            <span className="hiw-stat-label">Redis Caching</span>
            <p className="hiw-stat-body">
              Solved problem IDs are cached for 10 minutes, dropping response times from{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>1.1s → ~70ms</strong> on repeat queries.
            </p>
          </div>
          <div className="hiw-stat-box">
            <span className="hiw-stat-label">GraphQL Aliasing</span>
            <p className="hiw-stat-body">
              Submission slugs and IDs are resolved in just{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>2 batched queries</strong> —
              no N+1 request chains.
            </p>
          </div>
          <div className="hiw-stat-box">
            <span className="hiw-stat-label">Offline Embeddings</span>
            <p className="hiw-stat-body">
              All vector embeddings are precomputed and stored in RAM at startup — zero inference latency at request time.
            </p>
          </div>
          <div className="hiw-stat-box">
            <span className="hiw-stat-label">Always 5 Picks</span>
            <p className="hiw-stat-body">
              The engine always returns exactly 5 ranked recommendations — curated, not
              filtered or paginated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
