import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, Database, Sparkles, ExternalLink, AlertCircle } from 'lucide-react';
import ChatbotFeedback from './ChatbotFeedback';

// Simple, safe Markdown-like renderer for bot responses
function renderFormattedContent(text) {
  if (!text) return null;

  // Split text by lines
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];
  let isOrdered = false;

  const flushList = () => {
    if (currentList.length > 0) {
      if (isOrdered) {
        elements.push(
          <ol key={`ol-${elements.length}`} style={{ margin: '6px 0 6px 18px', padding: 0 }}>
            {currentList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{parseInlineFormatting(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} style={{ margin: '6px 0 6px 18px', padding: 0 }}>
            {currentList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{parseInlineFormatting(item)}</li>
            ))}
          </ul>
        );
      }
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for unordered bullet (* or -)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      if (isOrdered && currentList.length > 0) flushList();
      isOrdered = false;
      currentList.push(trimmed.substring(2));
      return;
    }

    // Check for ordered bullet (1. or 2.)
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      if (!isOrdered && currentList.length > 0) flushList();
      isOrdered = true;
      currentList.push(orderedMatch[2]);
      return;
    }

    // Regular line, flush any active list
    flushList();

    if (trimmed === '') {
      elements.push(<div key={`sp-${index}`} style={{ height: '6px' }} />);
    } else {
      elements.push(
        <p key={`p-${index}`} style={{ margin: '0 0 6px 0', lineHeight: '1.5' }}>
          {parseInlineFormatting(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return elements;
}

// Inline formatting: **bold** and `code`
function parseInlineFormatting(str) {
  const parts = [];
  // Regex to match **bold**
  const regex = /(\*\*.*?\*\*)/g;
  const segments = str.split(regex);

  segments.forEach((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      parts.push(
        <strong key={i} style={{ color: 'inherit', fontWeight: '700' }}>
          {seg.slice(2, -2)}
        </strong>
      );
    } else {
      parts.push(seg);
    }
  });

  return parts;
}

export const ChatMessage = ({ message, onSubmitFeedback, onRetry }) => {
  const isUser = message.sender === 'user';
  const isBot = !isUser;
  const isError = !!message.isError;

  const getSourceLabel = (src) => {
    switch (src) {
      case 'APPROVED_FAQ':
        return 'Verified College FAQ';
      case 'GROUNDED_MYSQL':
        return 'Grounded College Database';
      case 'OPENAI_API':
        return 'AI Knowledge Assistant';
      case 'FALLBACK':
        return 'Official Directory';
      default:
        return 'College Knowledge Base';
    }
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`mpuc-message-row ${isUser ? 'user' : 'bot'}`}>
      <div className="mpuc-message-avatar">
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className="mpuc-message-content">
        <div className={`mpuc-message-bubble ${isError ? 'error' : ''}`}>
          <div className="mpuc-bubble-text">
            {renderFormattedContent(message.text)}
          </div>

          {/* Quick Page Links */}
          {isBot && message.links && message.links.length > 0 && (
            <div className="mpuc-msg-links">
              {message.links.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.url}
                  className="mpuc-msg-link-btn"
                  title={`Go to ${link.title}`}
                >
                  <ExternalLink size={11} />
                  <span>{link.title}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Error Retry Button */}
          {isError && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                marginTop: '8px',
                fontSize: '0.78rem',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <AlertCircle size={12} /> Retry Question
            </button>
          )}
        </div>

        {/* Message Meta Info */}
        <div className="mpuc-message-meta">
          <span>{formattedTime}</span>
          {isBot && !isError && message.source && (
            <span className="mpuc-source-badge">
              <Database size={10} />
              {getSourceLabel(message.source)}
            </span>
          )}
        </div>

        {/* Thumbs Feedback */}
        {isBot && !isError && message.logId && (
          <ChatbotFeedback
            logId={message.logId}
            currentFeedback={message.feedback}
            onSubmitFeedback={onSubmitFeedback}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
