const customers = [
  {
    name: "Ava Thompson",
    company: "Northstar Labs",
    plan: "Growth",
    value: "$2,400",
  },
  {
    name: "Leo Martinez",
    company: "Kinetic Studio",
    plan: "Starter",
    value: "$960",
  },
  { name: "Mia Chen", company: "Pine & Co.", plan: "Scale", value: "$5,800" },
];

export default function Customers() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Customers
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Customer overview
        </h1>
        <p className="mt-2 text-slate-600">
          Review your top customers, plan assignments, and customer lifetime
          value at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {customers.map((customer) => (
          <div
            key={customer.name}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-lg font-semibold text-slate-900">
              {customer.name}
            </p>
            <p className="mt-1 text-sm text-slate-500">{customer.company}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {customer.plan}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {customer.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
