import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Features", to: "/#features" },
    { label: "Pricing", to: "/pricing" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Integrations", to: "#" },
  ],
  Company: [
    { label: "About", to: "#" },
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
    <footer className="bg-[#FAFAFA] border-t border-[#E5E7EB] px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/">
              <img
                src="/flocheq-logo-v2.png"
                alt="Flocheq"
                className="h-8 w-auto brightness-0 opacity-70 mb-6"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-[#6B7280]">
              The payment infrastructure built for SaaS teams who move fast. Collect revenue, track insights, and scale globally.
            </p>
            <p className="mt-6 text-xs text-[#9CA3AF]">
              © {new Date().getFullYear()} Flocheq. All rights reserved.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[#111111] font-semibold text-sm mb-5">{group}</h4>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-[#9CA3AF] hover:text-[#374151] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9CA3AF]">Built for founders who mean business.</p>
          <div className="flex items-center gap-6 text-xs">
            <Link to="#" className="text-[#9CA3AF] hover:text-[#6B7280] transition">Privacy</Link>
            <Link to="#" className="text-[#9CA3AF] hover:text-[#6B7280] transition">Terms</Link>
            <Link to="#" className="text-[#9CA3AF] hover:text-[#6B7280] transition">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
