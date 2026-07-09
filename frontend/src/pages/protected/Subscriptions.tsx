import { ChevronRight, Bell, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: 19,
    description: "For solo builders getting payments live.",
    features: ["1 team member", "500 transactions / mo", "Email support"],
    action: "downgrade",
  },
  {
    name: "Growth",
    price: 79,
    description: "For teams scaling their customer base.",
    features: ["5 team members", "Unlimited transactions", "Priority support"],
    action: "current",
  },
  {
    name: "Scale",
    price: 249,
    description: "For larger operations needing advanced support.",
    features: ["Unlimited team members", "Custom contracts", "Dedicated manager"],
    action: "upgrade",
  },
] as const;

export default function Subscriptions() {
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
                You're on Growth. Plan changes take effect immediately and are
                prorated to your billing cycle.
              </p>
            </CardHeader>
            <CardContent className="px-6 py-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {plans.map((plan) => {
                  const isCurrent = plan.action === "current";
                  return (
                    <div
                      key={plan.name}
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
                        <span className="text-xl font-semibold">
                          ${plan.price}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          /month
                        </span>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                        {plan.description}
                      </p>
                      <ul className="mt-3 mb-4 space-y-1.5 flex-1">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-1.5 text-[12px] text-muted-foreground"
                          >
                            <Check size={12} className="shrink-0 text-brand-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {plan.action === "current" ? (
                        <Button size="sm" variant="secondary" disabled className="w-full">
                          Current plan
                        </Button>
                      ) : plan.action === "upgrade" ? (
                        <Button size="sm" className="w-full">
                          Upgrade
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full">
                          Downgrade
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                All plans include unlimited invoices and API access.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
