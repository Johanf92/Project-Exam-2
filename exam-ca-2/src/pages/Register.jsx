import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login, createApiKey } from "../lib/auth.js";

const NOROFF_DOMAIN = "@stud.noroff.no";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  function validate() {
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    if (!email.toLowerCase().endsWith(NOROFF_DOMAIN)) {
      return `Email must end with ${NOROFF_DOMAIN}`;
    }
    if (!password || password.length < 8)
      return "Password must be at least 8 characters.";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const msg = validate();
    if (msg) return setErr(msg);

    try {
      setBusy(true);
      // Register
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        venueManager,
      });

      // Auto-login
      const { data } = await login({ email, password });
      localStorage.setItem("accessToken", data?.accessToken);
      localStorage.setItem("profileName", data?.name);

      // API key
      const keyResp = await createApiKey({
        accessToken: data?.accessToken,
        name: "Holidaze FE",
      });
      localStorage.setItem("apiKey", keyResp?.data?.key);

      // Sync nav state
      window.dispatchEvent(new Event("auth:changed"));

      // Go dashboard
      nav("/dashboard");
    } catch (e) {
      setErr(e.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    // NOTE: no "min-h-screen" — keeps footer visible without scrolling
    <div className="flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 border border-black/10 rounded-2xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-black text-center">
          Create account
        </h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}

        <label className="block text-black">
          <span className="text-sm">Name *</span>
          <input
            className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
          />
        </label>

        <label className="block text-black">
          <span className="text-sm">Email * (stud.noroff.no)</span>
          <input
            type="email"
            className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`name${NOROFF_DOMAIN}`}
          />
        </label>

        <label className="block text-black">
          <span className="text-sm">Password * (min 8 chars)</span>
          <input
            type="password"
            className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </label>

        <label className="inline-flex items-center gap-2 text-black">
          <input
            type="checkbox"
            checked={venueManager}
            onChange={(e) => setVenueManager(e.target.checked)}
          />
          <span>I want to be a venue manager</span>
        </label>

        <button
          disabled={busy}
          className="w-full px-4 py-2 rounded bg-yellow-400 text-black font-semibold disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create account"}
        </button>

        <div className="text-center mt-4">
          <span className="text-black/70 text-sm">
            Already have an account?
          </span>{" "}
          <button
            type="button"
            onClick={() => nav("/login")}
            className="text-sm font-semibold text-yellow-600 hover:underline"
          >
            Login here
          </button>
        </div>
      </form>
    </div>
  );
}
