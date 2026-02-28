'use client';

import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export function AnimatedBackground({ children, className = '' }: AnimatedBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();

  const orbVariants: Variants = {
    animate: (custom: { duration: number; delay: number }) => ({
      y: prefersReducedMotion ? 0 : [0, -30, 0],
      scale: prefersReducedMotion ? 1 : [1, 1.05, 1],
      transition: {
        duration: custom.duration,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        delay: custom.delay,
      },
    }),
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-shift" />

      {/* Floating orbs */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/10 blur-3xl"
            custom={{ duration: 20, delay: 0 }}
            variants={orbVariants}
            animate="animate"
          />
          <motion.div
            className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/15 to-emerald-500/10 blur-3xl"
            custom={{ duration: 25, delay: 2 }}
            variants={orbVariants}
            animate="animate"
          />
          <motion.div
            className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-blue-300/20 to-blue-500/10 blur-3xl"
            custom={{ duration: 22, delay: 4 }}
            variants={orbVariants}
            animate="animate"
          />
        </>
      )}

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
