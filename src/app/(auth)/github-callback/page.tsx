"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGitHubAuth } from "@/hooks/useAuth";

export default function GitHubCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate: githubAuth, isPending } = useGitHubAuth();
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error("GitHub sign-in was cancelled.");
      router.replace("/login");
      return;
    }

    if (!code) {
      toast.error("GitHub sign-in failed. No authorization code received.");
      router.replace("/login");
      return;
    }

    hasFired.current = true;
    githubAuth({ code });
  }, [searchParams, githubAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        {isPending ? (
          <>
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-600">Signing you in with GitHub…</p>
          </>
        ) : (
          <p className="text-sm text-gray-600">Redirecting…</p>
        )}
      </div>
    </div>
  );
}
