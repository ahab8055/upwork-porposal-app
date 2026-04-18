"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Lock, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AnimatedFormCard } from "@/components/auth/AnimatedFormCard";
import { AnimatedInput } from "@/components/auth/AnimatedInput";
import { AnimatedButton } from "@/components/auth/AnimatedButton";
import { acceptInviteSchema } from "@/lib/validations/auth";
import { useAcceptInvite } from "@/hooks/useTeam";
import type { InviteTokenPayload } from "@/types/team";

function decodeJwtPayload<T>(token: string): T | null {
  try {
    const base64 = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    return JSON.parse(atob(base64)) as T;
  } catch {
    return null;
  }
}

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const acceptInviteMutation = useAcceptInvite();
  const prefersReducedMotion = useReducedMotion();

  const token = searchParams.get("token");
  const payload = token ? decodeJwtPayload<InviteTokenPayload>(token) : null;

  const [name, setName] = useState(payload?.name ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token || !payload) {
      toast.error("Invalid invite link");
      router.push("/login");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!token || !payload) return null;

  const userExisted = payload.user_existed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userExisted) {
      try {
        await acceptInviteMutation.mutateAsync({ token });
      } catch {
        // handled by mutation
      }
      return;
    }

    const validation = acceptInviteSchema.safeParse({
      name,
      password,
      confirmPassword,
    });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Validation failed");
      return;
    }

    try {
      await acceptInviteMutation.mutateAsync({ token, name, password });
    } catch {
      // handled by mutation
    }
  };

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
            Accept Invite
          </motion.h1>

          <motion.p
            className="text-sm text-gray-500 mb-6"
            variants={itemVariants}
          >
            You&apos;ve been invited to join{" "}
            <span className="font-medium text-gray-700">
              {payload.workspace_name}
            </span>
          </motion.p>

          {/* Read-only email badge */}
          <motion.div
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-6 text-sm text-gray-600"
            variants={itemVariants}
          >
            <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
            {payload.email}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!userExisted && (
              <>
                <motion.div variants={itemVariants}>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                  >
                    Name
                  </Label>
                  <AnimatedInput
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                  >
                    Password
                  </Label>
                  <AnimatedInput
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    showPasswordToggle
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                  >
                    Confirm Password
                  </Label>
                  <AnimatedInput
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    showPasswordToggle
                    required
                  />
                </motion.div>
              </>
            )}

            {userExisted && (
              <motion.p className="text-sm text-gray-500" variants={itemVariants}>
                Click below to accept your invite to{" "}
                <span className="font-medium text-gray-700">
                  {payload.workspace_name}
                </span>
                .
              </motion.p>
            )}

            <motion.div variants={itemVariants}>
              <AnimatedButton
                type="submit"
                loading={acceptInviteMutation.isPending}
              >
                {userExisted ? "Accept Invite" : "Set Password & Join"}
              </AnimatedButton>
            </motion.div>
          </form>
        </motion.div>
      </AnimatedFormCard>
    </AuthLayout>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense>
      <AcceptInviteContent />
    </Suspense>
  );
}
