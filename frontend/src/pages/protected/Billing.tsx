import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CardBrandMark from "@/components/CardBrandMark";
import { fetchWithAuth } from "@/lib/api";
import type { SubscriptionData, SubscriptionPlan } from "@/types/api";

const SUBSCRIPTIONS_URL = import.meta.env.VITE_SUBSCRIPTIONS_URL;

const PLAN_PRICE: Record<SubscriptionPlan, number> = {
  free: 0,
  starter: 19,
  growth: 79,
  scale: 249,
};

const STATUS_BADGE: Record<
  SubscriptionData["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  trialing: {
    label: "Trial",
    className: "text-sky-700 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400",
  },
  past_due: {
    label: "Past due",
    className: "text-amber-700 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
  },
  unpaid: {
    label: "Unpaid",
    className: "text-red-700 bg-red-50 dark:bg-red-500/10 dark:text-red-400",
  },
  canceled: {
    label: "Canceled",
    className: "text-muted-foreground bg-muted",
  },
  none: {
    label: "No active plan",
    className: "text-muted-foreground bg-muted",
  },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Billing() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWithAuth(SUBSCRIPTIONS_URL);
        const json = await res.json();
        if (json.success) setSubscription(json.data);
      } catch (error) {
        console.error("Failed to load subscription:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const plan = subscription?.plan ?? "free";
  const status = subscription?.status ?? "none";
  const badge = STATUS_BADGE[status];
  const price = PLAN_PRICE[plan];

  let periodProgress: { pct: number; daysLeft: number } | null = null;
  if (subscription?.currentPeriodStart && subscription?.currentPeriodEnd) {
    const start = new Date(subscription.currentPeriodStart).getTime();
    const end = new Date(subscription.currentPeriodEnd).getTime();
    const now = Date.now();
    const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
    const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    periodProgress = { pct, daysLeft };
  }

  return (
    <>
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Manage</span>
          <ChevronRight size={13} className="text-muted-foreground/40" />
          <span className="font-medium">Billing</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-foreground">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-400" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-5 bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Current plan */}
          <Card className="shadow-none border">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[14px] font-semibold">
                  Current plan
                </CardTitle>
                <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${badge.className}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {badge.label}
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-semibold">
                      {loading ? "…" : plan[0].toUpperCase() + plan.slice(1)}
                    </p>
                    {price > 0 && (
                      <p className="text-[13px] text-muted-foreground">
                        <span className="font-semibold text-foreground">${price}</span>
                        /month
                      </p>
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    {subscription?.currentPeriodEnd
                      ? `Renews on ${formatDate(subscription.currentPeriodEnd)} · Billed monthly`
                      : "No active subscription"}
                  </p>
                </div>
                <Button asChild size="sm" className="shrink-0">
                  <Link to="/subscriptions">Change plan</Link>
                </Button>
              </div>

              {/* Billing period progress */}
              {periodProgress && subscription?.currentPeriodStart && subscription?.currentPeriodEnd && (
                <div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                    <span>
                      Current period · {formatDate(subscription.currentPeriodStart)} –{" "}
                      {formatDate(subscription.currentPeriodEnd)}
                    </span>
                    <span>{periodProgress.daysLeft} days left</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-400"
                      style={{ width: `${periodProgress.pct}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment method */}
          <Card className="shadow-none border">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-[14px] font-semibold">
                Payment method
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CardBrandMark brand="visa" />
                  <div>
                    <p className="text-[13px] font-medium">Visa ·· 4242</p>
                    <p className="text-[12px] text-muted-foreground">
                      Expires 08/27
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  <Link to="/payment-methods">Update</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoices link row */}
          <Card className="shadow-none border">
            <CardContent className="px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium">Invoice history</p>
                  <p className="text-[12px] text-muted-foreground">
                    View and download past invoices for your records.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  <Link to="/invoices">View invoices</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
