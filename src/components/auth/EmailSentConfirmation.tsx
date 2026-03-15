"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AnimatedFormCard } from "@/components/auth/AnimatedFormCard";
import { Button } from "@/components/ui/button";

interface EmailSentConfirmationProps {
  email: string;
  onTryAgain: () => void;
}

export function EmailSentConfirmation({ email, onTryAgain }: EmailSentConfirmationProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  const pulseVariants: Variants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AuthLayout>
      <AnimatedFormCard>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div
            className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6"
            variants={iconVariants}
          >
            <motion.div variants={pulseVariants} animate="animate">
              <Mail className="w-8 h-8 text-blue-600" />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-2xl font-semibold text-gray-900 mb-2"
            variants={itemVariants}
          >
            Check your email
          </motion.h1>

          <motion.p className="text-sm text-gray-600 mb-2" variants={itemVariants}>
            We&apos;ve sent a verification link to
          </motion.p>

          <motion.p
            className="text-sm font-medium text-gray-900 mb-6"
            variants={itemVariants}
          >
            {email}
          </motion.p>

          <motion.div
            className="bg-gray-50 rounded-lg p-4 mb-6 text-left"
            variants={itemVariants}
          >
            <p className="text-sm text-gray-600">
              Click the link in the email to verify your account. The link will expire in{" "}
              <span className="font-medium text-gray-900">24 hours</span>.
            </p>
          </motion.div>

          <motion.p className="text-sm text-gray-500 mb-6" variants={itemVariants}>
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </motion.p>

          <motion.div className="space-y-3" variants={itemVariants}>
            <Button
              variant="outline"
              className="w-full"
              onClick={onTryAgain}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try again
            </Button>

            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                Back to login
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatedFormCard>
    </AuthLayout>
  );
}
