import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const MAX_CHAR_LIMIT = 500;

export const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading || disabled) return;
    onSendMessage(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const charsLeft = MAX_CHAR_LIMIT - text.length;

  return (
    <div className="mpuc-chat-footer">
      <form onSubmit={handleSubmit} className="mpuc-input-form">
        <input
          type="text"
          className="mpuc-input-field"
          placeholder="Ask a question about courses, admissions, fees..."
          value={text}
          maxLength={MAX_CHAR_LIMIT}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
          aria-label="Ask a question"
        />

        <button
          type="submit"
          className="mpuc-send-btn"
          disabled={!text.trim() || isLoading || disabled}
          title="Send Message"
          aria-label="Send Message"
        >
          <Send size={16} />
        </button>
      </form>

      <div className="mpuc-input-meta">
        <span>Supports English & ಕನ್ನಡ</span>
        <span style={{ color: charsLeft < 50 ? '#dc2626' : undefined }}>
          {text.length}/{MAX_CHAR_LIMIT}
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
