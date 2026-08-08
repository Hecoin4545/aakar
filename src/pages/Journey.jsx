import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Award, Clock, MapPin } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

const HARDCODED_TIMELINE_EVENTS = [
  {
    _id: "tl_1",
    year: 2005,
    title: "The Humble Foundation",
    description: "Master artisan Rajesh Sharma established a tiny 400 sq. ft. woodworking shed in Jodhpur, dedicated to restoring antique teak heirlooms.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    isArchival: true,
    location: "Jodhpur, Rajasthan"
  },
  {
    _id: "tl_2",
    year: 2012,
    title: "Pioneering Solid Wood Joinery",
    description: "Expanded workshop operations to master mortise-and-tenon hand joinery, eliminating metal screws for 100-year structural integrity.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80",
    isArchival: true,
    location: "Craft Atelier"
  },
  {
    _id: "tl_3",
    year: 2018,
    title: "Architectural Bespoke Studio",
    description: "Launched custom residential commissions, collaborating directly with India's top interior architects for luxury villas.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    isArchival: false,
    location: "New Delhi & Mumbai"
  },
  {
    _id: "tl_4",
    year: 2022,
    title: "The Sustainable Kiln Initiative",
    description: "Built our own on-site solar-powered timber seasoning kilns, ensuring every plank reaches perfect moisture equilibrium before carving.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
    isArchival: false,
    location: "Jodhpur Outskirts"
  },
  {
    _id: "tl_5",
    year: 2024,
    title: "Heritage Craftsmen Rebrand",
    description: "Unveiled our signature contemporary artisanal collection, combining traditional Indian woodworking heritage with sleek Danish minimalism.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    isArchival: false,
    location: "Global Flagship Atelier"
  },
  {
    _id: "tl_6",
    year: 2026,
    title: "Next-Generation Atelier",
    description: "Introducing advanced 3D scanning paired with master hand-carving to perfectly ergonomically tailor seating pieces to individual client anatomy.",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    isArchival: false,
    location: "Global & Online"
  }
];

const Journey = () => {
  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background Ambient Glow */}
      {/* <div className="ambient-orb ambient-orb-gold w-[400px] h-[400px] top-40 -left-20" /> */}
      {/* <div className="ambient-orb ambient-orb-warm w-[600px] h-[600px] bottom-1/4 -right-40" /> */}

      {/* Centered Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <span className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase">
          OUR LEGACY & HERITAGE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3A2A1C] mt-2">
          A Journey of Craftsmanship & Dedication
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#4A5A78] mt-3 leading-relaxed">
          Tracing two decades of solid hardwood innovation — from our humble beginnings restoring antiques in Rajasthan to designing bespoke statement furniture for global residences.
        </p>
      </div>

      <div className="relative z-10">
        {/* Vertical Central Connecting Gold Line */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-[#E3DDCE] -translate-x-1/2 z-0">
          <div className="w-full h-full bg-gradient-to-b from-[#B4863A] via-[#C9A45C] to-[#B4863A]" />
        </div>

        {/* Timeline Milestones */}
        <div className="space-y-16 md:space-y-24">
          {HARDCODED_TIMELINE_EVENTS.map((event, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={event._id || idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >

                {/* Central Solid Gold Dot Marker for Desktop */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F3E9] border-4 border-[#B4863A] shadow-md z-20 items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3A2A1C]" />
                </div>

                {/* Left Column (Text on even, Image on odd) */}
                <div className={`md:col-span-6 space-y-3 ${isEven ? 'md:pr-12 text-left md:text-right' : 'md:order-2 md:pl-12 text-left'
                  }`}>
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

                {/* Right Column (Image on even, Text on odd) */}
                <div className={`md:col-span-6 ${isEven ? 'md:pl-12' : 'md:order-1 md:pr-12'
                  }`}>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E3DDCE] shadow-luxury bg-[#EFEAE0]">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className={`w-full h-full object-cover ${event.isArchival ? 'sepia-archival' : 'hover:scale-105 transition-transform duration-700'
                        }`}
                    />
                    {event.isArchival && (
                      <div className="absolute bottom-3 left-3 bg-[#2C2015]/80 backdrop-blur text-white text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        Historical Archival Photo (<AnimatedCounter value={event.year} duration={1} />)
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Bottom Heritage Quote Box */}
      <div className="mt-24 bg-[#3A2A1C] text-[#F7F3E9] rounded-xl p-8 sm:p-12 text-center border border-[#B4863A]/40 shadow-xl max-w-4xl mx-auto space-y-4 relative z-10">
        <Compass className="w-8 h-8 text-[#C9A45C] mx-auto" />
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#C9A45C]">
          "We do not build furniture for a season. We craft heirlooms to anchor family stories for generations."
        </h3>
        <p className="font-sans text-xs uppercase tracking-widest text-[#8A8478]">
          — Master Artisan Rajesh Sharma, Founder
        </p>
      </div>

    </div>
  );
};

export default Journey;
