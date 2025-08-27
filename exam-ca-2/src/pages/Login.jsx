import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, createApiKey } from "../lib/auth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      setBusy(true);
      const { data } = await login({ email, password });

      // Store auth
      localStorage.setItem("accessToken", data?.accessToken);
      localStorage.setItem("profileName", data?.name);

      // Ensure API key
      const keyResp = await createApiKey({
        accessToken: data?.accessToken,
        name: "Holidaze FE",
      });
      localStorage.setItem("apiKey", keyResp?.data?.key);

      // Update global nav state
      window.dispatchEvent(new Event("auth:changed"));

      // Go to dashboard
      nav("/dashboard");
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    // NOTE: no "min-h-screen" here — keeps the footer in view on short pages
    <div className="flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 border border-black/10 rounded-2xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-black text-center">Login</h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}

        <label className="block text-black">
          <span className="text-sm">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
            placeholder="you@stud.noroff.no"
          />
        </label>

        <label className="block text-black">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
            placeholder="********"
          />
        </label>

        <button
          disabled={busy}
          className="w-full px-4 py-2 rounded bg-yellow-400 text-black font-semibold disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Login"}
        </button>

        <div className="text-center mt-4">
          <span className="text-black/70 text-sm">Don’t have an account?</span>{" "}
          <button
            type="button"
            onClick={() => nav("/register")}
            className="text-sm font-semibold text-yellow-600 hover:underline"
          >
            Register here
          </button>
        </div>
      </form>
    </div>
  );
}
