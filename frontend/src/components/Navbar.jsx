import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-900"
        >
          MyApp
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}