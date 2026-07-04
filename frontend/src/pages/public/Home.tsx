import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap, ShieldCheck, Globe, BarChart3, FileText,
  Headphones, ArrowRight, Check, TrendingUp, Users,
  ChevronRight, Star, Sparkles, CreditCard,
} from "lucide-react";

const stats = [
  { value: "10,000+", label: "Businesses powered" },
  { value: "$2B+", label: "Payments processed" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "180+", label: "Countries supported" },
];

const featureTabs = [
  {
    id: "collect",
    label: "Collect payments",
    icon: CreditCard,
    headline: "Payment collection that just works",
    body: "Accept every payment type, in any currency, from any device. Built for developers, loved by finance teams.",
    items: [
      { icon: Zap, title: "Instant setup", desc: "Live in minutes with documented SDKs for every major language." },
      { icon: ShieldCheck, title: "Secure by default", desc: "PCI DSS Level 1 certified and SOC 2 Type II compliant." },
      { icon: FileText, title: "Smart invoicing", desc: "Auto-generate, send, and follow up on invoices automatically." },
    ],
    metrics: [
      { label: "Setup time", value: "< 5 min" },
      { label: "Uptime SLA", value: "99.9%" },
      { label: "Currencies", value: "135+" },
    ],
  },
  {
    id: "analyze",
    label: "Analyze revenue",
    icon: BarChart3,
    headline: "Revenue clarity at every level",
    body: "Real-time analytics to track MRR, spot churn early, and measure LTV — without writing a single line of SQL.",
    items: [
      { icon: TrendingUp, title: "Live MRR tracking", desc: "See every dollar as it moves — no end-of-day batch reports." },
      { icon: BarChart3, title: "Churn prediction", desc: "AI-flagged at-risk customers before they cancel." },
      { icon: Users, title: "Customer LTV", desc: "Lifetime value segmented by plan, country, or acquisition source." },
    ],
    metrics: [
      { label: "MRR growth avg", value: "+24%" },
      { label: "Churn detected", value: "3× earlier" },
      { label: "Reporting lag", value: "0 sec" },
    ],
  },
  {
    id: "scale",
    label: "Scale globally",
    icon: Globe,
    headline: "Infrastructure built to scale",
    body: "From your first sale to millions in ARR — Flocheq handles compliance, routing, and support so you don't have to.",
    items: [
      { icon: Globe, title: "135+ currencies", desc: "Smart routing optimises conversion rates across every market." },
      { icon: ShieldCheck, title: "Global compliance", desc: "VAT, GST, and local tax rules handled automatically." },
      { icon: Headphones, title: "24/7 expert support", desc: "A dedicated success team — not just a ticket queue." },
    ],
    metrics: [
      { label: "Countries", value: "180+" },
      { label: "Avg onboarding", value: "5 min" },
      { label: "Support response", value: "< 2 hrs" },
    ],
  },
];

