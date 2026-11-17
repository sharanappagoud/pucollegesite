import api from './api';

// Verified default configuration
export const DEFAULT_WHATSAPP_CONFIG = {
  phoneNumber: '919743988354',
  displayPhoneNumber: '+91 97439 88354',
  floatingEnabled: true,
  welcomeMessage: 'Chat with MPUC College',
  welcomeSubtitle: 'Typically replies within a few minutes',
  prefilledDefaultMessage: 'Hello MPUC College, I would like to enquire about PU admissions and courses for the academic year 2026-27.',
  prefilledTemplates: {
    science_enquiry_prefill: 'Hello MPUC College, I am interested in Science combinations (PCMB/PCMC). Could you share details regarding eligibility, curriculum, and lab facilities?',
    commerce_enquiry_prefill: 'Hello MPUC College, I am interested in Commerce combinations (CEBA/SEBA). Could you share details regarding subjects, coaching, and career opportunities?',
    exam_enquiry_prefill: 'Hello MPUC College, I would like to enquire about upcoming PU Board examinations, time tables, and model question papers.',
    general_enquiry_prefill: 'Hello MPUC College, I would like to get more information about the college campus, facilities, and admissions for the upcoming session.',
    admission_enquiry_ack: 'Hello {{1}}, thank you for contacting Master PU College. Your enquiry [Ref: {{2}}] for {{3}} stream has been received.'
  },
  isCloudApiConfigured: false
};

let cachedConfig = { ...DEFAULT_WHATSAPP_CONFIG };
let fetchPromise = null;

export const getPublicWhatsAppConfig = async () => {
  if (fetchPromise) return fetchPromise;
  fetchPromise = (async () => {
    try {
      const res = await api.get('/whatsapp/config');
      const data = res.data || res;
      if (data && data.phoneNumber) {
        cachedConfig = { ...DEFAULT_WHATSAPP_CONFIG, ...data };
      }
      return cachedConfig;
    } catch (error) {
      console.warn('Failed to load WhatsApp public config from backend, using default:', error);
      return cachedConfig;
    } finally {
      fetchPromise = null;
    }
  })();
  return fetchPromise;
};

export const getCachedWhatsAppPhone = () => cachedConfig.phoneNumber || '919743988354';
export const getCachedWhatsAppDisplayPhone = () => cachedConfig.displayPhoneNumber || '+91 97439 88354';

export const recordWhatsAppOptIn = async (optInData) => {
  try {
    const res = await api.post('/whatsapp/opt-in', optInData);
    return res.data || res;
  } catch (error) {
    console.warn('Could not record opt-in:', error);
    return null;
  }
};

export const getAdminWhatsAppSettings = async () => {
  const res = await api.get('/admin/whatsapp/settings');
  return res.data || res;
};

export const updateAdminWhatsAppSettings = async (settings) => {
  const res = await api.put('/admin/whatsapp/settings', settings);
  const data = res.data || res;
  if (data && data.phoneNumber) {
    cachedConfig = { ...cachedConfig, ...data };
  }
  return data;
};

export const getAdminWhatsAppTemplates = async () => {
  const res = await api.get('/admin/whatsapp/templates');
  return res.data || res;
};

export const createAdminWhatsAppTemplate = async (template) => {
  const res = await api.post('/admin/whatsapp/templates', template);
  return res.data || res;
};

export const updateAdminWhatsAppTemplate = async (id, template) => {
  const res = await api.put(`/admin/whatsapp/templates/${id}`, template);
  return res.data || res;
};

export const deleteAdminWhatsAppTemplate = async (id) => {
  const res = await api.delete(`/admin/whatsapp/templates/${id}`);
  return res.data || res;
};

export const getAdminWhatsAppLogs = async (page = 0, size = 20) => {
  const res = await api.get('/admin/whatsapp/logs', { params: { page, size } });
  return res.data || res;
};

export const getAdminWhatsAppOptIns = async (page = 0, size = 20) => {
  const res = await api.get('/admin/whatsapp/opt-ins', { params: { page, size } });
  return res.data || res;
};

export const sendAdminWhatsAppMessage = async (sendData) => {
  const res = await api.post('/admin/whatsapp/send', sendData);
  return res.data || res;
};

export const buildWhatsAppUrl = (phone, text) => {
  const targetPhone = phone || getCachedWhatsAppPhone();
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text || '');
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};
