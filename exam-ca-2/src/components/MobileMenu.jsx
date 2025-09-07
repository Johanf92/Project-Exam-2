import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthed, logout } from "../lib/session.js";

/**
 * @file MobileMenu component — a full-screen overlay navigation for mobile devices.
 * Handles authentication state changes and supports login/logout links.
 */

/**
 * MobileMenu component.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.menuOpen - Whether the mobile menu is currently open.
 * @param {(open: boolean) => void} props.setMenuOpen - Function to toggle menu visibility.
 * @returns {JSX.Element} A full-screen mobile navigation menu.
 */

export function MobileMenu({ menuOpen, setMenuOpen }) {
  const [authed, setAuthed] = useState(isAuthed());
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setAuthed(isAuthed());
    const onAuthChanged = () => setAuthed(isAuthed());
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:changed", onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuthChanged);
    };
  }, []);

  function close() {
    setMenuOpen(false);
  }
  function handleLogout() {
    logout();
    close();
    navigate("/login");
  }

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
        onClick={close}
        className="absolute top-6 right-6 text-white text-3xl focus:outline-none cursor-pointer"
        aria-label="Close Menu"
      >
        &times;
      </button>

      <nav className="flex flex-col items-center">
        <Link
          to="/"
          onClick={close}
          className="text-2xl font-semibold text-white my-4"
        >
          Venues
        </Link>

        {authed ? (
          <>
            <Link
              to="/dashboard"
              onClick={close}
              className="text-2xl font-semibold text-white my-4"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-2xl font-semibold text-white my-4"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            onClick={close}
            className="text-2xl font-semibold text-white my-4"
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  );
}
