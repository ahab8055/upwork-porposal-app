import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import {
  onboardingService,
  OnboardingCompleteRequest,
  OnboardingCompleteResponse,
} from "@/services/onboardingService";
import { billingService } from "@/services/billingService";
import { buildCheckoutReturnUrls } from "@/lib/checkout-urls";
import { AxiosError } from "axios";

export function useCompleteOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const switchWorkspace = useAuthStore((state) => state.switchWorkspace);
  const setWorkspaces = useAuthStore((state) => state.setWorkspaces);
  const workspaces = useAuthStore((state) => state.workspaces);

  return useMutation({
    mutationFn: (data: OnboardingCompleteRequest) =>
      onboardingService.completeOnboarding(data, (workspaceId: string) => {
        localStorage.setItem("currentWorkspaceId", workspaceId);

        const newWorkspace = {
          id: workspaceId,
          name: data.company_name,
          role: "owner" as const,
        };
        setWorkspaces([...workspaces, newWorkspace]);
        switchWorkspace(workspaceId);
      }),
    onSuccess: async (data: OnboardingCompleteResponse) => {
      if (user) {
        setUser({ ...user, onboarding_completed: true });
      }

      await queryClient.invalidateQueries({ queryKey: ["workspace-subscription"] });
      await queryClient.invalidateQueries({ queryKey: ["trial-status"] });

      if (data.requires_checkout && data.selected_plan_code) {
        toast.success("Workspace created! Redirecting to secure checkout...");
        try {
          const { success_url, cancel_url } = buildCheckoutReturnUrls(
            window.location.origin
          );
          const checkout = await billingService.createCheckoutSession({
            plan_code: data.selected_plan_code,
            success_url,
            cancel_url,
          });
          if (checkout.checkout_url) {
            window.location.assign(checkout.checkout_url);
            return;
          }
        } catch {
          toast.error("Could not start Stripe checkout. Choose a plan from billing.");
          router.push("/subscription?tab=plans");
          return;
        }
      }

      toast.success(
        data.selected_plan_code === "free_trial"
          ? "Free trial started! Welcome aboard."
          : "Onboarding completed!"
      );
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const message =
        error.response?.data?.detail || "Failed to complete onboarding";
      toast.error(message);
    },
  });
}
