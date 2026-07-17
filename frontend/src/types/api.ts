export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  up: boolean;
  note: string;
}

export interface DashboardActivityItem {
  id: string | number;
  name: string;
  action: string;
  time: string;
  initials: string;
  color: string;
}

export interface DashboardPlanBreakdown {
  label: string;
  count: string;
  pct: number;
  cls: string;
}

export interface DashboardMiniStat {
  label: string;
  value: string;
}

export interface DashboardRevenuePoint {
  month: string;
  revenue: number;
  target: number;
}

export interface DashboardChannelPoint {
  channel: string;
  value: number;
}

export interface DashboardData {
  revenueData: DashboardRevenuePoint[];
  channelData: DashboardChannelPoint[];
  activity: DashboardActivityItem[];
  metrics: DashboardMetric[];
  plans: DashboardPlanBreakdown[];
  miniStats: DashboardMiniStat[];
}

export interface Transaction {
  _id: string;
  customerName: string;
  type: string;
  description?: string;
  amount: number;
  status: string;
  date: string;
}

export interface TransactionsSummary {
  totalRevenue?: number;
  pendingAmount?: number;
  successRate?: number;
  totalCount?: number;
}

export interface TransactionsData {
  transactions: Transaction[];
  summary: TransactionsSummary;
  pages: number;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  plan: string;
  ltv: number;
  status: string;
  acquisitionChannel?: string;
  createdAt: string;
}

export interface CustomersStats {
  total?: number;
  active?: number;
  churned?: number;
  avgLtv?: number;
}

export interface CustomersData {
  customers: Customer[];
  stats: CustomersStats;
  pages: number;
}

export interface InsightsSummary {
  revenueGrowth?: number;
  thisMonthRevenue?: number;
  lastMonthRevenue?: number;
  totalCustomers?: number;
  newCustomersThisMonth?: number;
}

export interface InsightsMonthlyRevenue {
  month: string;
  revenue: number;
}

export interface InsightsTopCustomer {
  id: string;
  name: string;
  count: number;
  total: number;
}

export interface InsightsRevenueByType {
  type: string;
  pct: number;
  total: number;
}

export interface InsightsData {
  summary: InsightsSummary;
  monthlyRevenue: InsightsMonthlyRevenue[];
  topCustomers: InsightsTopCustomer[];
  revenueByType: InsightsRevenueByType[];
}

export interface ReportsByPeriod {
  period: string;
  revenue: number;
}

export type SubscriptionPlan = "free" | "starter" | "growth" | "scale";

export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export interface SubscriptionData {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  hasBillingAccount: boolean;
}

export interface ReportsByType {
  type: string;
  count: number;
  revenue: number;
}

export interface ReportsData {
  byPeriod: ReportsByPeriod[];
  byType: ReportsByType[];
  totalRevenue: number;
  totalTransactions: number;
}
