import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/auth-store";
import { removeAuthCookie } from "@/lib/cookies";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import { AxiosError } from "axios";

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onError: (error: AxiosError<{ detail?: string }>) => {
      const message = error.response?.data?.detail || "Registration failed";
      toast.error(message);
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: (data) => {
      login(data.user, data.access_token);
      toast.success("Email verified successfully!");

      // Check if user has workspace and completed onboarding
      const hasWorkspace = data.user.default_workspace_id || (data.user.workspaces && data.user.workspaces.length > 0);
      const canAccessDashboard = data.user.onboarding_completed && hasWorkspace;

      router.push(canAccessDashboard ? "/dashboard" : "/onboarding");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      toast.error(error.response?.data?.detail || "Verification failed");
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      login(data.user, data.access_token);
      toast.success("Welcome back!");

      // Check if user has workspace and completed onboarding
      const hasWorkspace = data.user.default_workspace_id || (data.user.workspaces && data.user.workspaces.length > 0);
      const canAccessDashboard = data.user.onboarding_completed && hasWorkspace;

      router.push(canAccessDashboard ? "/dashboard" : "/onboarding");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      // Don't show toast for 403 - let the component handle showing the verification banner
      if (error.response?.status === 403) {
        return;
      }
      const message = error.response?.data?.detail || "Login failed";
      toast.error(message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      removeAuthCookie();
      router.push("/login");
      toast.success("Logged out successfully!");
    },
    onError: () => {
      // Logout locally even if API call fails
      logout();
      removeAuthCookie();
      router.push("/login");
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
  });
}

export function useInviteDetails(code: string | null) {
  return useQuery({
    queryKey: ["inviteDetails", code],
    queryFn: () => authService.getInviteDetails(code!),
    enabled: !!code,
    retry: false,
  });
}

export function useAcceptInvite() {
  return useMutation({
    mutationFn: (code: string) => authService.acceptInvite(code),
  });
}
