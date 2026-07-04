const methods = [
  { type: "Visa", label: "Ending in 4242", default: true },
  { type: "Mastercard", label: "Ending in 1234", default: false },
];

export default function PaymentMethods() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          Payment methods
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Saved payment methods
        </h1>
        <p className="mt-2 text-slate-600">
          Add or update cards to keep your billing details current and your
          invoices flowing.
        </p>
      </div>

      <div className="space-y-4">
        {methods.map((method) => (
          <div
            key={method.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {method.type}
                </p>
                <p className="text-sm text-slate-500">{method.label}</p>
              </div>
              <div className="flex items-center gap-3">
                {method.default && (
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
                    Default
                  </span>
                )}
                <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}

        <button className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-700">
          + Add payment method
        </button>
      </div>
    </div>
  );
}
