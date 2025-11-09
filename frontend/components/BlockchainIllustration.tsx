'use client';

import { motion } from 'framer-motion';

export function BlockchainIllustration() {
  const blocks = Array.from({ length: 5 });

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connection Lines */}
        {blocks.map((_, i) => (
          <motion.line
            key={`line-${i}`}
            x1={80 + i * 60}
            y1={150}
            x2={80 + (i + 1) * 60}
            y2={150}
            stroke="url(#gradient)"
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}

        {/* Blocks */}
        {blocks.map((_, i) => (
          <g key={`block-${i}`}>
            <motion.rect
              x={50 + i * 60}
              y={100}
              width="60"
              height="100"
              rx="8"
              fill="url(#blockGradient)"
              stroke="rgba(0, 194, 168, 0.5)"
              strokeWidth="2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: 0,
                y: [100, 90, 100],
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                y: {
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                },
              }}
            />
            <motion.text
              x={80 + i * 60}
              y={155}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.3 }}
            >
              Block {i + 1}
            </motion.text>
          </g>
        ))}

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00c2a8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6e45e2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00c2a8" stopOpacity="0.8" />
            <animate
              attributeName="x1"
              values="0%;100%;0%"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="100%;0%;100%"
              dur="3s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <linearGradient id="blockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 194, 168, 0.3)" />
            <stop offset="100%" stopColor="rgba(110, 69, 226, 0.3)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

