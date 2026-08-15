import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { workService } from '../services/api';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AnimatedCounter from '../components/AnimatedCounter';
import Pagination from '../components/Pagination';
import { Sparkles, Calendar, Layers, Award, Compass } from 'lucide-react';


const Work = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('All');

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
        loaded = loaded.filter(p => p.roomType === selectedRoom);
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

  const roomCategories = ['All', 'Living Room', 'Dining Room', 'Home Office', 'Master Suite', 'Outdoor & Pavilion'];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background Ambient Glow */}
      {/* <div className="ambient-orb ambient-orb-gold w-[500px] h-[500px] -top-20 -right-20" /> */}
      {/* <div className="ambient-orb ambient-orb-warm w-[550px] h-[550px] top-1/2 -left-40" /> */}

      {/* Header */}
      <div className="max-w-3xl mb-12 relative z-10">
        <div className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase mb-1 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Completed Bespoke Portfolio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A2A1C] leading-tight">
          Architectural Transformations & Custom Crafts
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#4A5A78] mt-3 leading-relaxed">
          From raw reclaimed teak logs to hand-carved dining pavilions and acoustic walnut wall paneling. Explore our portfolio of private residence commissions below.
        </p>
      </div>

      {/* STATS HIGHLIGHT BANNER WITH ANIMATED COUNTERS */}
      <div className="bg-white/90 backdrop-blur border border-[#E3DDCE] rounded-xl p-6 mb-12 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
        <div className="text-center md:text-left border-r border-[#E3DDCE]/60 last:border-0 pr-2 sm:pr-4">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] whitespace-nowrap">
            <AnimatedCounter value={48} suffix="+" />
          </div>
          <div className="font-sans text-[10px] sm:text-xs text-[#8A8478] uppercase tracking-wider mt-1">Villas Completed</div>
        </div>
        <div className="text-center md:text-left border-r border-[#E3DDCE]/60 last:border-0 pr-2 sm:pr-4">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] whitespace-nowrap">
            <AnimatedCounter value={125} suffix=",000" />
          </div>
          <div className="font-sans text-[10px] sm:text-xs text-[#8A8478] uppercase tracking-wider mt-1">Sq. Ft. Restored</div>
        </div>
        <div className="text-center md:text-left border-r border-[#E3DDCE]/60 last:border-0 pr-2 sm:pr-4">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] whitespace-nowrap">
            <AnimatedCounter value={100} suffix="%" />
          </div>
          <div className="font-sans text-[10px] sm:text-xs text-[#8A8478] uppercase tracking-wider mt-1">Solid Hardwood</div>
        </div>
        <div className="text-center md:text-left pr-2 sm:pr-4">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C] whitespace-nowrap">
            20+
          </div>
          <div className="font-sans text-[10px] sm:text-xs text-[#8A8478] uppercase tracking-wider mt-1">Years Heritage</div>
        </div>
      </div>

      {/* Room Category Tabs */}
      <div ref={gridHeaderRef} className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#E3DDCE] relative z-10 scroll-mt-24">
        {roomCategories.map((room) => {
          const isSelected = selectedRoom === room;
          return (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={`px-4 py-2.5 rounded-md font-sans text-xs font-semibold tracking-wider uppercase transition-all ${isSelected
                  ? 'bg-[#3A2A1C] text-[#C9A45C] shadow-md'
                  : 'bg-white/90 border border-[#E3DDCE] text-[#4A5A78] hover:border-[#B4863A] hover:text-[#3A2A1C]'
                }`}
            >
              {room}
            </button>
          );
        })}
      </div>

      {/* PROJECTS GRID WITH INTERACTIVE BEFORE/AFTER SLIDERS */}
      {loading ? (
        <div className="py-20 text-center font-sans text-sm text-[#8A8478]">
          Loading portfolio commissions...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-[#E3DDCE] rounded-lg p-12 text-center relative z-10">
          <h3 className="font-serif text-xl font-bold text-[#3A2A1C]">No projects in this category yet</h3>
          <p className="font-sans text-xs text-[#8A8478] mt-1">Select another room type tab above.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
            {displayedProjects.map((proj) => (
              <motion.div
                key={proj._id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <BeforeAfterSlider
                  beforeImage={proj.beforeImage}
                  afterImage={proj.afterImage}
                  title={proj.title}
                  scope={proj.scope}
                />

                {/* Detailed Project Breakdown Box */}
                <div className="bg-white p-6 rounded-xl border border-[#E3DDCE] space-y-3 shadow-luxury">
                  <div className="flex flex-wrap items-center justify-between text-xs font-sans text-[#8A8478] gap-2 pb-2 border-b border-[#E3DDCE]/60">
                    <div className="flex items-center gap-1.5 text-[#B4863A] font-semibold">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{proj.roomType}</span>
                    </div>
                    <div className="flex items-center gap-1 font-serif text-[#3A2A1C] font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#B4863A]" />
                      <span>Completed <AnimatedCounter value={proj.completedYear} /></span>
                    </div>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-[#4A5A78] leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.materialsUsed && proj.materialsUsed.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8478]">Timbers & Materials:</span>
                      {proj.materialsUsed.map((mat, idx) => (
                        <span key={idx} className="bg-[#F7F3E9] border border-[#E3DDCE] text-[#3A2A1C] text-[10px] font-sans px-2.5 py-1 rounded">
                          {mat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
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

    </div>
  );
};

export default Work;
