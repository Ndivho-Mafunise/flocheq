const settingsSections = [
  {
    title: "Organization",
    description: "Update your company details and billing contact.",
    action: "Edit organization",
  },
  {
    title: "Security",
    description:
      "Manage password, two-factor authentication, and session activity.",
    action: "View security",
  },
  {
    title: "Notifications",
    description: "Control invoice alerts, payment reminders, and team updates.",
    action: "Manage notifications",
  },
];

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Account settings
        </h1>
        <p className="mt-2 text-slate-600">
          Keep your workspace, notifications, and security preferences aligned
          with your team.
        </p>
      </div>

      <div className="grid gap-4">
        {settingsSections.map((section) => (
          <div
            key={section.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {section.description}
                </p>
              </div>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900">
                {section.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
