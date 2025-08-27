import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, createApiKey } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const { data } = await login({ email, password });
      const accessToken = data?.accessToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("profileName", data?.name);

      // Create API key (first time) and store it
      const keyResp = await createApiKey({ accessToken, name: "Holidaze FE" });
      const apiKey = keyResp?.data?.key;
      localStorage.setItem("apiKey", apiKey);

      // ✅ Notify Navbar and others immediately that auth changed
      window.dispatchEvent(new Event("auth:changed"));

      nav("/"); // go to Home
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-6 max-w-md mx-auto space-y-3">
      <h1 className="text-xl font-semibold">Login</h1>
      {err && <div className="text-red-500">{err}</div>}
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="first.last@stud.noroff.no"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border px-3 py-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        disabled={busy}
        className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Login"}
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
  );
}
