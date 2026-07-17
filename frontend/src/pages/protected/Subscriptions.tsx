import { useEffect, useState } from "react";
import { ChevronRight, Bell, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/api";
import type { SubscriptionData, SubscriptionPlan } from "@/types/api";

const SUBSCRIPTIONS_URL = import.meta.env.VITE_SUBSCRIPTIONS_URL;

const ACTIVE_STATUSES = ["active", "trialing"];

const plans: {
  key: SubscriptionPlan;
  name: string;
  price: number;
  description: string;
  features: string[];
}[] = [
  {
    key: "starter",
    name: "Starter",
    price: 19,
    description: "For solo builders getting payments live.",
    features: ["1 team member", "500 transactions / mo", "Email support"],
  },
  {
    key: "growth",
    name: "Growth",
    price: 79,
    description: "For teams scaling their customer base.",
    features: ["5 team members", "Unlimited transactions", "Priority support"],
  },
  {
    key: "scale",
    name: "Scale",
    price: 249,
    description: "For larger operations needing advanced support.",
    features: ["Unlimited team members", "Custom contracts", "Dedicated manager"],
  },
];

export default function Subscriptions() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWithAuth(SUBSCRIPTIONS_URL);
        const json = await res.json();
        if (json.success) setSubscription(json.data);
      } catch (err) {
        console.error("Failed to load subscription:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const hasActiveSubscription = Boolean(subscription && ACTIVE_STATUSES.includes(subscription.status));

  async function handlePlanChange(plan: SubscriptionPlan) {
    setError("");
    setPendingPlan(plan);
    try {
      const endpoint = hasActiveSubscription ? "portal-session" : "checkout-session";
      const res = await fetchWithAuth(`${SUBSCRIPTIONS_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hasActiveSubscription ? {} : { plan }),
      });
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
        return;
      }
      setError(json.message || "Something went wrong. Please try again.");
    } catch (err) {
      console.error("Failed to start plan change:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setPendingPlan(null);
    }
  }

  return (
    <>
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Manage</span>
          <ChevronRight size={13} className="text-muted-foreground/40" />
          <span className="font-medium">Subscriptions</span>
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
          <Card className="shadow-none border">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-[14px] font-semibold">Plans</CardTitle>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {loading
                  ? "Loading your plan…"
                  : hasActiveSubscription
                    ? `You're on ${subscription!.plan[0].toUpperCase()}${subscription!.plan.slice(1)}. Plan changes are managed from the billing portal.`
                    : "You're not subscribed to a paid plan yet. Choose one below to get started."}
              </p>
            </CardHeader>
            <CardContent className="px-6 py-5">
              {error && <p className="mb-4 text-[12px] text-red-600">{error}</p>}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {plans.map((plan) => {
                  const isCurrent = hasActiveSubscription && subscription?.plan === plan.key;
                  const isPending = pendingPlan === plan.key;
                  return (
                    <div
                      key={plan.key}
                      className={`relative flex flex-col rounded-lg border p-4 ${
                        isCurrent
                          ? "border-brand-400 ring-1 ring-brand-400"
                          : "hover:border-muted-foreground/30 transition-colors"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-semibold">{plan.name}</p>
                        {isCurrent && (
                          <span className="text-[10px] font-medium bg-brand-400 text-primary-foreground px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xl font-semibold">${plan.price}</span>
                        <span className="text-[11px] text-muted-foreground">/month</span>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                        {plan.description}
                      </p>
                      <ul className="mt-3 mb-4 space-y-1.5 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                            <Check size={12} className="shrink-0 text-brand-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {isCurrent ? (
                        <Button size="sm" variant="secondary" disabled className="w-full">
                          Current plan
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant={hasActiveSubscription ? "outline" : "default"}
                          className="w-full"
                          disabled={loading || pendingPlan !== null}
                          onClick={() => handlePlanChange(plan.key)}
                        >
                          {isPending ? "Redirecting…" : hasActiveSubscription ? "Manage in portal" : "Subscribe"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                All plans include unlimited invoices and API access. Billed monthly.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
