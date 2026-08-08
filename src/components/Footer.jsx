import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

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

  return (
    <footer className="bg-[#2C2015] text-[#F7F3E9] border-t border-[#3A2A1C]">
      {/* Top Banner / Heritage Wordmark */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-[#3A2A1C]/60">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#B4863A] flex items-center justify-center text-[#2C2015] font-serif font-bold text-lg">
                H
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#C9A45C]">
                HERITAGE CRAFTSMEN
              </span>
            </div>
            <p className="font-sans text-sm text-[#8A8478] leading-relaxed max-w-md">
              Generational artistry engineered for the contemporary home. Handcrafting bespoke solid teak, walnut, and natural marble statement pieces since 2005.
            </p>
            <div className="pt-2 flex items-center gap-4 text-[#8A8478]">
              <span className="text-xs uppercase tracking-widest text-[#B4863A] font-medium">Jodhpur Atelier • New Delhi • Mumbai</span>
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
                <a href={`tel:+${import.meta.env.VITE_ADMIN_WHATSAPP_PHONE || '919876543210'}`} className="hover:text-[#C9A45C] transition-colors">
                  +{import.meta.env.VITE_ADMIN_WHATSAPP_PHONE || '919876543210'}
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
        <div className="flex items-center space-x-6">
          {/* <a href="#instagram" className="hover:text-[#C9A45C] transition-colors"><Instagram className="w-4 h-4" /></a> */}
          {/* <a href="#linkedin" className="hover:text-[#C9A45C] transition-colors"><Linkedin className="w-4 h-4" /></a> // */}
          <span className="text-[#3A2A1C]">|</span>
          <span className="hover:text-[#EFEAE0] transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-[#EFEAE0] transition-colors cursor-pointer">Terms of Craft</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
