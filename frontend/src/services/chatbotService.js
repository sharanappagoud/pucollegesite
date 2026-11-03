import api from './api';

export const chatbotService = {
  // Public Chatbot Endpoints
  getConfig: async () => {
    const res = await api.get('/chatbot/config');
    return res.data;
  },

  sendMessage: async (message, sessionId) => {
    const res = await api.post('/chatbot/message', { message, sessionId });
    return res.data;
  },

  submitFeedback: async (logId, rating, feedbackText, sessionId) => {
    const res = await api.post('/chatbot/feedback', {
      logId,
      rating,
      feedbackText,
      sessionId,
    });
    return res.data;
  },

  // Admin Chatbot Endpoints (Secured)
  getAdminSettings: async () => {
    const res = await api.get('/admin/chatbot/settings');
    return res.data;
  },

  updateAdminSettings: async (settings) => {
    const res = await api.put('/admin/chatbot/settings', settings);
    return res.data;
  },

  getAdminStats: async () => {
    const res = await api.get('/admin/chatbot/stats');
    return res.data;
  },

  getAdminLogs: async (page = 0, size = 20) => {
    const res = await api.get(`/admin/chatbot/logs?page=${page}&size=${size}`);
    return res.data;
  },

  getAdminFaqs: async () => {
    const res = await api.get('/admin/chatbot/faqs');
    return res.data;
  },

  saveAdminFaq: async (faq) => {
    const res = await api.post('/admin/chatbot/faqs', faq);
    return res.data;
  },

  deleteAdminFaq: async (id) => {
    const res = await api.delete(`/admin/chatbot/faqs/${id}`);
    return res.data;
  },

  testQuery: async (message) => {
    const res = await api.post('/admin/chatbot/test', { message });
    return res.data;
  },
};

export default chatbotService;
