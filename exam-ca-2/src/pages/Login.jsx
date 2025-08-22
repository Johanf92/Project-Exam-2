import { useState } from "react";
import { login, createApiKey } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await login({ email, password });
      const accessToken = data?.accessToken;
      localStorage.setItem("accessToken", accessToken);

      const keyResp = await createApiKey({ accessToken, name: "Holidaze FE" });
      const apiKey = keyResp?.data?.key;
      localStorage.setItem("apiKey", apiKey);

      // TODO: navigate to home/dashboard
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-6 max-w-md mx-auto">
      <input
        className="block w-full mb-3 border px-3 py-2"
        placeholder="first.last@stud.noroff.no"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="block w-full mb-3 border px-3 py-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold">
        Login
      </button>
    </form>
  );
}
