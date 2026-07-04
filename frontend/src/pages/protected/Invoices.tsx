const invoices = [
  { id: "INV-1024", date: "May 01, 2026", amount: "$79.00", status: "Paid" },
  { id: "INV-1023", date: "Apr 01, 2026", amount: "$79.00", status: "Paid" },
  { id: "INV-1022", date: "Mar 01, 2026", amount: "$79.00", status: "Pending" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
};

export default function Invoices() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          Invoices
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Invoice history
        </h1>
        <p className="mt-2 text-slate-600">
          Track every payment, download receipts, and keep an eye on outstanding
          balances.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500">
                  Invoice
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500">
                  Date
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-slate-100">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[invoice.status]}`}
                    >
                      {invoice.status}
                    </span>
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
