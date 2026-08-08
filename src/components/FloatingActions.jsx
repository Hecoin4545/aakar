import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Phone, ChevronUp } from 'lucide-react';
import { DEFAULT_WHATSAPP_PHONE } from '../utils/whatsapp';

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const defaultWhatsappMessage = encodeURIComponent("Hello Heritage Craftsmen! I am visiting your website and would like to inquire about bespoke custom furniture designs.");
  const whatsappUrl = `https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${defaultWhatsappMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      
      {/* WhatsApp Quick Chat */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-lg bg-[#5B7A4F] text-white flex items-center justify-center shadow-lg hover:bg-[#4a6440] hover:scale-105 transition-all duration-300 group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </a>

      {/* Phone Call Button */}
      <a
        href={`tel:+${import.meta.env.VITE_ADMIN_WHATSAPP_PHONE || '919876543210'}`}
        className="w-12 h-12 rounded-lg bg-[#3A2A1C] text-[#C9A45C] flex items-center justify-center shadow-lg hover:bg-[#2C2015] hover:scale-105 transition-all duration-300 group"
        title="Call Our Atelier"
        aria-label="Call Atelier"
      >
        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </a>

      {/* Scroll To Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-lg bg-white border border-[#E3DDCE] text-[#3A2A1C] flex items-center justify-center shadow-md hover:border-[#B4863A] hover:bg-[#F7F3E9] hover:scale-105 transition-all duration-300 animate-fade-in"
          title="Back to top"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};

export default FloatingActions;
