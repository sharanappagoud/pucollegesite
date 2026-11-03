import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import SuggestedQuestions from './SuggestedQuestions';

export const ChatMessageList = ({
  messages = [],
  isLoading,
  onSelectSuggestion,
  onSubmitFeedback,
  onRetry,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Find the last bot message with suggestions to display prominently
  const lastBotMessage = [...messages].reverse().find((m) => m.sender === 'bot');

  return (
    <div className="mpuc-chat-body">
      <div className="mpuc-chat-disclaimer">
        ℹ️ Official SVCPUC College Assistant. Information is grounded in published records. For admission verification, visit the college office.
      </div>

      {messages.map((msg, index) => (
        <React.Fragment key={msg.id || index}>
          <ChatMessage
            message={msg}
            onSubmitFeedback={onSubmitFeedback}
            onRetry={onRetry}
          />

          {/* Show suggestions right below the welcome message or corresponding bot message if not loading */}
          {msg.sender === 'bot' &&
            msg.suggestions &&
            msg.suggestions.length > 0 &&
            msg.id === lastBotMessage?.id &&
            !isLoading && (
              <SuggestedQuestions
                suggestions={msg.suggestions}
                onSelectQuestion={onSelectSuggestion}
              />
            )}
        </React.Fragment>
      ))}

      {isLoading && (
        <div className="mpuc-message-row bot">
          <div className="mpuc-message-avatar">
            <span style={{ fontSize: '12px' }}>🤖</span>
          </div>
          <div className="mpuc-typing-indicator">
            <span className="mpuc-typing-dot" />
            <span className="mpuc-typing-dot" />
            <span className="mpuc-typing-dot" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessageList;
