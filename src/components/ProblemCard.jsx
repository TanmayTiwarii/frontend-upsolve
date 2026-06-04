import React from 'react';
import { ExternalLink, Award, Hash } from 'lucide-react';

export default function ProblemCard({ problem, showSimilarity }) {
  const { id, problem_name, difficulty, topics, similarity } = problem;

  // Convert difficulty to color class
  const getDifficultyClass = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'diff-easy';
      case 'medium':
        return 'diff-medium';
      case 'hard':
        return 'diff-hard';
      default:
        return 'diff-unknown';
    }
  };

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

  const simPercent = Math.round(similarity * 100);

  return (
    <div className={`problem-card glass-hover ${getDifficultyClass(difficulty)}`}>
      <div className="card-top">
        <span className="problem-id">#{id}</span>
        <span className={`difficulty-badge ${getDifficultyClass(difficulty)}`}>
          <Award size={12} />
          {difficulty}
        </span>
      </div>

      <h3 className="problem-title">{problem_name}</h3>

      {showSimilarity && (
        <div className="similarity-section">
          <div className="similarity-meta">
            <span className="similarity-label">Similarity Match</span>
            <span className="similarity-value">{simPercent}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-bar" 
              style={{ width: `${simPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="topics-section">
        <div className="topics-label">
          <Hash size={12} />
          <span>Topics</span>
        </div>
        <div className="topics-list">
          {topicList.map((topic, index) => (
            <span key={index} className="topic-tag">
              {topic}
            </span>
          ))}
          {topicList.length === 0 && <span className="no-topics">General</span>}
        </div>
      </div>

      <div className="card-actions">
        <a 
          href={getLeetCodeUrl(problem_name)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="solve-link"
        >
          <span>Solve Problem</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
