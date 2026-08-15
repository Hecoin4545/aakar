import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Hammer, Sparkles, Compass, Award, CheckCircle2 } from 'lucide-react';
import { productService, workService, inquiryService } from '../services/api';
import { createQuickInquiryWhatsAppUrl } from '../utils/whatsapp';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AnimatedCounter from '../components/AnimatedCounter';

const Home = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredWork, setFeaturedWork] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick WhatsApp Inquiry Form State
  const [quickForm, setQuickForm] = useState({
    name: '',
    phone: '',
    furnitureType: 'Dining Table',
    budgetRange: '₹1.5L - ₹3L',
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, workRes] = await Promise.all([
          productService.getProducts(),
          workService.getWorkProjects()
        ]);

        const prods = prodRes.data?.products || [];
        setAllProducts(prods);
        setFeaturedProducts(prods.slice(0, 8));

        const loadedWork = workRes.data?.projects || [];
        setFeaturedWork(loadedWork.slice(0, 2));
      } catch (err) {
        console.error('Failed to load home page data:', err);
        // Show empty state — no dummy fallback
        setAllProducts([]);
        setFeaturedProducts([]);
        setFeaturedWork([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute dynamic category item counts and cover images based on real product inventory
  const categories = useMemo(() => {
    const spacesConfig = [
      { key: 'Dining Room', title: 'Dining Room', defaultImage: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80' },
      { key: 'Living Room', title: 'Living & Sofas', defaultImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80' },
      { key: 'Master Suite', title: 'Master Suite', defaultImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
      { key: 'Home Office', title: 'Home Office', defaultImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' },
    ];

    return spacesConfig.map((space) => {
      const matchingProducts = allProducts.filter((p) => {
        if (space.key === 'Living Room') {
          return p.category === 'Living Room' || p.category === 'Seating' || p.category === 'Tables' || p.category === 'Storage';
        }
        return p.category === space.key;
      });

      const countVal = matchingProducts.length;
      const displayImg = (matchingProducts.length > 0 && matchingProducts[0].images && matchingProducts[0].images[0])
        ? matchingProducts[0].images[0]
        : space.defaultImage;

      return {
        title: space.title,
        image: displayImg,
        count: countVal,
        categoryFilter: space.key
      };
    });
  }, [allProducts]);

  const handleQuickFormSubmit = async (e) => {
    e.preventDefault();
    if (!quickForm.name || !quickForm.phone) return;

    try {
      await inquiryService.submitInquiry({
        name: quickForm.name,
        phone: quickForm.phone,
        furnitureType: quickForm.furnitureType,
        budgetRange: quickForm.budgetRange,
        message: quickForm.notes
      });
    } catch (err) {
      console.warn('Backend inquiry save warning (continuing to WhatsApp redirect):', err);
    }

    const whatsappUrl = createQuickInquiryWhatsAppUrl(quickForm);
    setFormSubmitted(true);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="pb-16 relative overflow-hidden">

      {/* 1. LUXURY HERO BANNER & INSTANT ESTIMATE FORM */}
      <section className="relative pt-24 pb-12 md:pb-20 overflow-hidden bg-[#F7F3E9] text-[#4A5A78]">

        {/* Ambient Glow Orbs */}
        {/* <div className="ambient-orb ambient-orb-gold w-[600px] h-[600px] -top-32 -left-32 opacity-40" /> // */}
        {/* <div className="ambient-orb ambient-orb-warm w-[650px] h-[650px] top-1/4 -right-40 opacity-30" /> */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 mt-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B4863A]/15 border border-[#B4863A]/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B4863A]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#B4863A]">
                  GENERATIONAL ARTISTRY • BESPOKE TIMBER
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3A2A1C] leading-[1.12] drop-shadow-sm">
                Handcrafted statement furniture, engineered for the contemporary home.
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#4A5A78] max-w-xl leading-relaxed">
                We blend 100-year old solid wood joinery traditions with sleek minimalist design. Each dining table, executive desk, and lounge chair is custom-tailored to your dimensions.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/products')}
                  className="bg-[#2C2015] hover:bg-[#3A2A1C] text-white font-sans text-xs font-bold tracking-wider uppercase px-8 py-4 rounded-md shadow-luxury hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A45C] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/work')}
                  className="bg-transparent hover:bg-[#EFEAE0] border border-[#3A2A1C] text-[#3A2A1C] font-sans text-xs font-semibold tracking-wider uppercase px-8 py-4 rounded-md transition-all duration-300"
                >
                  View Bespoke Work
                </button>
              </div>

              {/* Quick Stat Highlights with ANIMATED COUNTERS */}
              <div className="pt-8 border-t border-[#E3DDCE] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2A1C]">
                    <AnimatedCounter value={20} suffix="+" />
                  </div>
                  <div className="font-sans text-xs text-[#8A8478] mt-0.5">Years Heritage</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2A1C]">
                    <AnimatedCounter value={100} suffix="%" />
                  </div>
                  <div className="font-sans text-xs text-[#8A8478] mt-0.5">Solid Seasoned Wood</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2A1C]">
                    <AnimatedCounter value={10} suffix="-Yr" />
                  </div>
                  <div className="font-sans text-xs text-[#8A8478] mt-0.5">Structural Warranty</div>
                </div>
              </div>

            </motion.div>

            {/* Right Column: Quick WhatsApp Inquiry Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 glass-card bg-white/90 rounded-xl p-6 sm:p-8 shadow-xl relative text-[#3A2A1C]"
            >
              <div className="absolute -top-3 right-6 bg-[#B4863A] text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Instant Estimate
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#3A2A1C] mb-1">
                Start Your Journey
              </h3>
              <p className="font-sans text-xs text-[#8A8478] mb-6">
                Fill in your specifications below to receive an instant custom quote & timber catalog via WhatsApp.
              </p>

              <form onSubmit={handleQuickFormSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    className="w-full bg-[#F7F3E9]/80 border border-[#E3DDCE] rounded-md px-4 py-3 text-sm text-[#3A2A1C] placeholder-[#8A8478] focus:outline-none focus:border-[#B4863A] transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp / Phone Number *"
                    value={quickForm.phone}
                    onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                    className="w-full bg-[#F7F3E9]/80 border border-[#E3DDCE] rounded-md px-4 py-3 text-sm text-[#3A2A1C] placeholder-[#8A8478] focus:outline-none focus:border-[#B4863A] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={quickForm.furnitureType}
                      onChange={(e) => setQuickForm({ ...quickForm, furnitureType: e.target.value })}
                      className="w-full bg-[#F7F3E9]/80 border border-[#E3DDCE] rounded-md px-3 py-3 text-xs font-sans text-[#3A2A1C] focus:outline-none focus:border-[#B4863A]"
                    >
                      <option className="bg-white text-[#3A2A1C]" value="Dining Table">Dining Table</option>
                      <option className="bg-white text-[#3A2A1C]" value="Armchair / Lounge">Armchair / Lounge</option>
                      <option className="bg-white text-[#3A2A1C]" value="Executive Desk">Executive Desk</option>
                      <option className="bg-white text-[#3A2A1C]" value="Platform Bed">Platform Bed</option>
                      <option className="bg-white text-[#3A2A1C]" value="Credenza / Sideboard">Credenza / Sideboard</option>
                      <option className="bg-white text-[#3A2A1C]" value="Complete Residence">Complete Residence</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={quickForm.budgetRange}
                      onChange={(e) => setQuickForm({ ...quickForm, budgetRange: e.target.value })}
                      className="w-full bg-[#F7F3E9]/80 border border-[#E3DDCE] rounded-md px-3 py-3 text-xs font-sans text-[#3A2A1C] focus:outline-none focus:border-[#B4863A]"
                    >
                      <option className="bg-white text-[#3A2A1C]" value="Under ₹1L">Under ₹1L</option>
                      <option className="bg-white text-[#3A2A1C]" value="₹1L - ₹2.5L">₹1L - ₹2.5L</option>
                      <option className="bg-white text-[#3A2A1C]" value="₹2.5L - ₹5L">₹2.5L - ₹5L</option>
                      <option className="bg-white text-[#3A2A1C]" value="₹5L+ Bespoke">₹5L+ Bespoke</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Specific timber preferences, sizes, or notes (optional)"
                    value={quickForm.notes}
                    onChange={(e) => setQuickForm({ ...quickForm, notes: e.target.value })}
                    className="w-full bg-[#F7F3E9]/80 border border-[#E3DDCE] rounded-md px-4 py-2.5 text-xs text-[#3A2A1C] placeholder-[#8A8478] focus:outline-none focus:border-[#B4863A] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5B7A4F] hover:bg-[#4a6440] text-white font-sans text-xs font-bold tracking-wider uppercase py-3.5 px-6 rounded-md shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  <span>Send WhatsApp Inquiry Now</span>
                </button>
              </form>

              {formSubmitted && (
                <div className="mt-3 p-3 bg-[#5B7A4F]/15 border border-[#5B7A4F]/40 rounded text-xs text-[#3B5432] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Opening WhatsApp chat with your pre-filled inquiry details...</span>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[#8A8478]">
                <span>🔒 100% Privacy</span>
                <span>•</span>
                <span>⚡ Direct Master Artisan Support</span>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. DYNAMIC MASTERPIECES FOR EVERY SPACE SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-[#E3DDCE] pb-4">
          <div>
            <span className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] mt-1">
              Masterpieces for every space.
            </h2>
          </div>
          <Link
            to="/products"
            className="font-sans text-xs font-semibold text-[#B4863A] hover:text-[#3A2A1C] transition-colors flex items-center gap-1.5 mt-2 md:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.categoryFilter)}`)}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-luxury transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2015]/90 via-[#2C2015]/30 to-transparent flex flex-col justify-end p-6">
                <span className="font-sans text-xs font-bold tracking-widest text-[#C9A45C] uppercase">
                  <AnimatedCounter value={cat.count} suffix=" Pieces" />
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1 group-hover:text-[#C9A45C] transition-colors">
                  {cat.title}
                </h3>
                <span className="font-sans text-xs text-[#EFEAE0] mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                  Explore Collection →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS CATALOG */}
      <section className="bg-[#EFEAE0] py-16 border-y border-[#E3DDCE] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase">
              Signature Atelier Catalog
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] mt-1">
              Hand-finished Heirlooms
            </h2>
            <p className="font-sans text-sm text-[#4A5A78] mt-2">
              Each piece is crafted from seasoned timbers, organic beeswax sealers, and hand-fitted brass hardware.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center font-sans text-sm text-[#8A8478]">
              Loading signature products...
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Award className="w-10 h-10 text-[#B4863A] mx-auto opacity-40" />
              <p className="font-sans text-sm text-[#8A8478]">
                The atelier catalog is being curated. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/products')}
              className="bg-[#2C2015] hover:bg-[#3A2A1C] text-white font-sans text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded shadow-md hover:shadow-lg transition-all duration-300"
            >
              Browse Full Catalog (<AnimatedCounter value={allProducts.length || 6} suffix="+ Items" />)
            </button>
          </div>
        </div>
      </section>

      {/* 4. BESPOKE PORTFOLIO PREVIEW WITH BEFORE/AFTER SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-2xl mb-12">
          <span className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase">
            Completed Commissions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] mt-1">
            Real Transformations
          </h2>
          <p className="font-sans text-sm text-[#4A5A78] mt-2">
            Drag the interactive slider below to inspect raw timber framing vs. final polished installation.
          </p>
        </div>

        {featuredWork.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Compass className="w-10 h-10 text-[#B4863A] mx-auto opacity-40" />
            <p className="font-sans text-sm text-[#8A8478]">
              Portfolio commissions are being prepared. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredWork.map((project) => (
              <BeforeAfterSlider
                key={project._id}
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                title={project.title}
                scope={project.scope}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#B4863A] hover:text-[#3A2A1C] transition-colors"
          >
            <span>Explore All Work Commissions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. WHY CHOOSE HERITAGE CRAFTSMEN (FEATURE TILES) */}
      <section className="bg-white py-16 border-t border-[#E3DDCE] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase">
              The Atelier Difference
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#3A2A1C] mt-1">
              Why Discriminating Clients Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Tile 1 */}
            <div className="bg-[#F7F3E9] p-8 rounded-lg border border-[#E3DDCE] space-y-4">
              <div className="w-12 h-12 rounded-md bg-[#3A2A1C] text-[#B4863A] flex items-center justify-center">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3A2A1C]">
                Mortise & Tenon Joinery
              </h3>
              <p className="font-sans text-xs text-[#4A5A78] leading-relaxed">
                We reject cheap flat-pack fasteners. Every structural joint relies on traditional hand-chiseled interlocking timber for 100+ year durability.
              </p>
            </div>

            {/* Tile 2: Photographic Dark Overlay matching design.md */}
            <div className="relative p-8 rounded-lg overflow-hidden space-y-4 text-white shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80"
                alt="Precision Woodworking"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#2C2015]/85 backdrop-blur-[2px]" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-md bg-[#B4863A] text-[#2C2015] flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#C9A45C]">
                  Precision Craftsmanship
                </h3>
                <p className="font-sans text-xs text-[#EFEAE0] leading-relaxed">
                  Kiln-dried hardwoods selected grain by grain to prevent warping, finished with non-toxic natural organic oil and beeswax formula.
                </p>
              </div>
            </div>

            {/* Tile 3 */}
            <div className="bg-[#F7F3E9] p-8 rounded-lg border border-[#E3DDCE] space-y-4">
              <div className="w-12 h-12 rounded-md bg-[#3A2A1C] text-[#B4863A] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3A2A1C]">
                10-Year Atelier Guarantee
              </h3>
              <p className="font-sans text-xs text-[#4A5A78] leading-relaxed">
                Every piece carries our workshop stamp of authenticity, full structural guarantee, and complimentary 1st-year re-waxing service.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. DIRECT CTA BANNER */}
      <section className="bg-[#2C2015] text-white py-16 border-t border-[#3A2A1C] relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase">
            Start Your Custom Commission
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F3E9]">
            Have a custom blueprint or space requirement?
          </h2>
          <p className="font-sans text-sm text-[#8A8478] max-w-xl mx-auto leading-relaxed">
            Our atelier design team will review your room dimensions and timber preferences within 24 hours.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/contact')}
              className="bg-[#B4863A] hover:bg-[#C9A45C] text-[#2C2015] font-sans text-xs font-bold tracking-wider uppercase px-8 py-3.5 rounded shadow-lg transition-all duration-300"
            >
              Request Private Consultation
            </button>
            <a
              href={createQuickInquiryWhatsAppUrl({ name: 'Website Visitor', phone: '', furnitureType: 'Bespoke Order', budgetRange: '₹2L+' })}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent hover:bg-[#3A2A1C] border border-[#C9A45C] text-[#C9A45C] font-sans text-xs font-bold tracking-wider uppercase px-8 py-3.5 rounded transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A45C]" />
              <span>WhatsApp Us Direct</span>
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
};

export default Home;
