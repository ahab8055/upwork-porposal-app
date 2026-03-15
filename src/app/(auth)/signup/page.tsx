"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User, Users } from "lucide-react";
import { useRegister, useInviteDetails } from "@/hooks/useAuth";
import { signupSchema } from "@/lib/validations/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AnimatedFormCard } from "@/components/auth/AnimatedFormCard";
import { AnimatedInput } from "@/components/auth/AnimatedInput";
import { AnimatedButton } from "@/components/auth/AnimatedButton";
import { GoogleButton, GitHubButton } from "@/components/auth/SocialButtons";
import { EmailSentConfirmation } from "@/components/auth/EmailSentConfirmation";

function SignupForm() {
  const searchParams = useSearchParams();
  const registerMutation = useRegister();
  const prefersReducedMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // Check for invite code in URL
  useEffect(() => {
    const code = searchParams.get("invite");
    if (code) {
      setInviteCode(code);
    }
  }, [searchParams]);

  // Fetch invite details if code exists using TanStack Query
  const { data: inviteDetails } = useInviteDetails(inviteCode);

  // Pre-fill email from invite
  useEffect(() => {
    if (inviteDetails?.email) {
      setEmail(inviteDetails.email);
    }
  }, [inviteDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod
    const validation = signupSchema.safeParse({ name, email, password });
    if (!validation.success) {
      const errors = validation.error.issues;
      toast.error(errors[0]?.message || "Validation failed");
      return;
    }

    try {
      // Register the user using Axios via TanStack Query
      await registerMutation.mutateAsync({ name, email, password });

      // Store invite code in sessionStorage if present (for use after email verification)
      if (inviteCode) {
        sessionStorage.setItem("pendingInviteCode", inviteCode);
      }

      // Show email confirmation screen
      setRegisteredEmail(email);
      setRegistrationComplete(true);
      toast.success("Account created! Please check your email to verify.");
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleTryAgain = () => {
    setRegistrationComplete(false);
    setRegisteredEmail("");
  };

  // Show email confirmation screen after successful registration
  if (registrationComplete) {
    return <EmailSentConfirmation email={registeredEmail} onTryAgain={handleTryAgain} />;
  }

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleGoogleSignup = () => {
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const loading = registerMutation.isPending;

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

  const inviteBannerVariants: Variants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: -30,
      scale: 0.95,
      transition: { duration: 0.2 },
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
            {inviteDetails ? "Join Your Team" : "Create your account"}
          </motion.h1>
          <motion.p className="text-sm text-gray-600 mb-6" variants={itemVariants}>
            {inviteDetails
              ? `You've been invited to join ${inviteDetails.workspace_name}`
              : "Start your 14-day free trial. No credit card required."}
          </motion.p>

          {/* Invite Banner */}
          <AnimatePresence mode="wait">
            {inviteDetails && (
              <motion.div
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-pulse-glow"
                variants={inviteBannerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <Users className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-blue-900">
                      {inviteDetails.invited_by} invited you
                    </p>
                    <p className="text-sm text-blue-700">
                      Join as {inviteDetails.role === "bd" ? "Business Developer" : inviteDetails.role} at {inviteDetails.workspace_name}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <Label htmlFor="name" className="text-sm font-medium text-gray-900">Full Name</Label>
              <div className="mt-1.5">
                <AnimatedInput
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="w-5 h-5" />}
                  required
                  data-testid="signup-name-input"
                />
              </div>
            </motion.div>

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
                  className={inviteDetails ? "bg-gray-50" : ""}
                  required
                  readOnly={!!inviteDetails}
                  data-testid="signup-email-input"
                />
              </div>
              <AnimatePresence>
                {inviteDetails && (
                  <motion.p
                    className="mt-1 text-sm text-blue-600"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.3 }}
                  >
                    This email is linked to your invite
                  </motion.p>
                )}
              </AnimatePresence>
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
                  minLength={6}
                  data-testid="signup-password-input"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <AnimatedButton type="submit" loading={loading} data-testid="signup-submit-btn">
                Start Free Trial
              </AnimatedButton>
            </motion.div>
          </form>

          {!inviteDetails && (
            <>
              <motion.div className="relative my-6" variants={itemVariants}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </motion.div>

              <motion.div className="grid grid-cols-2 gap-3" variants={itemVariants}>
                <GoogleButton onClick={handleGoogleSignup} />
                <GitHubButton onClick={handleGoogleSignup} />
              </motion.div>
            </>
          )}

          <motion.p className="mt-6 text-center text-sm text-gray-600" variants={itemVariants}>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium relative group">
              Sign in
              <motion.span
                className="absolute left-0 -bottom-0.5 h-0.5 bg-blue-600 w-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
                style={{ transformOrigin: "left" }}
              />
            </Link>
          </motion.p>

          <motion.p className="mt-4 text-center text-xs text-gray-500" variants={itemVariants}>
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      </AnimatedFormCard>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
