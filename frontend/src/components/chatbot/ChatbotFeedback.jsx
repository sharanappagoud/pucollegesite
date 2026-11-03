import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';

export const ChatbotFeedback = ({ logId, currentFeedback, onSubmitFeedback }) => {
  const [feedback, setFeedback] = useState(currentFeedback || null);
  const [submitted, setSubmitted] = useState(false);

  if (!logId) return null;

  const handleVote = (rating) => {
    if (submitted) return;
    setFeedback(rating);
    setSubmitted(true);
    if (onSubmitFeedback) {
      onSubmitFeedback(logId, rating);
    }
  };

  return (
    <div className="mpuc-feedback-row">
      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Was this helpful?</span>
      <button
        type="button"
        className={`mpuc-feedback-btn ${feedback === 1 ? 'active-up' : ''}`}
        onClick={() => handleVote(1)}
        title="Yes, helpful"
        disabled={submitted}
        aria-label="Thumbs up"
      >
        <ThumbsUp size={12} />
      </button>
      <button
        type="button"
        className={`mpuc-feedback-btn ${feedback === -1 ? 'active-down' : ''}`}
        onClick={() => handleVote(-1)}
        title="No, not helpful"
        disabled={submitted}
        aria-label="Thumbs down"
      >
        <ThumbsDown size={12} />
      </button>
      {submitted && (
        <span style={{ fontSize: '0.65rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Check size={11} /> Thank you
        </span>
      )}
    </div>
  );
};

export default ChatbotFeedback;
