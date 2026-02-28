'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedFormCardProps {
  children: ReactNode;
}

export function AnimatedFormCard({ children }: AnimatedFormCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
