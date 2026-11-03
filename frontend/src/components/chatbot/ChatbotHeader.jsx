import React from 'react';
import { Bot, RotateCcw, Minus, Square, X, Sparkles } from 'lucide-react';

export const ChatbotHeader = ({
  name = 'MPUC Assistant',
  isMinimized,
  onToggleMinimize,
  onClose,
  onClear,
}) => {
  return (
    <div className="mpuc-chat-header">
      <div className="mpuc-header-brand">
        <div className="mpuc-header-avatar">
          <Bot size={22} />
        </div>
        <div className="mpuc-header-info">
          <div className="mpuc-header-name">
            {name}
            <span className="mpuc-badge-verified">OFFICIAL</span>
          </div>
          <div className="mpuc-header-status">
            <span className="mpuc-status-dot" />
            <span>Online • College & Admissions Guide</span>
          </div>
        </div>
      </div>

      <div className="mpuc-header-actions">
        <button
          type="button"
          className="mpuc-header-btn"
          onClick={onClear}
          title="Restart Conversation"
          aria-label="Restart Conversation"
        >
          <RotateCcw size={15} />
        </button>

        <button
          type="button"
          className="mpuc-header-btn"
          onClick={onToggleMinimize}
          title={isMinimized ? 'Expand' : 'Minimize'}
          aria-label={isMinimized ? 'Expand' : 'Minimize'}
        >
          {isMinimized ? <Square size={14} /> : <Minus size={15} />}
        </button>

        <button
          type="button"
          className="mpuc-header-btn"
          onClick={onClose}
          title="Close Chat"
          aria-label="Close Chat"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotHeader;
