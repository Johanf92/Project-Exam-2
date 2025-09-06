import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthed, logout } from "../lib/session.js";

export function Navbar({ menuOpen, setMenuOpen }) {
  const [authed, setAuthed] = useState(isAuthed());
  const navigate = useNavigate();

  // Keep the navbar in sync if tokens change (e.g., login/logout in another tab)
  useEffect(() => {
    const onStorage = () => setAuthed(isAuthed());
    const onAuthChanged = () => setAuthed(isAuthed());
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:changed", onAuthChanged);
    // also update on first mount just in case
    setAuthed(isAuthed());
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuthChanged);
    };
  }, []);

  function handleLogout() {
    logout();
    // close mobile menu if open
    setMenuOpen?.(false);
    // send user to login (or home if you prefer)
    navigate("/login");
  }

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="font-mono text-xl font-bold text-white"
            onClick={() => setMenuOpen?.(false)}
          >
            Holi<span className="text-yellow-500">daze</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-yellow-300 hover:text-white transition-colors"
            >
              Venues
            </Link>

            {authed ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-yellow-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-yellow-300 hover:text-white cursor-pointer transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-yellow-300 hover:text-white cursor-pointer transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="w-7 h-5 relative cursor-pointer text-yellow-300 z-40 md:hidden"
            onClick={() => setMenuOpen?.((prev) => !prev)}
            aria-label="Open Menu"
          >
            &#9776;
          </button>
        </div>
      </div>
    </nav>
  );
}
