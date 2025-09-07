// src/layout/Layout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";
import { MobileMenu } from "../components/MobileMenu.jsx";
import Footer from "../components/Footer.jsx";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="flex-1 pt-16">
        <Outlet /> {/* <- required for nested routes */}
      </main>
      <Footer />
    </div>
  );
}
