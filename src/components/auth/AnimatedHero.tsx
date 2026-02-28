'use client';

import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Zap, Check } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    title: 'Save 35+ minutes per proposal',
    description: 'From 45 minutes to just 10 minutes',
  },
  {
    title: 'Increase win rate by 5-10%',
    description: 'Data-driven proposals that convert',
  },
  {
    title: 'Never forget past projects',
    description: 'AI finds relevant experience instantly',
  },
  {
    title: 'Know your win probability',
    description: 'Make informed decisions on which jobs to pursue',
  },
];

export function AnimatedHero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const featureVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      className="relative h-full flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div variants={itemVariants}>
        <Link href="/" className="flex items-center gap-3 mb-8 group">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20"
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          <span className="text-3xl font-semibold text-gray-900">ProposalIQ</span>
        </Link>
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-lg font-medium text-gray-900 mb-3"
        variants={itemVariants}
      >
        Win More Projects with AI-Powered Proposals
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="text-2xl text-gray-600 mb-10 leading-relaxed"
        variants={itemVariants}
      >
        Your company&apos;s entire history + AI = Winning proposals in 2 minutes
      </motion.p>

      {/* Features Card */}
      <motion.div
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        variants={itemVariants}
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="space-y-5">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              className="flex gap-4 items-start"
              variants={featureVariants}
              custom={index}
            >
              <motion.div
                className="shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
              >
                <Check className="w-5 h-5 text-green-600" strokeWidth={2.5} />
              </motion.div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
