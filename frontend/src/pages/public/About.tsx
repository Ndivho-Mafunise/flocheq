import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const principles = [
  {
    title: "Clarity over cleverness",
    body: "Financial software should explain itself. Every number in Flocheq can be traced back to the transaction it came from — no black boxes, no surprise fees.",
  },
  {
    title: "Built for the long run",
    body: "Payments infrastructure is a promise. We optimise for reliability and boring predictability, because your revenue should never be the exciting part of your stack.",
  },
  {
    title: "Small teams, big leverage",
    body: "We design every workflow so a two-person startup gets the same financial visibility as a hundred-person finance department.",
  },
];

const milestones = [
  { year: "2023", event: "Flocheq founded to fix billing for SaaS founders" },
  { year: "2024", event: "First $100M in payments processed across 40 countries" },
  { year: "2025", event: "Revenue analytics and churn prediction launched" },
  { year: "2026", event: "10,000+ businesses, 180+ countries, one platform" },
];

const values = [
  "Transparent pricing, always",
  "Security before features",
  "Support from humans, not queues",
  "Documentation as a product",
];

export default function About() {
  return (
    <div className="min-h-screen bg-white text-ink">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 pt-24 pb-20"
        style={{ background: "radial-gradient(ellipse 70% 55% at 20% 0%, rgba(224,192,132,0.14) 0%, transparent 60%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            About Flocheq
          </p>
          <h1 className="max-w-3xl text-5xl md:text-6xl font-light tracking-tight leading-[1.05] text-ink">
            Financial software,<br />
            built the <span className="text-brand-600">honest way</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#57564F] leading-relaxed">
            Flocheq exists so founders can see exactly where their money comes from, where it goes, and what to do next — without hiring a finance team to find out.
          </p>
        </div>
      </section>

      {/* ─── STORY ────────────────────────────────────────────────────── */}
      <section className="bg-[#F5F5F4] border-y border-[#E9E5DC] px-6 py-24">
        <div className="max-w-7xl mx-auto grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <div className="relative max-w-md overflow-hidden ring-1 ring-brand-400/40 aspect-[4/5]">
              <img src="/pexels-kevin-malik-9017746.jpg" alt="The team behind Flocheq" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Our story</p>
            <h2 className="text-4xl font-light tracking-tight leading-tight text-ink">
              Started by founders who were tired of guessing
            </h2>
            <p className="mt-5 text-[#57564F] leading-relaxed">
              Flocheq began when our founding team ran their own SaaS and realised the hardest part wasn't building the product — it was understanding the revenue. Spreadsheets, payment-provider exports, and month-end surprises were the norm.
            </p>
            <p className="mt-4 text-[#57564F] leading-relaxed">
              So we built the platform we wished we'd had: payments, billing, invoicing, and revenue analytics in one place, designed to be understood at a glance.
            </p>
            <ul className="mt-8 space-y-4">
              {values.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#3E3D38]">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-400/20 border border-brand-400/50">
                    <Check size={11} className="text-brand-700" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── PRINCIPLES — dark band ───────────────────────────────────── */}
      <section className="bg-ink px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-400">What we believe</p>
            <h2 className="text-4xl font-light tracking-tight text-white">
              Three principles behind everything we ship
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {principles.map(({ title, body }, i) => (
              <div key={title} className="border-t border-brand-400/40 pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-400">
                  0{i + 1}
                </p>
                <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MILESTONES ───────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Milestones</p>
            <h2 className="text-3xl font-light tracking-tight text-ink">From a side project to global infrastructure</h2>
          </div>
          <div className="space-y-0">
            {milestones.map(({ year, event }) => (
              <div key={year} className="flex items-baseline gap-8 border-b border-[#E9E5DC] py-6 first:border-t">
                <span className="w-16 shrink-0 text-2xl font-light text-brand-600">{year}</span>
                <span className="text-[#3E3D38]">{event}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-24 text-center overflow-hidden bg-ink">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 55% at 50% 100%, rgba(224,192,132,0.12) 0%, transparent 65%)" }}
        />
        <div className="relative max-w-xl mx-auto">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-400">Join us</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">Build your business on clarity</h2>
          <p className="mt-3 text-white/70">Start free, see every transaction, and never guess about revenue again.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-brand-300 group">
              Start for free
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/pricing" className="inline-flex items-center gap-2 rounded-full border border-brand-400 px-7 py-3.5 text-sm font-semibold text-brand-400 transition hover:bg-brand-400 hover:text-ink">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
