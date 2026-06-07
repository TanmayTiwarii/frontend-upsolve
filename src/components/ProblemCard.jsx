import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';

export default function ProblemCard({ problem, showSimilarity, isHero = false }) {
  const { id, problem_name, difficulty, topics, similarity } = problem;

  // Convert problem name to standard LeetCode URL slug
  const getLeetCodeUrl = (name) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-')         // replace spaces with hyphens
      .replace(/-+/g, '-');         // remove duplicate hyphens
    return `https://leetcode.com/problems/${slug}/`;
  };

  // Convert topic string to array of tags
  const topicList = topics
    ? topics.split(',').map((topic) => topic.trim()).filter(Boolean)
    : [];

  const simPercent = similarity ? Math.round(similarity * 100) : null;
  const diffClass = difficulty ? difficulty.toLowerCase() : 'unknown';

  if (isHero) {
    return (
      <a
        href={getLeetCodeUrl(problem_name)}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-card"
      >
        <div className="hero-card-meta">
          <span className={`difficulty-badge ${diffClass}`}>{difficulty}</span>
        </div>

        <div className="hero-card-main">
          <div className="hero-card-details">
            <h3 className="hero-card-title">{problem_name}</h3>
            {/* Keeping description empty/blank as it is not available in the API */}
            <p className="hero-card-description"></p>
          </div>

          <div className="hero-card-stat">
            <span className="stat-label">
              {simPercent !== null ? 'Match Rate' : 'Success Rate'}
            </span>
            <span className="stat-value">
              {simPercent !== null ? `${simPercent}%` : '—'}
            </span>
          </div>
        </div>

        <div className="hero-card-footer">
          <div className="tags-row">
            {topicList.map((topic, index) => (
              <span key={index} className="tag-pill">
                {topic}
              </span>
            ))}
          </div>
          <div className="hero-arrow">
            <ArrowRight size={20} />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={getLeetCodeUrl(problem_name)}
      target="_blank"
      rel="noopener noreferrer"
      className="problem-card"
    >
      <div className="problem-card-header">
        <span className={`difficulty-badge ${diffClass}`}>{difficulty}</span>
        <div className="problem-card-link-icon">
          <ExternalLink size={16} />
        </div>
      </div>

      <div className="problem-card-title-row">
        <h3 className="problem-card-title">{problem_name}</h3>
      </div>

      {/* Keeping description empty/blank as it is not available in the API */}
      <p className="problem-card-description"></p>

      <div className="problem-card-footer">
        <div className="tags-row">
          {topicList.map((topic, index) => (
            <span key={index} className="tag-pill">
              {topic}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
