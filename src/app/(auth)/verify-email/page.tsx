"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Mail, AlertTriangle } from "lucide-react";
import { useVerifyEmail } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AnimatedFormCard } from "@/components/auth/AnimatedFormCard";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verifyMutation = useVerifyEmail();
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (token && !hasAttempted) {
      setHasAttempted(true);
      verifyMutation.mutate(token);
    }
  }, [token, hasAttempted, verifyMutation]);

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
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  // No token provided
  if (!token) {
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
              className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-6"
              variants={iconVariants}
            >
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </motion.div>

            <motion.h1
              className="text-2xl font-semibold text-gray-900 mb-2"
              variants={itemVariants}
            >
              Invalid Link
            </motion.h1>

            <motion.p className="text-sm text-gray-600 mb-6" variants={itemVariants}>
              This verification link is invalid or missing the required token.
            </motion.p>

            <motion.div className="space-y-3" variants={itemVariants}>
              <Link href="/signup" className="block">
                <Button className="w-full">Sign up again</Button>
              </Link>
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

  // Loading state
  if (verifyMutation.isPending) {
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
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </motion.div>

            <motion.h1
              className="text-2xl font-semibold text-gray-900 mb-2"
              variants={itemVariants}
            >
              Verifying your email
            </motion.h1>

            <motion.p className="text-sm text-gray-600" variants={itemVariants}>
              Please wait while we verify your email address...
            </motion.p>
          </motion.div>
        </AnimatedFormCard>
      </AuthLayout>
    );
  }

  // Success state
  if (verifyMutation.isSuccess) {
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
              className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6"
              variants={iconVariants}
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>

            <motion.h1
              className="text-2xl font-semibold text-gray-900 mb-2"
              variants={itemVariants}
            >
              Email verified!
            </motion.h1>

            <motion.p className="text-sm text-gray-600 mb-6" variants={itemVariants}>
              Your email has been verified successfully. Redirecting you now...
            </motion.p>
          </motion.div>
        </AnimatedFormCard>
      </AuthLayout>
    );
  }

  // Error state
  if (verifyMutation.isError) {
    const errorDetail = verifyMutation.error?.response?.data?.detail || "";
    const isExpired = errorDetail.toLowerCase().includes("expired");
    const isAlreadyVerified = errorDetail.toLowerCase().includes("already verified");
    const isInvalid = errorDetail.toLowerCase().includes("invalid");

    let title = "Verification failed";
    let message = "We couldn't verify your email. Please try signing up again.";
    let Icon = XCircle;
    let iconBgColor = "bg-red-100";
    let iconColor = "text-red-600";

    if (isExpired) {
      title = "Link expired";
      message = "This verification link has expired. Please sign up again to receive a new link.";
      Icon = AlertTriangle;
      iconBgColor = "bg-yellow-100";
      iconColor = "text-yellow-600";
    } else if (isAlreadyVerified) {
      title = "Already verified";
      message = "Your email has already been verified. You can sign in to your account.";
      Icon = CheckCircle;
      iconBgColor = "bg-green-100";
      iconColor = "text-green-600";
    } else if (isInvalid) {
      title = "Invalid link";
      message = "This verification link is invalid. Please check the link or sign up again.";
      Icon = AlertTriangle;
      iconBgColor = "bg-yellow-100";
      iconColor = "text-yellow-600";
    }

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
              className={`mx-auto w-16 h-16 rounded-full ${iconBgColor} flex items-center justify-center mb-6`}
              variants={iconVariants}
            >
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </motion.div>

            <motion.h1
              className="text-2xl font-semibold text-gray-900 mb-2"
              variants={itemVariants}
            >
              {title}
            </motion.h1>

            <motion.p className="text-sm text-gray-600 mb-6" variants={itemVariants}>
              {message}
            </motion.p>

            <motion.div className="space-y-3" variants={itemVariants}>
              {isAlreadyVerified ? (
                <Link href="/login" className="block">
                  <Button className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Sign in
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup" className="block">
                    <Button className="w-full">Sign up again</Button>
                  </Link>
                  <Link href="/login" className="block">
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                      Back to login
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </AnimatedFormCard>
      </AuthLayout>
    );
  }

  // Default/initial state (shouldn't reach here normally)
  return (
    <AuthLayout>
      <AnimatedFormCard>
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </AnimatedFormCard>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
