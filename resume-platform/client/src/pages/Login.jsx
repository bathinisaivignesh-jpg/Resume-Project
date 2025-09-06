import React, { useState } from "react";
import { api } from "../api.js";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e){
    e.preventDefault();
    setErr("");
    try {
      const { token } = await api("/auth/login", { method: "POST", body: { email, password } });
      onSuccess(token);
    } catch (e) { setErr(e.message); }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Login</h2>
      {err && <p className="error">{err}</p>}
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
