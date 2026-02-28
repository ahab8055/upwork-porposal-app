'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  showPasswordToggle?: boolean;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ icon, showPasswordToggle, type, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

    return (
      <motion.div
        className="relative"
        animate={
          isFocused
            ? { y: -2, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)' }
            : { y: 0, boxShadow: 'none' }
        }
        transition={{ duration: 0.2 }}
        style={{ borderRadius: '0.5rem' }}
      >
        {icon && (
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            animate={{
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? 'rgb(37, 99, 235)' : 'rgb(156, 163, 175)',
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <Input
          ref={ref}
          type={inputType}
          className={`${icon ? 'pl-10' : ''} ${showPasswordToggle ? 'pr-10' : ''} h-11 transition-all duration-200 ${className || ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={showPassword ? 'hide' : 'show'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        )}
      </motion.div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';
