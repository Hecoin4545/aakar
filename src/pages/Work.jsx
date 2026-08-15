import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workService } from '../services/api';
import AnimatedCounter from '../components/AnimatedCounter';
import Pagination from '../components/Pagination';
import WorkDetailModal from '../components/WorkDetailModal';
import LiquidDistortionFilter from '../components/LiquidDistortionFilter';
import { Sparkles, Calendar, Layers, MapPin, Maximize, ArrowUpRight, Eye } from 'lucide-react';

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  // Hover states for liquid distortion, cursor follower & background dimming
  const [hoveredId, setHoveredId] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [isLoadMoreMode, setIsLoadMoreMode] = useState(false);
  const gridHeaderRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
    fetchWorkProjects();
  }, [selectedRoom]);

  const fetchWorkProjects = async () => {
    try {
      setLoading(true);
      const res = await workService.getWorkProjects({ roomType: selectedRoom });
      let loaded = res.data?.projects || [];
      if (selectedRoom !== 'All') {
        loaded = loaded.filter((p) => p.roomType === selectedRoom);
      }
      setProjects(loaded);
    } catch (err) {
      console.error('Backend work fetch error:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const displayedProjects = isLoadMoreMode
    ? projects.slice(0, currentPage * itemsPerPage)
    : projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (gridHeaderRef.current) {
      gridHeaderRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleToggleLoadMore = (mode) => {
    setIsLoadMoreMode(mode);
    setCurrentPage(1);
  };

  const roomCategories = [
    'All',
    'Living Room',
    'Dining Room',
    'Home Office',
    'Master Suite',
    'Outdoor & Pavilion'
  ];

  // Mouse position tracker relative to cards for sleek cursor follower
  const handleMouseMove = (e, projId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setHoveredId(projId);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  // Divide displayed projects into 2 asymmetric masonry columns
  const col1 = displayedProjects.filter((_, idx) => idx % 2 === 0);
  const col2 = displayedProjects.filter((_, idx) => idx % 2 === 1);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* SVG Liquid Distortion Filter Definitions */}
      <LiquidDistortionFilter />

      {/* HEADER SECTION */}
      <div className="max-w-3xl mb-12 relative z-10">
        <div className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase mb-1 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Completed Architectural Portfolio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A2A1C] leading-tight">
          Architectural Transformations & Custom Crafts
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#4A5A78] mt-3 leading-relaxed">
          Explore our portfolio of private residence commissions — featuring bespoke solid wood joinery, custom furniture suites, and acoustic timber paneling.
        </p>
      </div>

      {/* STATS HIGHLIGHT BANNER WITH ANIMATED COUNTERS */}
      <div className="bg-white/90 backdrop-blur border border-[#E3DDCE] rounded-xl p-6 mb-12 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
        <div className="text-center md:text-left border-r border-[#E3DDCE]/60 last:border-0 pr-2 sm:pr-4">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] whitespace-nowrap">
            <AnimatedCounter value={48} suffix="+" />
          </div>
          <div className="font-sans text-[10px] sm:text-xs text-[#8A8478] uppercase tracking-wider mt-1">
            Villas Completed
          </div>
        </div>
        <div className="text-center md:text-left border-r border-[#E3DDCE]/60 last:border-0 pr-2 sm:pr-4">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] whitespace-nowrap">
            <AnimatedCounter value={125} suffix=",000" />
          </div>
          <div className="font-sans text-[10px] sm:text-xs text-[#8A8478] uppercase tracking-wider mt-1">
            Sq. Ft. Restored
          </div>
        </div>
        <div className="text-center md:text-left border-r border-[#E3DDCE]/60 last:border-0 pr-2 sm:pr-4">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] whitespace-nowrap">
            <AnimatedCounter value={100} suffix="%" />
          </div>
          <div className="font-sans text-[10px] sm:text-xs text-[#8A8478] uppercase tracking-wider mt-1">
            Solid Hardwood
          </div>
        </div>
        <div className="text-center md:text-left pr-2 sm:pr-4">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] whitespace-nowrap">
            20+
          </div>
          <div className="font-sans text-[10px] sm:text-xs text-[#8A8478] uppercase tracking-wider mt-1">
            Years Heritage
          </div>
        </div>
      </div>

      {/* ROOM CATEGORY TABS */}
      <div
        ref={gridHeaderRef}
        className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#E3DDCE] relative z-10 scroll-mt-24"
      >
        {roomCategories.map((room) => {
          const isSelected = selectedRoom === room;
          return (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={`px-4 py-2.5 rounded-md font-sans text-xs font-semibold tracking-wider uppercase transition-all ${
                isSelected
                  ? 'bg-[#3A2A1C] text-[#C9A45C] shadow-md'
                  : 'bg-white/90 border border-[#E3DDCE] text-[#4A5A78] hover:border-[#B4863A] hover:text-[#3A2A1C]'
              }`}
            >
              {room}
            </button>
          );
        })}
      </div>

      {/* ASYMMETRIC MASONRY PORTFOLIO GRID */}
      {loading ? (
        <div className="py-24 text-center font-sans text-sm text-[#8A8478]">
          Loading portfolio commissions...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-[#E3DDCE] rounded-lg p-12 text-center relative z-10">
          <h3 className="font-serif text-xl font-bold text-[#3A2A1C]">
            No projects in this category yet
          </h3>
          <p className="font-sans text-xs text-[#8A8478] mt-1">
            Select another room type tab above.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
            {/* COLUMN 1 (Staggered Desktop) */}
            <div className="space-y-8 lg:space-y-12">
              {col1.map((proj, idx) => (
                <PortfolioCard
                  key={proj._id}
                  project={proj}
                  isTaller={true}
                  hoveredId={hoveredId}
                  cursorPos={cursorPos}
                  onMouseMove={(e) => handleMouseMove(e, proj._id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setSelectedProject(proj)}
                />
              ))}
            </div>

            {/* COLUMN 2 (Staggered Offset Desktop) */}
            <div className="space-y-8 lg:space-y-12 md:mt-12">
              {col2.map((proj, idx) => (
                <PortfolioCard
                  key={proj._id}
                  project={proj}
                  isTaller={false}
                  hoveredId={hoveredId}
                  cursorPos={cursorPos}
                  onMouseMove={(e) => handleMouseMove(e, proj._id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setSelectedProject(proj)}
                />
              ))}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={projects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            isLoadMoreMode={isLoadMoreMode}
            onToggleLoadMore={handleToggleLoadMore}
            hasMore={currentPage < totalPages}
            onLoadMore={handleLoadMore}
            loading={loading}
            label="Projects"
          />
        </>
      )}

      {/* EXPANDED MORPHING CASE STUDY MODAL */}
      {selectedProject && (
        <WorkDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

/**
 * PortfolioCard Subcomponent
 * Renders individual showcase card with floating glassmorphism tag,
 * liquid-distortion effect on hover, cursor follower, and card focus dimming.
 */
const PortfolioCard = ({
  project,
  isTaller,
  hoveredId,
  cursorPos,
  onMouseMove,
  onMouseLeave,
  onClick
}) => {
  const isHovered = hoveredId === project._id;
  const isAnyHovered = hoveredId !== null;
  const isOtherHovered = isAnyHovered && !isHovered;

  const clientLocationText = project.clientLocation || 'Private Residence — Zurich';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group border border-[#E3DDCE] bg-[#3A2A1C] shadow-lg transition-all duration-500 ${
        isOtherHovered ? 'opacity-50 blur-[0.5px] scale-[0.98]' : 'opacity-100 scale-100 shadow-luxury'
      }`}
    >
      {/* CARD IMAGE CONTAINER WITH LIQUID DISTORTION EFFECT */}
      <div
        className={`relative w-full overflow-hidden ${
          isTaller ? 'aspect-[4/5] sm:aspect-[3/4]' : 'aspect-[4/3] sm:aspect-[16/11]'
        }`}
      >
        <img
          src={project.afterImage}
          alt={project.title}
          style={{
            filter: isHovered ? 'url(#liquid-distortion)' : 'none',
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2015]/90 via-[#2C2015]/30 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

        {/* TOP RIGHT ROOM TYPE BADGE */}
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-[#2C2015]/80 backdrop-blur-md border border-white/20 text-[#C9A45C] text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#B4863A]" />
            {project.roomType}
          </span>
        </div>

        {/* FLOATING GLASSMORPHISM METADATA TAG AT BOTTOM LEFT */}
        <div className="absolute bottom-5 left-5 right-5 z-20 pointer-events-none">
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl p-4 text-white shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
            <div className="flex items-center justify-between text-xs font-sans text-[#C9A45C] mb-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>{clientLocationText}</span>
              </div>
              <span className="text-white/80 font-serif font-bold text-[11px]">
                {project.completedYear}
              </span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-[#C9A45C] transition-colors">
              {project.title}
            </h3>

            <p className="font-sans text-xs text-white/80 mt-1 line-clamp-1">
              {project.scope}
            </p>
          </div>
        </div>

        {/* SLEEK "VIEW CASE STUDY" CURSOR FOLLOWER */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              top: cursorPos.y,
              left: cursorPos.x,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-30 pointer-events-none hidden sm:flex items-center gap-2 bg-[#B4863A] text-white font-sans text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full shadow-2xl backdrop-blur border border-white/40"
          >
            <span>View Case Study</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Work;
