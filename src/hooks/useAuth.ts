import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/auth-store";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import { AxiosError } from "axios";

export function useRegister() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      login(data.user, data.access_token);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const message = error.response?.data?.detail || "Registration failed";
      toast.error(message);
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
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
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
      router.push("/login");
      toast.success("Logged out successfully!");
    },
    onError: () => {
      // Logout locally even if API call fails
      logout();
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
