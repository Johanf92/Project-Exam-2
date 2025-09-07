import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingOnce() {
  const nav = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem("seenLanding");
    if (seen === "1") {
      nav("venues", { replace: true });
    }
  }, [nav]);

  function startBrowsing() {
    localStorage.setItem("seenLanding", "1");
    nav("venues");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-center mt-32">
      <h1 className="text-3xl font-bold text-black mb-3">
        Welcome to Holidaze
      </h1>
      <p className="text-black/80 mb-6">
        Find and book great places to stay. Ready to explore?
      </p>
      <button
        onClick={startBrowsing}
        className="inline-block px-6 py-3 rounded-full bg-yellow-400 text-black font-bold
                   hover:bg-yellow-500 hover:text-white hover:shadow-lg hover:scale-105
                   active:scale-95 transition cursor-pointer"
      >
        Browse venues
      </button>
    </div>
  );
}
