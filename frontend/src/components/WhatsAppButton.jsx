import React, { useState, useEffect } from 'react';
import { WhatsAppIcon } from './FloatingWhatsApp';
import { buildWhatsAppUrl, getPublicWhatsAppConfig, getCachedWhatsAppPhone } from '../services/whatsappService';

export const WhatsAppButton = ({
  text = 'Chat on WhatsApp',
  message = 'Hello MPUC College, I would like to get more information.',
  phoneNumber = null,
  variant = 'solid', // 'solid' or 'outline'
  className = '',
  iconSize = 20,
  style = {}
}) => {
  const [activePhone, setActivePhone] = useState(phoneNumber || getCachedWhatsAppPhone());

  useEffect(() => {
    if (!phoneNumber) {
      getPublicWhatsAppConfig().then((cfg) => {
        if (cfg && cfg.phoneNumber) {
          setActivePhone(cfg.phoneNumber);
        }
      });
    }
  }, [phoneNumber]);

  const targetPhone = phoneNumber || activePhone;
  const url = buildWhatsAppUrl(targetPhone, message);

  const buttonClass = variant === 'outline'
    ? `mpuc-wa-action-btn-outline ${className}`
    : `mpuc-wa-action-btn ${className}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass}
      style={style}
    >
      <WhatsAppIcon size={iconSize} color={variant === 'outline' ? '#25D366' : '#ffffff'} />
      <span>{text}</span>
    </a>
  );
};

export default WhatsAppButton;
