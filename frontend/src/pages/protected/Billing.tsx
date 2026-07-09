import { Link } from "react-router-dom";
import { ChevronRight, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CardBrandMark from "@/components/CardBrandMark";

export default function Billing() {
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
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-semibold">Growth</p>
                    <p className="text-[13px] text-muted-foreground">
                      <span className="font-semibold text-foreground">$79</span>
                      /month
                    </p>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    Renews on Aug 1, 2026 · Billed monthly
                  </p>
                </div>
                <Button asChild size="sm" className="shrink-0">
                  <Link to="/subscriptions">Change plan</Link>
                </Button>
              </div>

              {/* Billing period progress */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                  <span>Current period · Jul 1 – Aug 1</span>
                  <span>22 days left</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[29%] rounded-full bg-brand-400" />
                </div>
              </div>
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
