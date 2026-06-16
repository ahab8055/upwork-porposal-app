import { apiClient } from "@/lib/axios";
import {
  BillingPlanListResponse,
  BillingPortalSessionResponse,
  CheckoutSessionResponse,
  CreateBillingPortalSessionRequest,
  CreateCheckoutSessionRequest,
  CurrentSubscriptionResponse,
  WorkspaceSubscriptionDetail,
  WorkspaceTrialStatusResponse,
  WorkspaceUsageResponse,
} from "@/types/billing";

export const billingService = {
  getPlans: async (): Promise<BillingPlanListResponse> => {
    const response = await apiClient.get<BillingPlanListResponse>("/billing/plans");
    return response.data;
  },

  getWorkspaceSubscription: async (): Promise<WorkspaceSubscriptionDetail> => {
    const response = await apiClient.get<WorkspaceSubscriptionDetail>(
      "/workspace-subscription"
    );
    return response.data;
  },

  getCurrentSubscription: async (): Promise<CurrentSubscriptionResponse> => {
    const response = await apiClient.get<CurrentSubscriptionResponse>(
      "/workspace-subscription/current"
    );
    return response.data;
  },

  getWorkspaceUsage: async (): Promise<WorkspaceUsageResponse> => {
    const response = await apiClient.get<WorkspaceUsageResponse>("/billing/usage");
    return response.data;
  },

  getTrialStatus: async (): Promise<WorkspaceTrialStatusResponse> => {
    const response = await apiClient.get<WorkspaceTrialStatusResponse>(
      "/workspace-subscription/trial"
    );
    return response.data;
  },

  createCheckoutSession: async (
    payload: CreateCheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> => {
    const response = await apiClient.post<CheckoutSessionResponse>(
      "/workspace-subscription/checkout",
      payload
    );
    return response.data;
  },

  startFreeTrial: async (): Promise<WorkspaceSubscriptionDetail> => {
    const response = await apiClient.post<WorkspaceSubscriptionDetail>(
      "/workspace-subscription/trial/start"
    );
    return response.data;
  },

  createBillingPortalSession: async (
    payload?: CreateBillingPortalSessionRequest
  ): Promise<BillingPortalSessionResponse> => {
    const response = await apiClient.post<BillingPortalSessionResponse>(
      "/billing/portal",
      payload ?? {}
    );
    return response.data;
  },
};
