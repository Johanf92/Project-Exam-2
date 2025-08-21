import { Link } from "react-router-dom";

export function Navbar({ menuOpen, setMenuOpen }) {
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(199, 199, 199, 1)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-black">
            Holi<span className="text-yellow-500">daze</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-500 hover:text-black transition-colors"
            >
              Venues
            </Link>
            <Link
              to="/login"
              className="text-gray-500 hover:text-black transition-colors"
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-500 hover:text-black transition-colors"
            >
              Dashboard
            </Link>
          </div>

          <button
            className="w-7 h-5 relative cursor-pointer text-yellow-300 z-40 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open Menu"
          >
            &#9776;
          </button>
        </div>
      </div>
    </nav>
  );
}
