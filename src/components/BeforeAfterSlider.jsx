import React, { useState, useRef, useCallback } from 'react';
import { Sliders } from 'lucide-react';

const BeforeAfterSlider = ({ beforeImage, afterImage, title, scope }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="flex flex-col bg-white border border-[#E3DDCE] rounded-lg overflow-hidden shadow-luxury">
      
      {/* Slider Visual Container */}
      <div 
        ref={containerRef}
        className="relative aspect-[16/10] sm:aspect-[16/9] w-full select-none cursor-ew-resize overflow-hidden bg-[#EFEAE0]"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE (Base image background) */}
        <img
          src={afterImage}
          alt={`After transformation: ${title}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-[#2C2015]/80 backdrop-blur text-[#C9A45C] text-[10px] font-sans font-bold tracking-widest uppercase px-3 py-1 rounded border border-[#C9A45C]/30 z-10">
          AFTER (COMPLETED CRAFT)
        </div>

        {/* BEFORE IMAGE (Clipped overlay) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImage}
            alt={`Before restoration: ${title}`}
            className="absolute top-0 left-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
          />
          <div className="absolute top-3 left-3 bg-[#3A2A1C]/80 backdrop-blur text-white text-[10px] font-sans font-bold tracking-widest uppercase px-3 py-1 rounded border border-white/20 z-10">
            BEFORE (ORIGINAL/RAW)
          </div>
        </div>

        {/* DRAG HANDLE BAR */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-[#B4863A] cursor-ew-resize z-20"
          style={{ left: `calc(${sliderPos}% - 2px)` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 rounded-full bg-[#2C2015] border-2 border-[#B4863A] text-[#C9A45C] flex items-center justify-center shadow-xl">
            <Sliders className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Description Meta */}
      {title && (
        <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#E3DDCE]">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#3A2A1C]">{title}</h4>
            <p className="font-sans text-xs text-[#4A5A78] mt-0.5">{scope}</p>
          </div>
          <span className="font-sans text-[11px] text-[#B4863A] font-semibold uppercase tracking-wider">
            ← Drag slider to compare →
          </span>
        </div>
      )}

    </div>
  );
};

export default BeforeAfterSlider;
