import { ChevronRight, Bell, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CardBrandMark from "@/components/CardBrandMark";

const methods = [
  {
    brand: "visa",
    label: "Visa ·· 4242",
    expires: "08/27",
    default: true,
  },
  {
    brand: "mastercard",
    label: "Mastercard ·· 1234",
    expires: "11/26",
    default: false,
  },
] as const;

export default function PaymentMethods() {
  return (
    <>
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Manage</span>
          <ChevronRight size={13} className="text-muted-foreground/40" />
          <span className="font-medium">Payment methods</span>
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
              <CardTitle className="text-[14px] font-semibold">
                Saved cards
              </CardTitle>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Your default card is charged automatically for subscription
                invoices.
              </p>
            </CardHeader>
            <CardContent className="px-6 py-2">
              {methods.map((method, i) => (
                <div key={method.label}>
                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <CardBrandMark brand={method.brand} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-medium">
                            {method.label}
                          </p>
                          {method.default && (
                            <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-muted-foreground">
                          Expires {method.expires}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!method.default && (
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          Set as default
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  {i < methods.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full h-10 border-dashed text-[13px] text-muted-foreground hover:text-foreground"
          >
            <Plus size={14} />
            Add payment method
          </Button>
        </div>
      </main>
    </>
  );
}
