import { useState } from "react";
import { ChevronRight, Bell, User, Lock, BellRing, Building2, Trash2 } from "lucide-react";
import { Button }           from "@/components/ui/button";
import { Input }            from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator }        from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore }     from "../../store/authStore";

const tabs = [
  { id: "profile",       label: "Profile",       icon: User       },
  { id: "security",      label: "Security",       icon: Lock       },
  { id: "notifications", label: "Notifications",  icon: BellRing   },
  { id: "organization",  label: "Organization",   icon: Building2  },
];

function Field({ label, hint, children }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[180px,1fr] sm:items-start sm:gap-4">
      <div className="pt-1.5">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${checked ? "bg-indigo-600" : "bg-input"}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

function ProfileTab({ user }) {
  const [name,  setName]  = useState(user?.name  || "");
  const [email, setEmail] = useState(user?.email || "");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-14 h-14">
          <AvatarFallback className="text-[16px] font-bold bg-indigo-100 text-indigo-700">
            {(name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[13px] font-medium">{name || "Your name"}</p>
          <p className="text-[12px] text-muted-foreground">{email || "your@email.com"}</p>
          <button className="mt-1.5 text-[12px] text-indigo-600 hover:underline">Change avatar</button>
        </div>
      </div>

      <Separator />

      <div className="space-y-5">
        <Field label="Full name" hint="Shown across the dashboard and invoices.">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jamie Dlamini" />
        </Field>
        <Field label="Email address" hint="Used for login and billing notifications.">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>
        <Field label="Job title">
          <Input placeholder="e.g. Head of Growth" />
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" className="text-[13px] h-8">Cancel</Button>
        <Button size="sm" className="text-[13px] h-8 bg-indigo-600 hover:bg-indigo-700">Save changes</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <Field label="Current password">
          <Input type="password" placeholder="••••••••" />
        </Field>
        <Field label="New password" hint="At least 8 characters.">
          <Input type="password" placeholder="••••••••" />
        </Field>
        <Field label="Confirm new password">
          <Input type="password" placeholder="••••••••" />
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button size="sm" className="text-[13px] h-8 bg-indigo-600 hover:bg-indigo-700">Update password</Button>
      </div>

      <Separator />

      <div>
        <p className="text-[13px] font-medium mb-0.5">Two-factor authentication</p>
        <p className="text-[12px] text-muted-foreground mb-3">Add a second layer of security to your account.</p>
        <Button variant="outline" size="sm" className="text-[13px] h-8">Enable 2FA</Button>
      </div>

      <Separator />

      <div>
        <p className="text-[13px] font-medium mb-2">Active sessions</p>
        {[
          { device: "Chrome on macOS", location: "Cape Town, ZA", current: true },
          { device: "Safari on iPhone", location: "Johannesburg, ZA", current: false },
        ].map((s) => (
          <div key={s.device} className="flex items-center justify-between py-2.5 border-b last:border-0">
            <div>
              <p className="text-[13px] font-medium">{s.device}</p>
              <p className="text-[11px] text-muted-foreground">{s.location}</p>
            </div>
            {s.current
              ? <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Current</span>
              : <button className="text-[12px] text-rose-500 hover:underline">Revoke</button>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    invoiceSent:   true,
    paymentFailed: true,
    newCustomer:   false,
    weeklyDigest:  true,
    teamUpdates:   false,
  });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const rows = [
    { key: "invoiceSent",   label: "Invoice sent",     desc: "When an invoice is delivered to a customer."     },
    { key: "paymentFailed", label: "Payment failed",   desc: "When a charge attempt fails."                    },
    { key: "newCustomer",   label: "New customer",     desc: "When someone signs up for the first time."       },
    { key: "weeklyDigest",  label: "Weekly digest",    desc: "A summary of your key metrics every Monday."     },
    { key: "teamUpdates",   label: "Team activity",    desc: "When teammates make changes to shared resources." },
  ];

  return (
    <div className="space-y-1">
      {rows.map((row, i) => (
        <div key={row.key}>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[13px] font-medium">{row.label}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{row.desc}</p>
            </div>
            <Toggle checked={prefs[row.key]} onChange={() => toggle(row.key)} />
          </div>
          {i < rows.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}

function OrganizationTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <Field label="Company name">
          <Input placeholder="Acme Corp." />
        </Field>
        <Field label="Billing email" hint="Invoices and receipts go here.">
          <Input type="email" placeholder="billing@company.com" />
        </Field>
        <Field label="Tax / VAT number">
          <Input placeholder="e.g. 4380281234" />
        </Field>
        <Field label="Country">
          <Input placeholder="South Africa" />
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" className="text-[13px] h-8">Cancel</Button>
        <Button size="sm" className="text-[13px] h-8 bg-indigo-600 hover:bg-indigo-700">Save changes</Button>
      </div>

      <Separator />

      <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4">
        <div className="flex items-start gap-3">
          <Trash2 size={16} className="text-rose-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-[13px] font-medium text-rose-700">Delete organization</p>
            <p className="text-[12px] text-rose-600/80 mt-0.5">
              Permanently remove this workspace and all its data. This cannot be undone.
            </p>
          </div>
          <Button variant="outline" size="sm" className="text-[12px] h-7 border-rose-300 text-rose-600 hover:bg-rose-100 hover:text-rose-700 shrink-0">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const tabContent = {
    profile:       <ProfileTab user={user} />,
    security:      <SecurityTab />,
    notifications: <NotificationsTab />,
    organization:  <OrganizationTab />,
  };

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Account</span>
          <ChevronRight size={13} className="text-muted-foreground/40" />
          <span className="font-medium">Settings</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-foreground">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-5 bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* Tab bar */}
          <div className="flex gap-1 border-b bg-background rounded-t-lg px-2 pt-2 -mb-px">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[13px] rounded-t-md border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-indigo-600 text-indigo-600 font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <Card className="shadow-none border rounded-t-none">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-[14px] font-semibold">
                {tabs.find((t) => t.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-5">
              {tabContent[activeTab]}
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  );
}
