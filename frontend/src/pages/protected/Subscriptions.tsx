const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "For solo builders getting payments live.",
    current: false,
  },
  {
    name: "Growth",
    price: "$79",
    description: "For teams scaling their customer base.",
    current: true,
  },
  {
    name: "Scale",
    price: "$249",
    description: "For larger operations needing advanced support.",
    current: false,
  },
];

export default function Subscriptions() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          Subscriptions
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Choose your plan
        </h1>
        <p className="mt-2 text-slate-600">
          Compare your current subscription with the available plans and switch
          when you’re ready.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
              {plan.name}
            </p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {plan.price}
              </span>
              <span className="text-sm text-slate-500">/month</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{plan.description}</p>
            <button
              className={`mt-6 w-full rounded-full px-4 py-3 text-sm font-semibold ${
                plan.current
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 text-white"
              }`}
            >
              {plan.current ? "Current plan" : "Select plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
