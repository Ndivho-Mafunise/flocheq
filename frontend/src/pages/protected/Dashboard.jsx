import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
   await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Welcome back, {user?.name || "User"}
          </p>
        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Total Revenue</p>

          <h2 className="text-3xl font-bold mt-2">$24,500</h2>

          <p className="text-green-600 text-sm mt-2">
            +12% this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Active Customers</p>

          <h2 className="text-3xl font-bold mt-2">1,248</h2>

          <p className="text-indigo-600 text-sm mt-2">
            +84 new users
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Transactions</p>

          <h2 className="text-3xl font-bold mt-2">8,932</h2>

          <p className="text-slate-500 text-sm mt-2">
            Updated just now
          </p>
        </div>
      </div>

      {/* RECENT PAYMENTS */}
      <section className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Recent Payments
          </h2>

          <button className="text-indigo-600 text-sm hover:underline">
            View all
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              <tr className="border-b border-slate-100">
                <td className="py-4">John Doe</td>
                <td>$120.00</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    Paid
                  </span>
                </td>
                <td>Today</td>
              </tr>

              <tr className="border-b border-slate-100">
                <td className="py-4">Sarah Lee</td>
                <td>$89.00</td>
                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </td>
                <td>Yesterday</td>
              </tr>

              <tr>
                <td className="py-4">Michael Smith</td>
                <td>$450.00</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    Paid
                  </span>
                </td>
                <td>2 days ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}