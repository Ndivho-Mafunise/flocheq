import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.18),_transparent_20%),linear-gradient(135deg,#020617,#111827_45%,#0f172a)]">
      {/* <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col md:flex-row">
        <Sidebar /> */}

        <main>
          <div >
            <Outlet />
          </div>
        </main>
      </div>
    // </div>
  );
}
