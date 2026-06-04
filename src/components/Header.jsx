import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header animate-fade-in">
      <div className="header-brand">
        <div className="logo-glow">
          <Sparkles className="logo-icon" />
        </div>
        <div className="brand-text">
          <h1>UPSOLVE</h1>
          <p className="subtitle">LeetCode Recommendation Engine</p>
        </div>
      </div>
    </header>
  );
}
