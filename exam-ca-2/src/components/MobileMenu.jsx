import { Link } from "react-router-dom";

export function MobileMenu({ menuOpen, setMenuOpen }) {
  return (
    <div
      className={`fixed top-0 left-0 w-full bg-[rgba(10,10,10,0.8)] z-50 flex flex-col items-center justify-center transition-all duration-300 ease-in-out
      ${
        menuOpen
          ? "h-screen opacity-100 pointer-events-auto"
          : "h-0 opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-6 right-6 text-white text-3xl focus:outline-none cursor-pointer"
        aria-label="Close Menu"
      >
        &times;
      </button>

      <nav className="flex flex-col items-center">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="text-2xl font-semibold text-white my-4"
        >
          Home
        </Link>

        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          className="text-2xl font-semibold text-white my-4"
        >
          Login
        </Link>

        <Link
          to="/dashboard"
          onClick={() => setMenuOpen(false)}
          className="text-2xl font-semibold text-white my-4"
        >
          Dashboard
        </Link>
      </nav>
    </div>
  );
}
