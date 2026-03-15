"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validations/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AnimatedFormCard } from "@/components/auth/AnimatedFormCard";
import { AnimatedInput } from "@/components/auth/AnimatedInput";
import { AnimatedButton } from "@/components/auth/AnimatedButton";
import { GoogleButton, GitHubButton } from "@/components/auth/SocialButtons";

export default function LoginPage() {
  const loginMutation = useLogin();
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showVerificationWarning, setShowVerificationWarning] = useState(false);

  // Check for 403 error to show verification warning
  useEffect(() => {
    if (loginMutation.error?.response?.status === 403) {
      setShowVerificationWarning(true);
    } else {
      setShowVerificationWarning(false);
    }
  }, [loginMutation.error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors = validation.error.issues;
      toast.error(errors[0]?.message || "Validation failed");
      return;
    }

    try {
      // Login using Axios via TanStack Query
      await loginMutation.mutateAsync({ email, password });
    } catch {
      // Error is handled by the mutation
    }
  };

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const loading = loginMutation.isPending;

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
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
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
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
        >
          <motion.h1
            className="text-2xl font-semibold text-gray-900 mb-2"
            variants={itemVariants}
          >
            Welcome back
          </motion.h1>
          <motion.p className="text-sm text-gray-600 mb-6" variants={itemVariants}>
            Sign in to your ProposalIQ account
          </motion.p>

          {/* Email verification warning banner */}
          <AnimatePresence>
            {showVerificationWarning && (
              <motion.div
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800">Email not verified</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please check your inbox and click the verification link to activate your account.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email</Label>
              <div className="mt-1.5">
                <AnimatedInput
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  required
                  data-testid="login-email-input"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="password" className="text-sm font-medium text-gray-900">Password</Label>
              <div className="mt-1.5">
                <AnimatedInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                  showPasswordToggle
                  required
                  data-testid="login-password-input"
                />
              </div>
            </motion.div>

            <motion.div className="flex items-center justify-between" variants={itemVariants}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 relative group">
                Forgot password?
                <motion.span
                  className="absolute left-0 -bottom-0.5 h-0.5 bg-blue-600 w-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: "left" }}
                />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <AnimatedButton type="submit" loading={loading} data-testid="login-submit-btn">
                Sign In
              </AnimatedButton>
            </motion.div>
          </form>

          <motion.div className="relative my-6" variants={itemVariants}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-2 gap-3" variants={itemVariants}>
            <GoogleButton onClick={handleGoogleLogin} />
            <GitHubButton onClick={handleGoogleLogin} />
          </motion.div>

          <motion.p className="mt-6 text-center text-sm text-gray-600" variants={itemVariants}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium relative group">
              Start free trial
              <motion.span
                className="absolute left-0 -bottom-0.5 h-0.5 bg-blue-600 w-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
                style={{ transformOrigin: "left" }}
              />
            </Link>
          </motion.p>
        </motion.div>
      </AnimatedFormCard>
    </AuthLayout>
  );
}
