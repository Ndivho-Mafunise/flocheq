import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden px-8 py-24 md:py-32">
        {/* background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-200 blur-3xl opacity-40 rounded-full"></div>
          <div className="absolute bottom-[-120px] right-1/3 w-[500px] h-[500px] bg-pink-200 blur-3xl opacity-30 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Payments infrastructure
            <span className="text-indigo-600"> for modern apps</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Build, scale, and manage payments with a clean developer-first
            platform. Fast integration, secure by default, global ready.
          </p>

          <div className="mt-10 flex gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition">
              Get started
            </button>

            <button className="border border-slate-300 px-6 py-3 rounded-full hover:border-slate-400 transition">
              View docs
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className=" bg-amber-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-lg">Fast integration</h3>
            <p className="text-slate-600 mt-2 text-sm">
              Plug into your app in minutes with simple APIs.
            </p>
          </div>

          <div className=" bg-amber-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-lg">Secure payments</h3>
            <p className="text-slate-600 mt-2 text-sm">
              Built-in protection and encryption for all transactions.
            </p>
          </div>

          <div className=" bg-amber-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-lg">Global scale</h3>
            <p className="text-slate-600 mt-2 text-sm">
              Accept payments from users anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="px-8 py-24 text-center">
        <h2 className="text-3xl font-bold">Start building with PayLa today</h2>

        <p className="text-slate-600 mt-3">
          No setup fees. No hidden complexity. Just build.
        </p>

        <button className="mt-8 bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition">
         <Link to="/register">
          Create account
         </Link>
        </button>
      </section>
    </div>
  );
}
