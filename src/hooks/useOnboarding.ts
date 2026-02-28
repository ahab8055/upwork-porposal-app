import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import {
  onboardingService,
  OnboardingCompleteRequest,
} from "@/services/onboardingService";
import { AxiosError } from "axios";

export function useCompleteOnboarding() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: OnboardingCompleteRequest) =>
      onboardingService.completeOnboarding(data),
    onSuccess: () => {
      // Update user state with onboarding_completed = true
      if (user) {
        setUser({ ...user, onboarding_completed: true });
      }
      toast.success("Onboarding completed!");
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const message =
        error.response?.data?.detail || "Failed to complete onboarding";
      toast.error(message);
    },
  });
}
