import { Link } from "react-router-dom";
import Logo from "./Logo";

const footerLinks = {
  Product: [
    { label: "Features", to: "/#features" },
    { label: "Pricing", to: "/pricing" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Integrations", to: "#" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Blog", to: "#" },
    { label: "Careers", to: "#" },
    { label: "Contact", to: "#" },
  ],
  Legal: [
    { label: "Privacy", to: "#" },
    { label: "Terms", to: "#" },
    { label: "Security", to: "#" },
    { label: "Cookies", to: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-400 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <Logo variant="gold" />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-ink/80">
              The payment infrastructure built for SaaS teams who move fast. Collect revenue, track insights, and scale globally.
            </p>
            <p className="mt-6 text-xs text-ink/60">
              © {new Date().getFullYear()} Flocheq. All rights reserved.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-ink font-semibold text-xs uppercase tracking-[0.2em] mb-5">{group}</h4>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-ink/70 hover:text-ink transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-ink/15 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink/60">Built for founders who mean business.</p>
          <div className="flex items-center gap-6 text-xs">
            <Link to="#" className="text-ink/60 hover:text-ink transition">Privacy</Link>
            <Link to="#" className="text-ink/60 hover:text-ink transition">Terms</Link>
            <Link to="#" className="text-ink/60 hover:text-ink transition">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
