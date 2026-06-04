import React from 'react';
import { Cpu, HelpCircle, HardDrive, Compass, Layers, Zap } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
      {/* Page Header */}
      <div className="welcome-section" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '1.5rem' }}>
        <div className="welcome-title-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HelpCircle size={28} className="text-streak" style={{ color: 'var(--accent-orange)' }} />
          <h1 style={{ margin: 0 }}>How It Works</h1>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: 'var(--text-gray)' }}>
          Upsolve uses a Machine Learning-powered engine built with FastAPI to analyze your LeetCode profile and suggest customized coding challenges.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="problems-grid" style={{ gridTemplateColumns: '1fr' }}>
        
        {/* Core Architecture */}
        <section className="hero-card" style={{ cursor: 'default' }}>
          <div className="hero-card-meta">
            <span className="weakness-tag" style={{ color: 'var(--accent-cyan)' }}>Architecture</span>
            <span className="difficulty-badge easy">FastAPI + Python</span>
          </div>
          <div className="hero-card-details">
            <h3 className="hero-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={20} />
              Recommendation Pipeline
            </h3>
            <p className="hero-card-description" style={{ marginTop: '0.5rem', color: 'var(--text-gray)' }}>
              When you enter your username, the backend retrieves your recent 20 submissions via LeetCode's GraphQL API. 
              These submissions are resolved into a list of solved question IDs.
              The backend then runs ML algorithms locally in RAM to identify which problems to recommend next, using offline-computed embeddings to avoid any runtime inference delay.
            </p>
          </div>
        </section>

        <div className="problems-grid" style={{ gap: '1.5rem' }}>
          {/* Similar Problems */}
          <section className="problem-card" style={{ cursor: 'default' }}>
            <div className="problem-card-header">
              <span className="difficulty-badge medium">Similar Problems</span>
              <Layers size={18} className="text-streak" style={{ color: 'var(--accent-orange)' }} />
            </div>
            <h3 className="problem-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} />
              Cosine Similarity Engine
            </h3>
            <p className="problem-card-description" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
              To recommend similar questions, the engine retrieves high-dimensional vector embeddings (generated offline using the <strong>paraphrase-MiniLM-L3-v2</strong> model on LeetCode problem difficulty and topics).
              It averages the vectors of your recently solved problems to construct your unique <strong>User Profile Vector</strong>, and measures the angles to all other database questions using <strong>Cosine Similarity</strong>. 
              A hybrid difficulty mixer ensures suggestions align with your recent Easy/Medium/Hard submission ratio.
            </p>
          </section>

          {/* Different Problems */}
          <section className="problem-card" style={{ cursor: 'default' }}>
            <div className="problem-card-header">
              <span className="difficulty-badge hard">Different Problems</span>
              <Layers size={18} className="text-streak" style={{ color: 'var(--color-hard)' }} />
            </div>
            <h3 className="problem-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} style={{ color: 'var(--color-hard)' }} />
              Tag-Weight Diversity Engine
            </h3>
            <p className="problem-card-description" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
              To push you outside your comfort zone, the engine uses a custom tag-weight algorithm. 
              Using a startup-prebuilt **tag-to-problem inverted index**, the engine maps the topics of your recent submissions to extract practiced tags and filters for <strong>unseen tags</strong>.
              Unseen topics receive a weight of 100 while practiced topics receive 1, and the candidate list is sampled probabilistically based on these weights, dynamically surfacing fresh and unpracticed topics.
            </p>
          </section>
        </div>

        {/* Optimizations */}
        <section className="trajectory-panel" style={{ marginTop: 0 }}>
          <div className="trajectory-header">
            <h3 className="trajectory-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HardDrive size={18} style={{ color: 'var(--accent-cyan)' }} />
              Performance & Optimization
            </h3>
          </div>
          <div className="trajectory-stats-row" style={{ gap: '1.25rem' }}>
            <div className="trajectory-stat-box">
              <span className="box-label">Redis Caching</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '0.25rem' }}>
                Solved problem IDs are cached for 10 minutes to bypass external API lookups, dropping response times from <strong>1.1s</strong> down to <strong>~70ms</strong>.
              </p>
            </div>
            <div className="trajectory-stat-box">
              <span className="box-label">GraphQL Aliasing</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '0.25rem' }}>
                Rather than resolving slugs sequentially (N+1 queries), the backend fetches user submission slugs and resolves IDs in just <strong>2 batched queries</strong>.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
