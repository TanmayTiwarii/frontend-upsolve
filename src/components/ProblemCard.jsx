import React from 'react';
import { ExternalLink, Lightbulb } from 'lucide-react';

/**
 * Curated pick card — used in the 5-card recommendation screen.
 * Props:
 *   problem:        { id, problem_name, difficulty, topics, similarity }
 *   index:          0-based position (0–4)
 *   showSimilarity: bool
 *   recommendationType: 'similar' | 'different'
 */
export default function ProblemCard({ problem, index = 0, showSimilarity = false, recommendationType = 'similar' }) {
  const { problem_name, difficulty, topics, similarity } = problem;

  // Build LeetCode URL slug
  const getLeetCodeUrl = (name) => {
    const slug = (name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return `https://leetcode.com/problems/${slug}/`;
  };

  // Parse topics
  const topicList = topics
    ? topics.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  // Score
  const simPercent = similarity != null ? Math.round(similarity * 100) : null;
  const diffClass = (difficulty || '').toLowerCase() || 'unknown';

  // Per-card explanation based on position + type
  const getExplanation = () => {
    if (recommendationType === 'similar') {
      const explanations = [
        'Builds directly on patterns you\'ve mastered',
        'Shares core algorithmic structure with your history',
        'Similar problem shape with a fresh constraint',
        'Reinforces a technique you\'ve recently practiced',
        'Applies familiar concepts in a new context',
      ];
      return explanations[index % explanations.length];
    } else {
      const explanations = [
        'Introduces a concept you haven\'t explored yet',
        'Expands your toolkit into unexplored territory',
        'A fresh topic to broaden your problem-solving range',
        'Targets a gap in your current skill profile',
        'Challenges you with a completely new pattern',
      ];
      return explanations[index % explanations.length];
    }
  };

  const scoreLabel = recommendationType === 'similar' ? 'Match' : 'Novelty';

  return (
    <a
      href={getLeetCodeUrl(problem_name)}
      target="_blank"
      rel="noopener noreferrer"
      className="pick-card"
      title={`Open ${problem_name} on LeetCode`}
    >
      {/* Big background pick number */}
      <span className="pick-num" aria-hidden="true">#{index + 1}</span>

      {/* Top row: badges */}
      <div className="pick-card-top">
        <span className={`difficulty-badge ${diffClass}`}>{difficulty || 'Unknown'}</span>
        {topicList.slice(0, 3).map((t, i) => (
          <span key={i} className="tag-pill">{t}</span>
        ))}
        {topicList.length > 3 && (
          <span className="tag-pill">+{topicList.length - 3}</span>
        )}
      </div>

      {/* Title + score */}
      <div className="pick-card-meta">
        <div className="pick-card-left">
          <h3 className="pick-card-title">{problem_name}</h3>

          {/* Explanation */}
          <div className="pick-card-explanation">
            <Lightbulb size={12} style={{ flexShrink: 0, color: 'var(--coral)' }} />
            <span>{getExplanation()}</span>
          </div>
        </div>

        {/* Score box */}
        {simPercent != null && (
          <div className={`score-display has-score`}>
            <span className="score-value">{simPercent}%</span>
            <span className="score-label">{scoreLabel}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="btn-solve">
        <ExternalLink size={15} />
        <span>Solve on LeetCode</span>
      </div>
    </a>
  );
}
