import React, { useState } from "react";
import { api } from "../api.js";

export default function Signup({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e){
    e.preventDefault();
    setErr("");
    try {
      const { token } = await api("/auth/signup", { method: "POST", body: { name, email, password } });
      onSuccess(token);
    } catch (e) { setErr(e.message); }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Signup</h2>
      {err && <p className="error">{err}</p>}
      <input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
      <button type="submit">Create Account</button>
    </form>
  );
}
