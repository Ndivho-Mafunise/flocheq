import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Zap, ChevronDown, Building2, Sparkles } from "lucide-react";

interface Plan {
  name: string;
  monthly: number;
  annual: number;
  description: string;
  features: string[];
  featured: boolean;
  cta: string;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: 19,
    annual: 15,
    description: "For solo founders launching their first paid product.",
    features: ["1 team member", "Up to 500 transactions / month", "Unlimited invoices", "Basic analytics", "Email support", "API access"],
    featured: false,
    cta: "Get started",
  },
  {
    name: "Growth",
    monthly: 79,
    annual: 63,
    description: "For growing teams that need billing, customer, and revenue visibility.",
    features: ["5 team members", "Unlimited transactions", "Advanced reporting", "Automated invoicing", "Revenue analytics dashboard", "Priority support", "Webhook integrations"],
    featured: true,
    cta: "Start growing",
    badge: "Most popular",
  },
  {
    name: "Scale",
    monthly: 249,
    annual: 199,
    description: "For high-volume SaaS businesses managing multiple billing workflows.",
    features: ["Unlimited team members", "Custom transaction volume", "Custom contracts", "Multi-currency payouts", "Dedicated success manager", "SLA support", "Custom integrations"],
    featured: false,
    cta: "Contact sales",
  },
];

const faqs = [
  { question: "Can I switch plans anytime?", answer: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated to your billing cycle." },
  { question: "Is there a free trial?", answer: "All plans include a 14-day free trial with full feature access. No credit card is required to get started." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit and debit cards, SEPA direct debit, bank transfers, and more — processed through our secure payment gateway." },
  { question: "Do you charge per transaction?", answer: "Flocheq's subscription pricing is flat-rate. Any per-transaction fees depend on your downstream payment provider configuration, not the Flocheq platform itself." },
  { question: "What happens when my trial ends?", answer: "You'll receive a reminder 3 days before your trial expires. If you don't add a payment method, your account is downgraded to a read-only view — no data is deleted." },
];

const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">

      {/* ─── HEADER ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 pt-24 pb-16 text-center"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(124,58,237,0.08) 0%, transparent 60%), #FAFAFA" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.55]" style={dotGrid} />
        <div className="relative max-w-3xl mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-600/10 border border-brand-600/20 px-4 py-2 rounded-full">
              <Sparkles size={12} className="text-brand-600" />
              No hidden fees. No surprise charges.
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#111111]">
            Simple pricing for<br />
            <span className="text-brand-600">every stage of growth</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#4B5563]">
            Pick a plan and start building. Upgrade or downgrade anytime.
          </p>
          <div className="mt-10 inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${!annual ? "bg-white text-[#111111] shadow-sm border border-[#E5E7EB]" : "text-[#6B7280] hover:text-[#374151]"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${annual ? "bg-white text-[#111111] shadow-sm border border-[#E5E7EB]" : "text-[#6B7280] hover:text-[#374151]"}`}
            >
              Annual
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-700">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── PLANS ────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 transition-all ${plan.featured ? "ring-1 ring-brand-600/30 shadow-lg" : "border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-sm"}`}
              style={plan.featured
                ? { background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.07) 0%, transparent 60%), #ffffff" }
                : { background: "#ffffff" }}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold text-white shadow">
                  <Zap size={11} className="fill-white" />
                  {plan.badge}
                </div>
              )}
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">{plan.name}</p>
              <div className="mb-2 flex items-end gap-2">
                <span className="text-5xl font-bold text-[#111111]">${annual ? plan.annual : plan.monthly}</span>
                <span className="pb-1.5 text-sm text-[#6B7280]">/month{annual ? ", billed annually" : ""}</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-[#4B5563]">{plan.description}</p>
              <Link
                to="/register"
                className={`group mb-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition ${plan.featured ? "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20" : "bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] hover:bg-[#E5E7EB]"}`}
              >
                {plan.cta}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <div className="border-t border-[#E5E7EB] pt-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">What's included</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/10 border border-brand-600/20">
                        <Check size={11} className="text-brand-600" />
                      </div>
                      <span className="text-[#374151]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-5 flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#E5E7EB] bg-white p-8 md:flex-row shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB]">
              <Building2 size={20} className="text-[#6B7280]" />
            </div>
            <div>
              <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">Enterprise</p>
              <h3 className="text-lg font-bold text-[#111111]">Need a custom solution?</h3>
              <p className="mt-1 text-sm text-[#4B5563]">Volume pricing, custom SLAs, dedicated infrastructure, and compliance packages.</p>
            </div>
          </div>
          <Link to="/register" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] px-6 py-3 text-sm font-semibold text-[#374151] transition hover:bg-[#E5E7EB]">
            Talk to sales <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-[#FAFAFA] px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-600">FAQ</p>
            <h2 className="text-3xl font-bold text-[#111111]">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-[#111111] transition hover:bg-[#F9FAFB]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={16} className={`shrink-0 text-[#9CA3AF] transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="border-t border-[#E5E7EB] px-6 pb-5 text-sm leading-relaxed text-[#4B5563]">
                    <div className="pt-4">{faq.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ───────────────────────────────────────────────── */}
      <section
        className="relative px-6 py-24 text-center overflow-hidden border-t border-[#E5E7EB]"
        style={{ background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(124,58,237,0.07) 0%, transparent 65%), #FAFAFA" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.5]" style={dotGrid} />
        <div className="relative max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111]">Start your free trial today</h2>
          <p className="mt-3 text-[#4B5563]">No setup fee. No credit card required. Full access for 14 days.</p>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 group">
            Get started free
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-4 text-sm text-[#9CA3AF]">No setup fee · Cancel anytime · Free 14-day trial</p>
        </div>
      </section>
    </div>
  );
}
