import { useState, useEffect, useCallback, useRef } from 'react';
import chatbotService from '../services/chatbotService';

const SESSION_STORAGE_KEY = 'mpuc_chat_history';
const LOCAL_STORAGE_SESSION_ID = 'mpuc_chatbot_session_id';

export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [config, setConfig] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const [sessionId, setSessionId] = useState('');

  // 1. Initialize or load sessionId
  useEffect(() => {
    let sid = localStorage.getItem(LOCAL_STORAGE_SESSION_ID);
    if (!sid) {
      sid = 'mpuc_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem(LOCAL_STORAGE_SESSION_ID, sid);
    }
    setSessionId(sid);
  }, []);

  // 2. Fetch Chatbot Public Configuration
  useEffect(() => {
    let isMounted = true;
    async function loadConfig() {
      try {
        const data = await chatbotService.getConfig();
        if (isMounted && data) {
          setConfig(data);
          // If no messages yet, check sessionStorage or create welcome message
          const savedHistory = sessionStorage.getItem(SESSION_STORAGE_KEY);
          if (savedHistory) {
            try {
              const parsed = JSON.parse(savedHistory);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setMessages(parsed);
                return;
              }
            } catch (e) {
              console.error('Failed to parse saved chat history', e);
            }
          }
          // Default Welcome Message
          const initialMessage = {
            id: 'welcome_' + Date.now(),
            sender: 'bot',
            text: data.welcomeMessage || 'Hello! Welcome to Sri Vidyodaya Composite Pre-University College. How can I assist you today?',
            timestamp: new Date().toISOString(),
            suggestions: data.suggestedQuestions || [],
            source: 'SYSTEM',
          };
          setMessages([initialMessage]);
        }
      } catch (err) {
        console.warn('Could not load chatbot config from server', err);
      }
    }
    loadConfig();
    return () => { isMounted = false; };
  }, []);

  // 3. Sync messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // 4. Send Message Handler
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setLastFailedMessage(null);

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const activeSessionId = sessionId || localStorage.getItem(LOCAL_STORAGE_SESSION_ID) || 'anonymous';
      const response = await chatbotService.sendMessage(trimmed, activeSessionId);

      const botMsg = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: response.reply,
        timestamp: response.timestamp || new Date().toISOString(),
        suggestions: response.suggestions || [],
        links: response.links || [],
        source: response.source || 'AI_ENGINE',
        logId: response.logId || null,
        feedback: null,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error in chatbot message exchange:', err);
      const errMsg = err.message || 'Unable to connect to college server. Please try again.';
      setError(errMsg);
      setLastFailedMessage(trimmed);

      const errorBotMsg = {
        id: 'err_' + Date.now(),
        sender: 'bot',
        text: `I apologize, but I encountered an issue: ${errMsg}. Please feel free to retry or contact our admissions office at info@svcpuc.edu.in.`,
        timestamp: new Date().toISOString(),
        isError: true,
        source: 'ERROR',
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId]);

  // 5. Retry Handler
  const retryLastMessage = useCallback(() => {
    if (lastFailedMessage) {
      // Remove the last error bot message
      setMessages((prev) => prev.filter((m) => !m.isError));
      sendMessage(lastFailedMessage);
    }
  }, [lastFailedMessage, sendMessage]);

  // 6. Submit Feedback Handler
  const submitFeedback = useCallback(async (logId, rating, comment = '') => {
    if (!logId) return;
    try {
      await chatbotService.submitFeedback(logId, rating, comment, sessionId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.logId === logId ? { ...msg, feedback: rating } : msg
        )
      );
    } catch (err) {
      console.error('Error submitting chatbot feedback:', err);
    }
  }, [sessionId]);

  // 7. Clear Conversation Handler
  const clearChat = useCallback(() => {
    const initialWelcome = {
      id: 'welcome_' + Date.now(),
      sender: 'bot',
      text: config?.welcomeMessage || 'Hello! Welcome to Sri Vidyodaya Composite Pre-University College. How can I assist you today?',
      timestamp: new Date().toISOString(),
      suggestions: config?.suggestedQuestions || [],
      source: 'SYSTEM',
    };
    setMessages([initialWelcome]);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setError(null);
    setLastFailedMessage(null);
  }, [config]);

  // 8. Widget controls
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setIsMinimized(false);
      return next;
    });
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  return {
    isOpen,
    isMinimized,
    config,
    messages,
    isLoading,
    error,
    lastFailedMessage,
    sendMessage,
    retryLastMessage,
    submitFeedback,
    clearChat,
    toggleOpen,
    closeChat,
    toggleMinimize,
  };
}

export default useChatbot;
