import React from 'react';

/**
 * LiquidDistortionFilter
 * Renders SVG filter primitives used to create fluid liquid distortion hover effects on portfolio images.
 */
const LiquidDistortionFilter = () => {
  return (
    <svg className="hidden pointer-events-none absolute w-0 h-0" aria-hidden="true">
      <defs>
        <filter id="liquid-distortion" x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.04"
            numOctaves="2"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="8s"
              values="0.02 0.04; 0.04 0.02; 0.02 0.04"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default LiquidDistortionFilter;
