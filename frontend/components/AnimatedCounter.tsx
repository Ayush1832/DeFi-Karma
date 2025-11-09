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
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const countRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (inView) {
      const startValue = countRef.current;
      const endValue = value;
      const startTime = Date.now();
      const durationMs = duration * 1000;

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / durationMs, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOut;
        
        setCount(currentValue);
        countRef.current = currentValue;

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCount(endValue);
          countRef.current = endValue;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

