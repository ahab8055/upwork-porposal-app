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
  const switchWorkspace = useAuthStore((state) => state.switchWorkspace);
  const setWorkspaces = useAuthStore((state) => state.setWorkspaces);
  const workspaces = useAuthStore((state) => state.workspaces);

  return useMutation({
    mutationFn: (data: OnboardingCompleteRequest) =>
      onboardingService.completeOnboarding(data, (workspaceId: string) => {
        // Set the workspace ID in localStorage immediately so file uploads work
        localStorage.setItem("currentWorkspaceId", workspaceId);

        // Also update the store state
        const newWorkspace = { id: workspaceId, name: data.company_name, role: "owner" as const };
        setWorkspaces([...workspaces, newWorkspace]);
        switchWorkspace(workspaceId);
      }),
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
