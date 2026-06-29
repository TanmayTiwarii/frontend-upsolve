import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 'fetch',   label: 'Fetching submissions',    duration: 900  },
  { id: 'profile', label: 'Building skill profile',  duration: 800  },
  { id: 'compute', label: 'Computing similarities',  duration: 1000 },
  { id: 'rank',    label: 'Ranking recommendations', duration: 700  },
];

export default function AnalysisProgress({ username }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    setCurrentStep(0);
    setCompletedSteps([]);
    let elapsed = 0;
    const timers = [];

    STEPS.forEach((step, idx) => {
      timers.push(setTimeout(() => setCurrentStep(idx), elapsed));
      elapsed += step.duration;
      timers.push(setTimeout(() => setCompletedSteps((p) => [...p, idx]), elapsed));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const getState = (idx) => {
    if (completedSteps.includes(idx) || idx < currentStep) return 'done';
    if (idx === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="analysis-screen">
      <div className="analysis-content">
        <div className="analysis-header">
          <span className="analysis-eyebrow">
            <Loader2 size={11} className="animate-spin" />
            Running analysis
          </span>
          <h2 className="analysis-title">
            Preparing your<br />personalized picks
          </h2>
          {username && (
            <div className="analysis-username-tag">
              <span style={{ color: 'var(--text-ghost)' }}>@</span>
              <strong>{username}</strong>
            </div>
          )}
        </div>

        <div className="analysis-steps">
          {STEPS.map((step, idx) => {
            const state = getState(idx);
            return (
              <div key={step.id} className={`analysis-step ${state}`}>
                <div className={`step-indicator ${state}`}>
                  {state === 'done'   ? <Check size={11} strokeWidth={3} /> :
                   state === 'active' ? <Loader2 size={11} className="animate-spin" /> :
                   <span>{idx + 1}</span>}
                </div>
                <span className="step-text">{step.label}</span>
                <span className="step-status">
                  {state === 'done'    ? '✓'         : ''}
                  {state === 'active'  ? '...'       : ''}
                  {state === 'pending' ? '--'        : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
