import React from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import useChatbot from '../../hooks/useChatbot';
import ChatbotHeader from './ChatbotHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import '../../styles/chatbot.css';

export const ChatbotWidget = () => {
  const {
    isOpen,
    isMinimized,
    config,
    messages,
    isLoading,
    sendMessage,
    retryLastMessage,
    submitFeedback,
    clearChat,
    toggleOpen,
    closeChat,
    toggleMinimize,
  } = useChatbot();

  // If the admin has disabled the chatbot entirely, hide the widget
  if (config && config.enabled === false) {
    return null;
  }

  return (
    <>
      {/* Floating Launcher Button (Closed State) */}
      {!isOpen && (
        <button
          type="button"
          className="mpuc-chat-launcher"
          onClick={toggleOpen}
          aria-label="Chat with MPUC Assistant"
          title="Chat with MPUC Assistant"
          id="mpuc-chatbot-launcher"
        >
          <div className="mpuc-launcher-icon-wrap">
            <Bot size={22} />
            <span className="mpuc-online-pulse" />
          </div>
          <div className="mpuc-launcher-label">
            <span className="mpuc-launcher-title">{config?.name || 'MPUC Assistant'}</span>
            <span className="mpuc-launcher-sub">Ask Admissions & Courses</span>
          </div>
        </button>
      )}

      {/* Floating Chatbot Window (Open State) */}
      {isOpen && (
        <div
          className={`mpuc-chat-window ${isMinimized ? 'minimized' : ''}`}
          id="mpuc-chatbot-window"
          role="dialog"
          aria-label="College AI Assistant"
        >
          <ChatbotHeader
            name={config?.name || 'MPUC Assistant'}
            isMinimized={isMinimized}
            onToggleMinimize={toggleMinimize}
            onClose={closeChat}
            onClear={clearChat}
          />

          {!isMinimized && (
            <>
              <ChatMessageList
                messages={messages}
                isLoading={isLoading}
                onSelectSuggestion={(q) => sendMessage(q)}
                onSubmitFeedback={submitFeedback}
                onRetry={retryLastMessage}
              />

              <ChatInput
                onSendMessage={sendMessage}
                isLoading={isLoading}
                disabled={config?.enabled === false}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
