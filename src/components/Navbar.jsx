import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Our Work', path: '/work' },
    { name: 'Journey', path: '/journey' },
    { name: 'Contact', path: '/contact' },
  ];

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomeHero = location.pathname === '/' && !isScrolled;

  if (isAdminRoute) {
    return null; // Admin has its own sidebar layout
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-nav py-3 border-b border-[#E3DDCE]' 
        : 'bg-[#F7F3E9]/90 backdrop-blur-md py-5 border-b border-[#E3DDCE]/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Wordmark */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#3A2A1C] text-[#B4863A] flex items-center justify-center font-serif font-bold text-lg group-hover:scale-105 transition-transform">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight leading-none text-[#3A2A1C]">
                HERITAGE CRAFTSMEN
              </span>
              <span className="font-sans text-[10px] tracking-[0.25em] text-[#B4863A] uppercase font-semibold mt-0.5">
                Artisanal Furniture Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 font-sans text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-[#3A2A1C] font-semibold' : 'text-[#4A5A78] hover:text-[#B4863A]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B4863A] rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button & Admin Quick Link */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/admin/login"
              className="font-sans text-xs flex items-center gap-1 text-[#8A8478] hover:text-[#3A2A1C] transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            <button
              onClick={() => navigate('/contact')}
              className="bg-[#2C2015] hover:bg-[#3A2A1C] text-white font-sans text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded shadow-luxury transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Get Quote</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A45C] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#3A2A1C] hover:text-[#B4863A] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F7F3E9] border-b border-[#E3DDCE] px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'text-[#B4863A] font-semibold bg-[#EFEAE0]' : 'text-[#4A5A78] hover:text-[#3A2A1C]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[#E3DDCE] flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/contact');
              }}
              className="w-full bg-[#2C2015] text-white font-sans text-xs font-semibold tracking-wider uppercase py-3 rounded text-center"
            >
              Get Quote
            </button>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-sans text-xs text-[#8A8478] py-1"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
