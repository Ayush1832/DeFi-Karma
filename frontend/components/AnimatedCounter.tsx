'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  // Initialize with value to prevent hydration mismatch
  const [count, setCount] = useState(value);
  const [mounted, setMounted] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const hasAnimated = useRef(false);
  const animationRef = useRef<number | undefined>(undefined);

  // Set mounted state after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only animate after component is mounted and in view, and hasn't animated yet
    if (mounted && inView && !hasAnimated.current) {
      hasAnimated.current = true;
      setCount(0); // Start from 0 for animation
      
      const startValue = 0;
      const endValue = value;
      const startTime = performance.now();
      const durationMs = duration * 1000;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOut;
        
        setCount(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, inView, value, duration]);

  // On server and initial render, show the value directly to prevent hydration mismatch
  if (!mounted) {
    return (
      <span ref={ref}>
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

