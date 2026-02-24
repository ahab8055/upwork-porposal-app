"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Zap, Mail, Lock, Eye, EyeOff, User, Users } from "lucide-react";
import { useRegister, useInviteDetails, useAcceptInvite } from "@/hooks/useAuth";
import { signupSchema } from "@/lib/validations/auth";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const registerMutation = useRegister();
  const acceptInviteMutation = useAcceptInvite();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  // Check for invite code in URL
  useEffect(() => {
    const code = searchParams.get("invite");
    if (code) {
      setInviteCode(code);
    }
  }, [searchParams]);

  // Fetch invite details if code exists using TanStack Query
  const { data: inviteDetails, isLoading: loadingInvite } = useInviteDetails(inviteCode);

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

      // If there's an invite code, accept it
      if (inviteCode && inviteDetails) {
        try {
          await acceptInviteMutation.mutateAsync(inviteCode);
          toast.success(`Welcome to ${inviteDetails.workspace_name}!`);
        } catch (e) {
          console.error("Error accepting invite:", e);
        }
      }
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleGoogleSignup = () => {
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const loading = registerMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-xl font-semibold text-slate-900">ProposalIQ</span>
          </Link>

          <h1 className="font-heading text-3xl font-bold text-slate-900 mb-2">
            {inviteDetails ? "Join Your Team" : "Create your account"}
          </h1>
          <p className="text-slate-600 mb-6">
            {inviteDetails 
              ? `You've been invited to join ${inviteDetails.workspace_name}` 
              : "Start winning more contracts today"}
          </p>

          {/* Invite Banner */}
          {inviteDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    {inviteDetails.invited_by} invited you
                  </p>
                  <p className="text-sm text-blue-700">
                    Join as {inviteDetails.role === "bd" ? "Business Developer" : inviteDetails.role} at {inviteDetails.workspace_name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Google Sign Up */}
          {!inviteDetails && (
            <>
              <Button
                variant="outline"
                className="w-full mb-6 h-12"
                onClick={handleGoogleSignup}
                data-testid="google-signup-btn"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-50 text-slate-500">or sign up with email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-slate-700">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12"
                  required
                  data-testid="signup-name-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 h-12 ${inviteDetails ? "bg-slate-50" : ""}`}
                  required
                  readOnly={!!inviteDetails}
                  data-testid="signup-email-input"
                />
              </div>
              {inviteDetails && (
                <p className="mt-1 text-sm text-blue-600">This email is linked to your invite</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                  minLength={6}
                  data-testid="signup-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-500">At least 6 characters</p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
              data-testid="signup-submit-btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 bg-blue-600 items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Your proposals, supercharged
          </h2>
          <p className="text-blue-100 text-lg">
            Upload your portfolio and let AI help you write winning proposals in minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
