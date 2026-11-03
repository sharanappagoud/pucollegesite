import React from 'react';
import { HelpCircle } from 'lucide-react';

export const SuggestedQuestions = ({ suggestions = [], onSelectQuestion }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mpuc-suggestions-container">
      <div className="mpuc-suggestions-label">
        Suggested Inquiries
      </div>
      <div className="mpuc-suggestions-list">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            className="mpuc-suggestion-chip"
            onClick={() => onSelectQuestion(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
