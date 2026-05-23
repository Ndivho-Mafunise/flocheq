const transactions = [
  { customer: "John Doe", amount: "$120.00", status: "Paid", date: "Today" },
  {
    customer: "Sarah Lee",
    amount: "$89.00",
    status: "Pending",
    date: "Yesterday",
  },
  {
    customer: "Michael Smith",
    amount: "$450.00",
    status: "Paid",
    date: "2 days ago",
  },
];

const statusStyles = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
};

export default function Payments() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Payments
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Payment activity
        </h1>
        <p className="mt-2 text-slate-600">
          Review recent charges, payment status, and the latest customer
          activity in your workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Processed this month</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">$24,500</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Successful payments</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">1,248</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending payouts</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">$1,240</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={`${transaction.customer}-${transaction.date}`}
                  className="border-t border-slate-100"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {transaction.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[transaction.status]}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {transaction.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
