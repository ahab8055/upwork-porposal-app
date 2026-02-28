'use client';

import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { AnimatedHero } from './AnimatedHero';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const prefersReducedMotion = useReducedMotion();

  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const mobileLogoVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.1 },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex"
      variants={pageVariants}
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      animate="visible"
    >
      {/* Left Side - Branding with Animated Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-12 flex-col">
        <AnimatedHero />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            className="lg:hidden mb-8"
            variants={mobileLogoVariants}
            initial={prefersReducedMotion ? 'visible' : 'hidden'}
            animate="visible"
          >
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-semibold text-gray-900">ProposalIQ</span>
            </Link>
          </motion.div>

          {children}
        </div>
      </div>
    </motion.div>
  );
}
