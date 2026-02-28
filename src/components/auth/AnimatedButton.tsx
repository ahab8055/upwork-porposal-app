'use client';

import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
  variant?: 'primary' | 'outline';
}

export function AnimatedButton({
  loading,
  children,
  variant = 'primary',
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const buttonVariants: Variants = {
    hover: {
      scale: 1.02,
      boxShadow: variant === 'primary'
        ? '0 10px 25px -5px rgba(37, 99, 235, 0.25)'
        : '0 8px 20px -5px rgba(0, 0, 0, 0.1)',
      y: variant === 'outline' ? -2 : 0,
      transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
    },
    tap: {
      scale: 0.98,
      transition: { type: 'spring' as const, stiffness: 500, damping: 30 },
    },
  };

  return (
    <motion.div
      variants={buttonVariants}
      whileHover={!loading && !disabled ? 'hover' : undefined}
      whileTap={!loading && !disabled ? 'tap' : undefined}
    >
      <Button
        className={`w-full h-11 ${variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : ''} ${className || ''}`}
        variant={variant === 'outline' ? 'outline' : 'default'}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  );
}
