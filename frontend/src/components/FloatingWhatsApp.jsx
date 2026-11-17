import React, { useState, useEffect } from 'react';
import { X, Send, ChevronRight, MessageSquare } from 'lucide-react';
import { getPublicWhatsAppConfig, buildWhatsAppUrl, recordWhatsAppOptIn } from '../services/whatsappService';
import '../styles/whatsapp.css';

export const WhatsAppIcon = ({ size = 30, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.472 14.382C17.184 14.238 15.777 13.545 15.513 13.449C15.249 13.353 15.057 13.305 14.865 13.593C14.673 13.881 14.121 14.529 13.953 14.721C13.785 14.913 13.617 14.937 13.329 14.793C13.041 14.649 11.826 14.252 10.386 12.969C9.267 11.97 8.511 10.738 8.295 10.366C8.079 9.994 8.271 9.793 8.415 9.649C8.544 9.52 8.703 9.313 8.847 9.145C8.991 8.977 9.039 8.857 9.135 8.665C9.231 8.473 9.183 8.305 9.111 8.161C9.039 8.017 8.463 6.6 8.223 6.024C7.989 5.463 7.752 5.539 7.575 5.53C7.407 5.521 7.215 5.519 7.023 5.519C6.831 5.519 6.519 5.591 6.255 5.879C5.991 6.167 5.247 6.863 5.247 8.279C5.247 9.695 6.279 11.063 6.423 11.255C6.567 11.447 8.457 14.364 11.355 15.615C12.044 15.913 12.583 16.091 13.003 16.224C13.695 16.444 14.325 16.413 14.823 16.339C15.378 16.256 16.533 15.64 16.773 14.968C17.013 14.296 17.013 13.72 16.941 13.593C16.869 13.466 16.677 13.394 16.389 13.25L17.472 14.382Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12C2 13.824 2.489 15.534 3.342 17.013L2.062 21.684L6.868 20.428C8.308 21.218 9.957 21.667 12 21.667C17.523 21.667 22 17.19 22 12C22 6.477 17.523 2 12 2ZM12 3.667C16.602 3.667 20.333 7.398 20.333 12C20.333 16.602 16.602 20.333 12 20.333C10.222 20.333 8.784 19.92 7.551 19.187L7.26 19.013L4.414 19.76L5.176 16.983L4.985 16.679C4.184 15.405 3.667 13.916 3.667 12C3.667 7.398 7.398 3.667 12 3.667Z"
      fill={color}
    />
  </svg>
);

export const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [config, setConfig] = useState({
    phoneNumber: '918023456789',
    displayPhoneNumber: '+91 80234 56789',
    floatingEnabled: true,
    welcomeMessage: 'Chat with MPUC College',
    welcomeSubtitle: 'Typically replies within a few minutes',
    prefilledDefaultMessage: 'Hello MPUC College, I would like to enquire about PU admissions and courses for the academic year 2026-27.',
    prefilledTemplates: {}
  });
  const [message, setMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('admissions');

  useEffect(() => {
    let isMounted = true;
    getPublicWhatsAppConfig().then((data) => {
      if (isMounted && data) {
        setConfig(data);
        if (data.prefilledDefaultMessage) {
          setMessage(data.prefilledDefaultMessage);
        }
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Quick topics for student/parent convenience
  const quickTopics = [
    {
      id: 'admissions',
      title: '🎓 PU Admission Enquiries 2026-27',
      text: config.prefilledTemplates?.admission_enquiry_ack
        ? 'Hello MPUC Admissions Desk, I would like to enquire about PU 1st Year admission eligibility, application dates, and fee structure.'
        : 'Hello MPUC Admissions Desk, I would like to enquire about PU 1st Year admission eligibility, application dates, and fee structure.'
    },
    {
      id: 'science',
      title: '🔬 Science Combinations (PCMB / PCMC)',
      text: config.prefilledTemplates?.science_enquiry_prefill ||
        'Hello MPUC College, I am interested in Science combinations (PCMB/PCMC). Could you share details regarding eligibility, curriculum, and lab facilities?'
    },
    {
      id: 'commerce',
      title: '📊 Commerce Combinations (CEBA / SEBA)',
      text: config.prefilledTemplates?.commerce_enquiry_prefill ||
        'Hello MPUC College, I am interested in Commerce combinations (CEBA/SEBA). Could you share details regarding subjects, coaching, and career opportunities?'
    },
    {
      id: 'exams',
      title: '📝 PU Board Examinations & Timetable',
      text: config.prefilledTemplates?.exam_enquiry_prefill ||
        'Hello MPUC College, I would like to enquire about upcoming PU Board examinations, time tables, and model question papers.'
    },
    {
      id: 'general',
      title: '🏛️ Campus Facilities & General Info',
      text: config.prefilledTemplates?.general_enquiry_prefill ||
        'Hello MPUC College, I would like to get more information about the college campus, facilities, and admissions.'
    }
  ];

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic.id);
    setMessage(topic.text);
  };

  const handleStartChat = () => {
    const finalMsg = message.trim() || config.prefilledDefaultMessage;
    const url = buildWhatsAppUrl(config.phoneNumber, finalMsg);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  if (config.floatingEnabled === false) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          className="mpuc-wa-floating-btn"
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={config.welcomeMessage || 'Chat with MPUC College on WhatsApp'}
          title={config.welcomeMessage || 'Chat with MPUC College'}
          id="mpuc-whatsapp-launcher"
        >
          <WhatsAppIcon size={34} color="#ffffff" />
          {showTooltip && (
            <div className="mpuc-wa-tooltip">
              <span>{config.welcomeMessage || 'Chat with MPUC College'}</span>
            </div>
          )}
        </button>
      )}

      {/* Floating WhatsApp Card */}
      {isOpen && (
        <div className="mpuc-wa-popup" role="dialog" aria-modal="true" aria-label="WhatsApp Chat Window">
          {/* Card Header */}
          <div className="mpuc-wa-header">
            <div className="mpuc-wa-header-info">
              <div className="mpuc-wa-avatar-wrap">
                <span>M</span>
                <span className="mpuc-wa-online-dot" />
              </div>
              <div>
                <h4 className="mpuc-wa-title">{config.welcomeMessage || 'MPUC College WhatsApp'}</h4>
                <p className="mpuc-wa-subtitle">
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#25D366' }} />
                  {config.welcomeSubtitle || 'Typically replies within a few minutes'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="mpuc-wa-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Card Chat Area */}
          <div className="mpuc-wa-body">
            {/* College Welcome Message */}
            <div className="mpuc-wa-bubble">
              <div className="mpuc-wa-bubble-author">Master PU College (MPUC)</div>
              <div>
                Hello! Welcome to <strong>Master Pre-University College</strong> 👋
                <br /><br />
                How can our academic counselors assist you today? Select a topic below or type your custom message to chat directly with our team on WhatsApp.
              </div>
              <div className="mpuc-wa-bubble-time">Verified WhatsApp Desk</div>
            </div>

            {/* Quick Topic Chips */}
            <div className="mpuc-wa-chips-title">Select Enquiry Topic</div>
            <div className="mpuc-wa-chips-container">
              {quickTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={`mpuc-wa-chip ${selectedTopic === topic.id ? 'active' : ''}`}
                  onClick={() => handleSelectTopic(topic)}
                >
                  <span>{topic.title}</span>
                  <ChevronRight size={14} style={{ opacity: 0.6 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Card Footer / Action */}
          <div className="mpuc-wa-footer">
            <textarea
              className="mpuc-wa-textarea"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <button
              type="button"
              className="mpuc-wa-submit-btn"
              onClick={handleStartChat}
            >
              <WhatsAppIcon size={18} color="#ffffff" />
              <span>Start Chat on WhatsApp</span>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingWhatsApp;