const testimonials = [
  {
    quote: "Flocheq cut our billing setup time from weeks to a single afternoon. The API docs are exceptional.",
    author: "Sarah K.",
    role: "CTO, Launchpad SaaS",
  },
  {
    quote: "We went from zero to accepting payments in 25 countries within days. No other platform comes close.",
    author: "Marcus O.",
    role: "Founder, Trackify",
  },
  {
    quote: "The revenue analytics alone paid for itself. We spotted churn patterns we'd been missing for months.",
    author: "Priya M.",
    role: "Head of Growth, Buildify",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-white text-ink">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 55% at 80% 0%, rgba(224,192,132,0.14) 0%, transparent 60%)" }}
        />

        <div className="max-w-7xl mx-auto relative grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-8 flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-ink border border-brand-400 px-4 py-2 rounded-full">
                <Sparkles size={12} className="text-brand-600" />
                Smart invoicing · Now with auto-reminders
                <ChevronRight size={12} className="text-brand-600" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light tracking-tight leading-[1.04] text-ink">
              The financial OS<br />
              for{" "}
              <span className="text-brand-600">modern SaaS</span>
            </h1>

            <p className="mt-6 text-lg text-[#57564F] max-w-lg leading-relaxed mx-auto lg:mx-0">
              Build, scale, and manage your entire payment infrastructure from one clean dashboard. Fast to integrate, secure by default, built to grow.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-brand-500 group"
              >
                Start for free
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-brand-400 px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-brand-400"
              >
                View pricing
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#6F6E69] justify-center lg:justify-start">
              {["No credit card required", "Free 14-day trial", "Cancel anytime"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={14} className="shrink-0 text-brand-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative overflow-hidden rounded-none ring-1 ring-brand-400/40 aspect-[4/5]">
              <img
                src="/pexels-yankrukov-7691704.jpg"
                alt="Team reviewing business analytics"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-5 -left-8 min-w-[180px] border border-brand-400/60 bg-white/95 backdrop-blur-sm p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
                  <TrendingUp size={16} className="text-brand-700" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#A6A49C]">Monthly revenue</p>
                  <p className="text-sm font-bold text-ink">+24.5% MRR</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-5 -right-6 min-w-[160px] border border-brand-400/60 bg-white/95 backdrop-blur-sm p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
                  <Users size={16} className="text-brand-700" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#A6A49C]">Active users</p>
                  <p className="text-sm font-bold text-ink">2,847</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────────────── */}
      <section className="bg-ink px-6 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {stats.map(({ value, label }, i) => (
            <div key={label} className={`text-center py-2 ${i === 0 ? "pr-6" : "px-6"}`}>
              <p className="text-3xl font-light text-brand-400 md:text-4xl">{value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
              Platform capabilities
            </p>
            <h2 className="text-4xl font-light tracking-tight text-ink">
              Everything you need to collect and grow revenue
            </h2>
            <p className="mt-4 text-[#57564F] leading-relaxed">
              From the first payment to enterprise scale — one platform handles it all.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {featureTabs.map((tab, i) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(i)}
                  className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === i
                      ? "bg-brand-400 text-ink border border-brand-400"
                      : "text-[#6F6E69] border border-[#E9E5DC] hover:border-brand-400 hover:text-ink"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {featureTabs.map((tab, i) => (
            <div key={tab.id} className={`transition-all duration-300 ${activeTab === i ? "block" : "hidden"}`}>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight text-ink mb-4">{tab.headline}</h3>
                  <p className="text-[#57564F] leading-relaxed mb-8">{tab.body}</p>
                  <div className="space-y-5">
                    {tab.items.map(({ icon: Icon, title, desc }) => (
                      <div key={title} className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 border border-brand-400/40">
                          <Icon size={18} className="text-brand-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink mb-1">{title}</p>
                          <p className="text-sm text-[#6F6E69] leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/register" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 group">
                    Get started
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {tab.metrics.map(({ label, value }) => (
                    <div key={label} className="border border-[#E9E5DC] bg-white p-5 flex flex-col gap-2">
                      <p className="text-2xl font-light text-ink">{value}</p>
                      <p className="text-xs uppercase tracking-[0.12em] text-[#6F6E69] leading-snug">{label}</p>
                    </div>
                  ))}
                  <div className="col-span-3 border border-brand-400/50 bg-brand-50 p-6 relative overflow-hidden">
                    <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-brand-700 mb-3">{tab.label}</p>
                    <p className="relative text-sm text-[#57564F] leading-relaxed max-w-sm">{tab.body}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SPLIT — Trust ────────────────────────────────────────────── */}
      <section className="bg-[#F5F5F4] border-y border-[#E9E5DC] px-6 py-24">
        <div className="max-w-7xl mx-auto grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <div className="relative max-w-md overflow-hidden ring-1 ring-brand-400/40 aspect-[4/5]">
              <img src="/pexels-kevin-malik-9017746.jpg" alt="Business partnership and trust" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Built on trust</p>
            <h2 className="text-4xl font-light tracking-tight leading-tight text-ink">A platform your customers can count on</h2>
            <p className="mt-5 text-[#57564F] leading-relaxed">
              Every transaction is protected by industry-leading security standards. We handle compliance, fraud detection, and uptime — so you can focus on building your product.
            </p>
            <ul className="mt-8 space-y-4">
              {["PCI DSS Level 1 certified", "SOC 2 Type II compliant", "256-bit AES encryption at rest", "Real-time fraud monitoring"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#3E3D38]">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-400/20 border border-brand-400/50">
                    <Check size={11} className="text-brand-700" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="group mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
              Learn about our security
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SPLIT — Financial clarity ────────────────────────────────── */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto grid items-center gap-16 lg:grid-cols-2">
          <div className="lg:order-1">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Full transparency</p>
            <h2 className="text-4xl font-light tracking-tight leading-tight text-ink">Clarity in every single transaction</h2>
            <p className="mt-5 text-[#57564F] leading-relaxed">
              No black boxes. No surprise fees. Every payment, every invoice, every payout — visible, searchable, and exportable in real time.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { stat: "< 200ms", label: "Average API response" },
                { stat: "0 hidden fees", label: "Transparent pricing" },
                { stat: "Real-time", label: "Webhook events" },
                { stat: "5-min", label: "Average onboarding" },
              ].map(({ stat, label }) => (
                <div key={label} className="border border-[#E9E5DC] bg-white p-4">
                  <p className="text-lg font-medium text-ink">{stat}</p>
                  <p className="mt-0.5 text-xs text-[#6F6E69]">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative lg:order-2">
            <div className="relative ml-auto max-w-md overflow-hidden ring-1 ring-brand-400/40 aspect-[4/5]">
              <img src="/pexels-gabby-k-7412096.jpg" alt="Financial transparency and analysis" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="bg-[#F5F5F4] border-y border-[#E9E5DC] px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Customer stories</p>
            <h2 className="text-3xl font-light tracking-tight text-ink">Loved by teams worldwide</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map(({ quote, author, role }) => (
              <div key={author} className="border border-[#E9E5DC] bg-white p-8 hover:border-brand-400 transition-colors">
                <div className="mb-5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-brand-400 text-brand-400" />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-[#3E3D38]">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 border border-brand-400/50 text-xs font-bold text-brand-800">
                    {author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{author}</p>
                    <p className="text-xs text-[#A6A49C]">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="relative px-6 py-28 overflow-hidden bg-ink">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 55% at 50% 100%, rgba(224,192,132,0.12) 0%, transparent 65%)" }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-400">Get started</p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-tight text-white">Ready to simplify your payments?</h2>
          <p className="mt-4 text-lg text-white/70">Join thousands of SaaS teams already using Flocheq to get paid faster.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-brand-300 group">
              Create free account
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/pricing" className="inline-flex items-center gap-2 rounded-full border border-brand-400 px-7 py-3.5 text-sm font-semibold text-brand-400 transition hover:bg-brand-400 hover:text-ink">
              See pricing
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/50">No setup fee · Cancel anytime · Free 14-day trial</p>
        </div>
      </section>
    </div>
  );
}
