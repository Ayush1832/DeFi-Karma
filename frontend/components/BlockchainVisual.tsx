'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function BlockchainVisual() {
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    setMounted(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const nodes = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: (i % 4) * 25,
    y: Math.floor(i / 4) * 33,
    delay: i * 0.2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Blockchain Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + (node.id % 3),
            repeat: Infinity,
            delay: node.delay,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
        >
          <div className="w-2 h-2 bg-teal-400 rounded-full blur-sm" />
        </motion.div>
      ))}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: 8 }).map((_, i) => {
          const x1 = 20 + i * 10;
          const x2 = 25 + i * 10;
          return (
            <motion.line
              key={i}
              x1={`${x1}%`}
              y1="0%"
              x2={`${x2}%`}
              y2="100%"
              stroke="rgba(0, 194, 168, 0.2)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
