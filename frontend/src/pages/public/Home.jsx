import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast integration",
    description: "Plug into your app in minutes with simple, well-documented APIs.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    description: "Built-in encryption and fraud protection for every transaction.",
  },
  {
    icon: Globe,
    title: "Global scale",
    description: "Accept payments from users anywhere in the world, in any currency.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-24 md:py-36">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-100 blur-3xl opacity-50 rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-6">
            Payments infrastructure
          </span>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-slate-900">
            Collect payments.{" "}
            <span className="text-indigo-600">Grow faster.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Build, scale, and manage payments with a clean developer-first
            platform. Fast integration, secure by default, global ready.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
            >
              Get started free
            </Link>
            <Link
              to="/pricing"
              className="border border-slate-200 bg-white text-slate-700 px-6 py-3 rounded-full text-sm font-medium hover:border-slate-300 hover:bg-slate-50 transition"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-3">
            Why Flocheq
          </p>
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">
            Everything you need to get paid
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="px-6 py-24 text-center bg-white">
        <h2 className="text-3xl font-bold text-slate-900">
          Start building with Flocheq today
        </h2>
        <p className="text-slate-500 mt-3 text-sm">
          No setup fees. No hidden complexity. Just build.
        </p>
        <Link
          to="/register"
          className="mt-8 inline-block bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition"
        >
          Create free account
        </Link>
      </section>
    </div>
  );
}
