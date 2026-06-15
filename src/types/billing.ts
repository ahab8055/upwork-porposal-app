export type BillingCycle = "monthly" | "yearly" | "trial" | "custom";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export interface SubscriptionPlanLimits {
  proposals_per_month?: number | null;
  job_analyses_per_month?: number | null;
  ai_requests_per_month?: number | null;
  knowledge_base_files?: number | null;
  team_members?: number | null;
  workspaces?: number | null;
  trial_days?: number | null;
  [key: string]: number | null | undefined;
}

export interface SubscriptionPlanRecord {
  id: string;
  plan_code: string;
  name: string;
  description: string | null;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  billing_cycle: BillingCycle;
  price_cents: number | null;
  currency: string;
  features: string[];
  limits: SubscriptionPlanLimits;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BillingPlanItem extends SubscriptionPlanRecord {
  price_display: string;
  is_purchasable: boolean;
  is_stripe_linked: boolean;
}

export interface BillingPlanListResponse {
  items: BillingPlanItem[];
  total: number;
}

export interface WorkspaceSubscriptionDetail {
  id: string;
  workspace_id: string;
  plan_id: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  status: SubscriptionStatus;
  trial_starts_at?: string | null;
  trial_ends_at?: string | null;
  trial_start_date?: string | null;
  trial_end_date?: string | null;
  trial_used?: boolean;
  is_trial_active?: boolean;
  trial_days_remaining?: number;
  current_period_start?: string | null;
  current_period_end?: string | null;
  canceled_at?: string | null;
  cancel_at_period_end?: boolean;
  created_at?: string;
  updated_at?: string;
  plan?: SubscriptionPlanRecord | null;
}

export interface CurrentSubscriptionResponse {
  id: string;
  workspace_id: string;
  plan_id: string;
  plan_code: string;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: SubscriptionPlanRecord | null;
  trial_start_date: string | null;
  trial_end_date: string | null;
  trial_used: boolean;
  is_trial_active: boolean;
  is_trial_expired: boolean;
  trial_days_remaining: number;
  trial_duration_days: number;
  current_period_start: string | null;
  current_period_end: string | null;
  renewal_date: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  limits: SubscriptionPlanLimits;
  features: string[];
  access_granted: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsageMetricSummary {
  used: number;
  limit: number | null;
  remaining: number | null;
  unlimited: boolean;
}

export interface WorkspaceUsageResponse {
  workspace_id: string;
  plan_code: string;
  period_start: string;
  period_end: string;
  proposal_generations: UsageMetricSummary;
  job_analyses: UsageMetricSummary;
  ai_requests: UsageMetricSummary;
}

export interface CreateCheckoutSessionRequest {
  plan_id?: string;
  plan_code?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
  workspace_id: string;
  plan_id: string;
  plan_code: string;
  stripe_customer_id: string;
}

export interface CreateBillingPortalSessionRequest {
  return_url?: string;
}

export interface BillingPortalSessionResponse {
  portal_url: string;
  session_id: string;
  workspace_id: string;
  stripe_customer_id: string;
}

export interface WorkspaceTrialStatusResponse {
  workspace_id: string;
  subscription_id: string;
  plan_code: string;
  status: SubscriptionStatus;
  trial_start_date: string | null;
  trial_end_date: string | null;
  trial_used: boolean;
  is_trial_active: boolean;
  is_trial_expired: boolean;
  trial_days_remaining: number;
  access_granted: boolean;
  trial_duration_days: number;
}
