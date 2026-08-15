import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

// Custom SVG Icon for Instagram
const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Custom SVG Icon for WhatsApp
const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const Footer = () => {
  const location = useLocation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const whatsappPhone = import.meta.env.VITE_ADMIN_WHATSAPP_PHONE || '919876543210';
  const whatsappLink = import.meta.env.VITE_ADMIN_WHATSAPP_LINK || `https://wa.me/${whatsappPhone}`;
  const instagramLink = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com';

  return (
    <footer className="bg-[#2C2015] text-[#F7F3E9] border-t border-[#3A2A1C]">
      {/* Top Banner / Heritage Wordmark */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-[#3A2A1C]/60">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#B4863A] flex items-center justify-center text-[#2C2015] font-serif font-bold text-lg shadow-sm">
                H
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#C9A45C]">
                HERITAGE CRAFTSMEN
              </span>
            </div>
            <p className="font-sans text-sm text-[#8A8478] leading-relaxed max-w-md">
              Generational artistry engineered for the contemporary home. Handcrafting bespoke solid teak, walnut, and natural marble statement pieces since 2005.
            </p>
            
            {/* Social Media Badges */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#3A2A1C] hover:bg-[#B4863A] text-[#C9A45C] hover:text-[#2C2015] px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-all duration-300 border border-[#B4863A]/30"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5B7A4F]/20 hover:bg-[#5B7A4F] text-[#5B7A4F] hover:text-white px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-all duration-300 border border-[#5B7A4F]/40"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp Atelier</span>
              </a>
            </div>

            <div className="pt-1 flex items-center gap-4 text-[#8A8478]">
              <span className="text-[11px] uppercase tracking-widest text-[#B4863A] font-medium">Jodhpur Atelier • New Delhi • Mumbai</span>
            </div>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-sans text-xs uppercase tracking-widest text-[#B4863A] font-semibold">
              Explore
            </h4>
            <ul className="space-y-2.5 font-sans text-sm text-[#EFEAE0]">
              <li><Link to="/products" className="hover:text-[#C9A45C] transition-colors">Catalog Collections</Link></li>
              <li><Link to="/work" className="hover:text-[#C9A45C] transition-colors">Bespoke Portfolio</Link></li>
              <li><Link to="/journey" className="hover:text-[#C9A45C] transition-colors">Craft Heritage</Link></li>
              <li><Link to="/contact" className="hover:text-[#C9A45C] transition-colors">Private Commissions</Link></li>
              <li><Link to="/admin/login" className="hover:text-[#C9A45C] transition-colors">Client Portal</Link></li>
            </ul>
          </div>

          {/* Support / Contact Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-sans text-xs uppercase tracking-widest text-[#B4863A] font-semibold">
              Support
            </h4>
            <ul className="space-y-2.5 font-sans text-sm text-[#EFEAE0]">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B4863A]" />
                <a href={`tel:+${whatsappPhone}`} className="hover:text-[#C9A45C] transition-colors">
                  +{whatsappPhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B4863A]" />
                <a href={`mailto:${import.meta.env.VITE_ADMIN_EMAIL || 'admin@heritagecraftsmen.com'}`} className="hover:text-[#C9A45C] transition-colors">
                  {import.meta.env.VITE_ADMIN_EMAIL || 'admin@heritagecraftsmen.com'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B4863A]" />
                <span>Craft Atelier, Jodhpur</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-widest text-[#B4863A] font-semibold">
              Private Journal
            </h4>
            <p className="font-sans text-xs text-[#8A8478]">
              Subscribe for exclusive previews of new seasonal collections and archival craft stories.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="relative mt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-transparent border-b border-[#8A8478] py-2 pr-10 text-sm text-white placeholder-[#8A8478] focus:outline-none focus:border-[#B4863A] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-2 text-[#B4863A] hover:text-[#C9A45C] transition-colors p-1"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {subscribed && (
              <p className="font-sans text-xs text-[#5B7A4F] mt-1">
                ✓ Thank you for subscribing to our journal.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8478] gap-4">
        <p>© {new Date().getFullYear()} Heritage Craftsmen Furniture Atelier. All rights reserved.</p>
        <div className="flex items-center space-x-4">
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C9A45C] transition-colors flex items-center gap-1.5"
            title="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
          
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#5B7A4F] transition-colors flex items-center gap-1.5"
            title="WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <span className="text-[#3A2A1C]">|</span>
          <span className="hover:text-[#EFEAE0] transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-[#EFEAE0] transition-colors cursor-pointer">Terms of Craft</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
