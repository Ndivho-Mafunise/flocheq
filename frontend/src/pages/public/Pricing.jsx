import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "For solo founders launching their first paid product.",
    features: ["1 team member", "Unlimited invoices", "Basic analytics", "Email support"],
    featured: false,
  },
  {
    name: "Growth",
    price: "$79",
    description: "For growing teams that need billing, customer, and revenue visibility.",
    features: ["5 team members", "Advanced reporting", "Automated invoicing", "Priority support"],
    featured: true,
  },
  {
    name: "Scale",
    price: "$249",
    description: "For high-volume SaaS businesses managing multiple billing workflows.",
    features: ["Unlimited team members", "Custom contracts", "Dedicated success manager", "SLA support"],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
      
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Pricing</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Simple pricing for every stage of your SaaS growth.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Choose a plan that matches your customer base today and upgrade when you need more visibility, automation, and control.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-6 shadow-sm ${
                plan.featured
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                {plan.name}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`${plan.featured ? "text-indigo-100" : "text-slate-500"}`}>
                  /month
                </span>
              </div>
              <p className={`mt-4 text-sm ${plan.featured ? "text-indigo-100" : "text-slate-600"}`}>
                {plan.description}
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-white text-indigo-600 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Start {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
