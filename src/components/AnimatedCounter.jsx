import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * AnimatedCounter Component
 * Animates a numeric count-up / countdown from 0 to the target value when scrolled into view.
 * Auto-detects currency symbols, plus signs, percent signs, and text suffixes.
 */
const AnimatedCounter = ({
  value,
  duration = 1.6,
  className = '',
  prefix: propPrefix,
  suffix: propSuffix,
  decimals = 0
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [displayValue, setDisplayValue] = useState(0);

  // Parse string value if prefix/suffix are not provided explicitly
  let targetNumber = 0;
  let detectedPrefix = propPrefix !== undefined ? propPrefix : '';
  let detectedSuffix = propSuffix !== undefined ? propSuffix : '';

  if (typeof value === 'number') {
    targetNumber = value;
  } else if (typeof value === 'string') {
    const raw = value.trim();

    // Check leading non-digit characters (e.g. "₹")
    const leadingMatch = raw.match(/^[^\d.]+/);
    if (propPrefix === undefined && leadingMatch) {
      detectedPrefix = leadingMatch[0];
    }

    // Check trailing non-digit characters (e.g. "+", "%", " Pieces", "-Yr")
    const trailingMatch = raw.match(/[^\d.]+$/);
    if (propSuffix === undefined && trailingMatch) {
      detectedSuffix = trailingMatch[0];
    }

    // Extract raw float/int number
    const numericPart = raw.replace(/[^0-9.]/g, '');
    targetNumber = parseFloat(numericPart) || 0;
  }

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    let animationFrameId = null;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / (duration * 1000), 1);

      // Cubic ease-out curve for smooth countdown/countup feel
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeOutCubic * targetNumber;

      setDisplayValue(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(targetNumber);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, targetNumber, duration]);

  // Format value with Indian comma formatting if currency/large number
  const formattedVal = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString('en-IN');

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {detectedPrefix}
      {formattedVal}
      {detectedSuffix}
    </span>
  );
};

export default AnimatedCounter;
