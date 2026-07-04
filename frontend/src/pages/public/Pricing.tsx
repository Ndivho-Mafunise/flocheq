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

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-ink">

      {/* ─── HEADER ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 pt-24 pb-16 text-center"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(224,192,132,0.16) 0%, transparent 60%), #FFFFFF" }}
      >
        <div className="relative max-w-3xl mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-ink border border-brand-400 px-4 py-2 rounded-full">
              <Sparkles size={12} className="text-brand-600" />
              No hidden fees. No surprise charges.
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight text-ink">
            Simple pricing for<br />
            <span className="text-brand-600">every stage of growth</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#57564F]">
            Pick a plan and start building. Upgrade or downgrade anytime.
          </p>
          <div className="mt-10 inline-flex items-center gap-1 rounded-full bg-[#F5F5F4] border border-[#E9E5DC] p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${!annual ? "bg-white text-ink border border-brand-400" : "text-[#6F6E69] hover:text-ink"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${annual ? "bg-white text-ink border border-brand-400" : "text-[#6F6E69] hover:text-ink"}`}
            >
              Annual
              <span className="rounded-full bg-brand-400/20 border border-brand-400/50 px-2 py-0.5 text-xs font-semibold text-brand-800">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── PLANS ────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-[#F5F5F4] border-y border-[#E9E5DC]">
        <div className="max-w-6xl mx-auto grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 transition-all ${plan.featured ? "border border-brand-400 bg-white" : "border border-[#E9E5DC] bg-white hover:border-brand-400/60"}`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-brand-400 px-4 py-1.5 text-xs font-bold text-ink">
                  <Zap size={11} className="fill-ink" />
                  {plan.badge}
                </div>
              )}
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">{plan.name}</p>
              <div className="mb-2 flex items-end gap-2">
                <span className="text-5xl font-light text-ink">${annual ? plan.annual : plan.monthly}</span>
                <span className="pb-1.5 text-sm text-[#6F6E69]">/month{annual ? ", billed annually" : ""}</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-[#57564F]">{plan.description}</p>
              <Link
                to="/register"
                className={`group mb-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition ${plan.featured ? "bg-brand-400 text-ink hover:bg-brand-500" : "border border-brand-400 text-ink hover:bg-brand-400"}`}
              >
                {plan.cta}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <div className="border-t border-[#E9E5DC] pt-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#A6A49C]">What's included</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-400/20 border border-brand-400/50">
                        <Check size={11} className="text-brand-700" />
                      </div>
                      <span className="text-[#3E3D38]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-5 flex flex-col items-center justify-between gap-6 border border-[#E9E5DC] bg-white p-8 md:flex-row">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 border border-brand-400/40">
              <Building2 size={20} className="text-brand-700" />
            </div>
            <div>
              <p className="mb-0.5 text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Enterprise</p>
              <h3 className="text-lg font-medium text-ink">Need a custom solution?</h3>
              <p className="mt-1 text-sm text-[#57564F]">Volume pricing, custom SLAs, dedicated infrastructure, and compliance packages.</p>
            </div>
          </div>
          <Link to="/register" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-400 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-brand-400">
            Talk to sales <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">FAQ</p>
            <h2 className="text-3xl font-light tracking-tight text-ink">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="overflow-hidden border border-[#E9E5DC] bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-ink transition hover:bg-brand-50"
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={16} className={`shrink-0 text-brand-600 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="border-t border-[#E9E5DC] px-6 pb-5 text-sm leading-relaxed text-[#57564F]">
                    <div className="pt-4">{faq.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="relative px-6 py-24 text-center overflow-hidden bg-ink">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 55% at 50% 100%, rgba(224,192,132,0.12) 0%, transparent 65%)" }}
        />
        <div className="relative max-w-xl mx-auto">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-400">Free trial</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">Start your free trial today</h2>
          <p className="mt-3 text-white/70">No setup fee. No credit card required. Full access for 14 days.</p>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-400 px-8 py-3.5 text-sm font-semibold text-ink transition hover:bg-brand-300 group">
            Get started free
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-4 text-sm text-white/50">No setup fee · Cancel anytime · Free 14-day trial</p>
        </div>
      </section>
    </div>
  );
}
