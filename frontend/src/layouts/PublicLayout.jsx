import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AnnouncementTicker } from '../components/AnnouncementTicker';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { ScrollToAnchor } from '../components/ScrollToAnchor';

export const PublicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToAnchor />
      <Header />
      <AnnouncementTicker />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
      <FloatingWhatsApp />
    </div>
  );
};
