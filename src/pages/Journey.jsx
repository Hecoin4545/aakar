import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import { journeyService } from '../services/api';

// ─── Loading Skeleton ────────────────────────────────────────────────────────
const TimelineSkeleton = () => (
  <div className="space-y-16 md:space-y-24">
    {[1, 2, 3].map((i) => (
      <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-pulse">
        <div className="md:col-span-6 space-y-3">
          <div className="h-12 w-24 bg-[#E3DDCE] rounded" />
          <div className="h-4 w-32 bg-[#E3DDCE] rounded" />
          <div className="h-6 w-48 bg-[#E3DDCE] rounded" />
          <div className="h-16 w-full bg-[#E3DDCE] rounded" />
        </div>
        <div className="md:col-span-6">
          <div className="aspect-[4/3] bg-[#E3DDCE] rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyJourney = () => (
  <div className="text-center py-24 space-y-4">
    <Compass className="w-12 h-12 text-[#B4863A] mx-auto opacity-50" />
    <h3 className="font-serif text-2xl font-bold text-[#3A2A1C]">
      Our journey is being written
    </h3>
    <p className="font-sans text-sm text-[#8A8478] max-w-xs mx-auto">
      The admin is crafting the timeline milestones. Check back soon.
    </p>
  </div>
);

// ─── Component ───────────────────────────────────────────────────────────────
const Journey = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await journeyService.getTimelineEvents();
        const loaded = res.data?.events || [];
        // Sort ascending by year
        loaded.sort((a, b) => a.year - b.year);
        setEvents(loaded);
      } catch (err) {
        console.error('Failed to load timeline events:', err);
        setError('Failed to load journey timeline. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <span className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase">
          OUR LEGACY &amp; HERITAGE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3A2A1C] mt-2">
          A Journey of Craftsmanship &amp; Dedication
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#4A5A78] mt-3 leading-relaxed">
          Tracing two decades of solid hardwood innovation — from our humble beginnings
          restoring antiques in Rajasthan to designing bespoke statement furniture for global residences.
        </p>
      </div>

      {/* ─── Timeline Content ─────────────────────────────────────────────── */}
      <div className="relative z-10">

        {loading && <TimelineSkeleton />}

        {!loading && error && (
          <div className="text-center py-16 text-red-600 font-sans text-sm">{error}</div>
        )}

        {!loading && !error && events.length === 0 && <EmptyJourney />}

        {!loading && !error && events.length > 0 && (
          <>
            {/* Vertical Central Connecting Gold Line (desktop) */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-[#E3DDCE] -translate-x-1/2 z-0">
              <div className="w-full h-full bg-gradient-to-b from-[#B4863A] via-[#C9A45C] to-[#B4863A]" />
            </div>

            <div className="space-y-16 md:space-y-24">
              {events.map((event, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={event._id || idx}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                  >
                    {/* Central Gold Dot Marker (desktop) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F3E9] border-4 border-[#B4863A] shadow-md z-20 items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3A2A1C]" />
                    </div>

                    {/* Text Column */}
                    <div className={`md:col-span-6 space-y-3 ${isEven ? 'md:pr-12 text-left md:text-right' : 'md:order-2 md:pl-12 text-left'}`}>
                      <span className="font-serif text-4xl sm:text-5xl font-bold text-[#B4863A] block">
                        <AnimatedCounter value={event.year} duration={1.2} />
                      </span>

                      <div className={`inline-flex items-center gap-1.5 text-xs text-[#8A8478] font-sans ${isEven ? 'md:justify-end md:w-full' : ''}`}>
                        <MapPin className="w-3.5 h-3.5 text-[#B4863A]" />
                        <span>{event.location || 'Atelier Workshop'}</span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#3A2A1C]">
                        {event.title}
                      </h3>

                      <p className="font-sans text-sm text-[#4A5A78] leading-relaxed max-w-md inline-block">
                        {event.description}
                      </p>
                    </div>

                    {/* Image Column */}
                    <div className={`md:col-span-6 ${isEven ? 'md:pl-12' : 'md:order-1 md:pr-12'}`}>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E3DDCE] shadow-luxury bg-[#EFEAE0]">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className={`w-full h-full object-cover ${event.isArchival
                              ? 'sepia brightness-90'
                              : 'hover:scale-105 transition-transform duration-700'}`}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EFEAE0] to-[#E3DDCE]">
                            <Compass className="w-12 h-12 text-[#B4863A] opacity-40" />
                          </div>
                        )}
                        {event.isArchival && (
                          <div className="absolute bottom-3 left-3 bg-[#2C2015]/80 backdrop-blur text-white text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                            Historical Archival ({event.year})
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ─── Bottom Heritage Quote ─────────────────────────────────────────── */}
      <div className="mt-24 bg-[#3A2A1C] text-[#F7F3E9] rounded-xl p-8 sm:p-12 text-center border border-[#B4863A]/40 shadow-xl max-w-4xl mx-auto space-y-4 relative z-10">
        <Compass className="w-8 h-8 text-[#C9A45C] mx-auto" />
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#C9A45C]">
          "We do not build furniture for a season. We craft heirlooms to anchor family stories for generations."
        </h3>
        <p className="font-sans text-xs uppercase tracking-widest text-[#8A8478]">
          — Master Artisan, Founder
        </p>
      </div>

    </div>
  );
};

export default Journey;
