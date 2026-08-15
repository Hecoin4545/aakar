import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Layers,
  MapPin,
  Maximize,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { Link } from 'react-router-dom';

const WorkDetailModal = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'beforeAfter'
  const [lightboxImage, setLightboxImage] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, lightboxImage]);

  if (!project) return null;

  const galleryImages = project.gallery && project.gallery.length > 0
    ? project.gallery
    : [project.afterImage, project.beforeImage].filter(Boolean);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2C2015]/80 backdrop-blur-md flex justify-center items-start pt-4 sm:pt-10 pb-10 px-2 sm:px-4">
        {/* Backdrop overlay click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative z-10 bg-[#F7F3E9] text-[#4A5A78] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-[#E3DDCE] my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Floating Button */}
          <button
            onClick={onClose}
            aria-label="Close detail page"
            className="absolute top-4 right-4 z-30 bg-[#2C2015]/70 hover:bg-[#2C2015] text-[#F7F3E9] p-2.5 rounded-full transition-all duration-200 shadow-md backdrop-blur group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* HERO HEADER SECTION */}
          <div className="relative w-full h-[380px] sm:h-[480px] bg-[#3A2A1C] overflow-hidden">
            <img
              src={project.afterImage}
              alt={project.title}
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />
            {/* Dark Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2015] via-[#2C2015]/50 to-transparent" />

            {/* Glassmorphism Title Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white z-10 flex flex-col justify-end">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-[#B4863A] text-white text-[11px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {project.roomType}
                </span>
                {project.clientLocation && (
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-sans px-3 py-1 rounded-full flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A45C]" />
                    {project.clientLocation}
                  </span>
                )}
                {project.sqft && (
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-sans px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Maximize className="w-3.5 h-3.5 text-[#C9A45C]" />
                    {project.sqft}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                {project.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-white/20 text-xs sm:text-sm text-white/90 font-sans">
                <div>
                  <span className="text-[#C9A45C] block text-[10px] uppercase font-bold tracking-wider">Scope</span>
                  <span>{project.scope}</span>
                </div>
                <div>
                  <span className="text-[#C9A45C] block text-[10px] uppercase font-bold tracking-wider">Completion Date</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C9A45C]" />
                    {project.completedYear}
                  </span>
                </div>
                {project.dimensions && (
                  <div>
                    <span className="text-[#C9A45C] block text-[10px] uppercase font-bold tracking-wider">Scale / Spec</span>
                    <span>{project.dimensions}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* VIEW TAB SWITCHER BAR */}
          <div className="bg-[#EFEAE0] border-b border-[#E3DDCE] px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md font-sans text-xs font-semibold tracking-wider uppercase transition-all ${
                  activeTab === 'overview'
                    ? 'bg-[#3A2A1C] text-[#C9A45C] shadow-sm'
                    : 'bg-white/80 text-[#4A5A78] hover:text-[#3A2A1C]'
                }`}
              >
                Case Study Overview
              </button>
              {project.beforeImage && (
                <button
                  onClick={() => setActiveTab('beforeAfter')}
                  className={`px-4 py-2 rounded-md font-sans text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                    activeTab === 'beforeAfter'
                      ? 'bg-[#3A2A1C] text-[#C9A45C] shadow-sm'
                      : 'bg-white/80 text-[#4A5A78] hover:text-[#3A2A1C]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#B4863A]" />
                  Before / After Transformation
                </button>
              )}
            </div>

            <Link
              to="/contact"
              onClick={onClose}
              className="hidden sm:flex items-center gap-2 bg-[#B4863A] hover:bg-[#C9A45C] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-md transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Inquire Similar Commission
            </Link>
          </div>

          {/* MODAL BODY CONTENT */}
          <div className="p-6 sm:p-10 space-y-12">
            {/* CONDITIONAL CONTENT BASED ON ACTIVE TAB */}
            {activeTab === 'beforeAfter' && project.beforeImage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-[#3A2A1C]">
                    Architectural Before & After Comparison
                  </h3>
                  <span className="text-xs font-sans text-[#8A8478]">
                    Drag slider handle left & right to view raw vs finished state
                  </span>
                </div>
                <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border border-[#E3DDCE]">
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage}
                    title={project.title}
                    scope={project.scope}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* PROJECT STORY BLOCK */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span>Architectural Narrative</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2A1C] leading-snug">
                      Design Vision & Woodworking Philosophy
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-[#4A5A78] leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>

                  {/* MATERIALS PALETTE PANEL */}
                  <div className="bg-white p-6 rounded-xl border border-[#E3DDCE] space-y-4 shadow-sm">
                    <h3 className="font-serif text-base font-bold text-[#3A2A1C] pb-2 border-b border-[#E3DDCE] flex items-center justify-between">
                      <span>Crafted Materials</span>
                      <Sparkles className="w-4 h-4 text-[#B4863A]" />
                    </h3>
                    {project.materialsUsed && project.materialsUsed.length > 0 ? (
                      <ul className="space-y-2.5">
                        {project.materialsUsed.map((mat, idx) => (
                          <li key={idx} className="flex items-center gap-2.5 text-xs font-sans text-[#3A2A1C]">
                            <CheckCircle2 className="w-4 h-4 text-[#B4863A] flex-shrink-0" />
                            <span className="font-medium">{mat}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[#8A8478]">Custom Solid Timber, Brass & Natural Stone</p>
                    )}
                  </div>
                </div>

                {/* INTERACTIVE HORIZONTAL IMAGE GALLERY */}
                <div className="space-y-4 pt-4 border-t border-[#E3DDCE]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase mb-1">
                        Visual Showcase
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1C]">
                        Close-Ups, Materials & Lighting Angles
                      </h3>
                    </div>
                    {/* Gallery Navigation Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleScroll('left')}
                        className="p-2 rounded-full border border-[#E3DDCE] bg-white text-[#3A2A1C] hover:border-[#B4863A] hover:bg-[#F7F3E9] transition-all"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleScroll('right')}
                        className="p-2 rounded-full border border-[#E3DDCE] bg-white text-[#3A2A1C] hover:border-[#B4863A] hover:bg-[#F7F3E9] transition-all"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scroll Track */}
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-[#B4863A]/40 scroll-smooth snap-x"
                  >
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(imgUrl)}
                        className="relative flex-none w-[260px] sm:w-[340px] h-[200px] sm:h-[240px] rounded-xl overflow-hidden border border-[#E3DDCE] shadow-sm cursor-pointer group snap-start"
                      >
                        <img
                          src={imgUrl}
                          alt={`${project.title} detail ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#2C2015]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white/90 text-[#3A2A1C] p-2.5 rounded-full shadow-lg">
                            <Maximize2 className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BESPOKE FURNITURE CREATED FOR THIS LOCATION */}
                {project.customFurnitureItems && project.customFurnitureItems.length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-[#E3DDCE]">
                    <div>
                      <div className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase mb-1">
                        Site-Specific Atelier Craftsmanship
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2A1C]">
                        Custom Furniture Pieces Crafted For This Project
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {project.customFurnitureItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl border border-[#E3DDCE] p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[#F7F3E9]">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-grow space-y-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#B4863A]">
                              {item.category}
                            </span>
                            <h4 className="font-serif text-base font-bold text-[#3A2A1C] group-hover:text-[#B4863A] transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#8A8478] font-sans">
                              {item.material}
                            </p>
                            <Link
                              to="/products"
                              onClick={onClose}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#B4863A] hover:text-[#3A2A1C] pt-1 transition-colors"
                            >
                              <span>Explore Atelier Catalog</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* LIGHTBOX MODAL FOR FULL-SCREEN IMAGE PREVIEW */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
            >
              <button
                onClick={() => setLightboxImage(null)}
                aria-label="Close image preview"
                className="absolute top-6 right-6 text-white bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={lightboxImage}
                alt="Enlarged view"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default WorkDetailModal;
