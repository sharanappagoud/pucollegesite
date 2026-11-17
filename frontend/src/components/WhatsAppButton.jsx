import React from 'react';
import { WhatsAppIcon } from './FloatingWhatsApp';
import { buildWhatsAppUrl } from '../services/whatsappService';

export const WhatsAppButton = ({
  text = 'Chat on WhatsApp',
  message = 'Hello MPUC College, I would like to get more information.',
  phoneNumber = '918023456789',
  variant = 'solid', // 'solid' or 'outline'
  className = '',
  iconSize = 20,
  style = {}
}) => {
  const url = buildWhatsAppUrl(phoneNumber, message);

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
