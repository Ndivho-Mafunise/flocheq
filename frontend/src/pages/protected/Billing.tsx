import { Link } from "react-router-dom";

const billingItems = [
  { label: "Current plan", value: "Growth" },
  { label: "Billing cycle", value: "Monthly" },
  { label: "Next invoice", value: "May 30, 2026" },
  { label: "Payment method", value: "Visa ending in 4242" },
];

export default function Billing() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Billing
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Manage your billing and subscription
        </h1>
        <p className="mt-2 text-slate-600">
          Review your current plan, upcoming invoice, and payment method from
          one place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
          <div className="mt-6 space-y-4">
            {billingItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
              >
                <span className="text-sm text-slate-500">{item.label}</span>
                <span className="text-sm font-semibold text-slate-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Actions</h2>
          <div className="mt-6 space-y-3">
            <Link
              to="/subscriptions"
              className="block rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Change plan
            </Link>
            <Link
              to="/payment-methods"
              className="block rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-900"
            >
              Update payment method
            </Link>
            <Link
              to="/invoices"
              className="block rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-900"
            >
              View invoices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
