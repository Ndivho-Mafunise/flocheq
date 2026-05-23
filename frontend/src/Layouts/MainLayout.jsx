import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.18),_transparent_20%),linear-gradient(135deg,#020617,#111827_45%,#0f172a)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 xl:p-8">
          <div className="flex h-full min-h-[calc(100vh-2rem)] flex-col rounded-[30px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}