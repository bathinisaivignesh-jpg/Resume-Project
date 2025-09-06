import React, { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState(token ? "dashboard" : "login");
  const [activeResume, setActiveResume] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  function logout() {
    setToken(null);
    setView("login");
  }

  return (
    <div className="container">
      <header className="topbar">
        <h1>Resume Platform</h1>
        <nav>
          {token && <button onClick={() => setView("dashboard")}>Dashboard</button>}
          {!token && <button onClick={() => setView("login")}>Login</button>}
          {!token && <button onClick={() => setView("signup")}>Signup</button>}
          {token && <button onClick={logout}>Logout</button>}
        </nav>
      </header>

      <main>
        {view === "login" && <Login onSuccess={(t)=>{setToken(t); setView("dashboard");}} />}
        {view === "signup" && <Signup onSuccess={(t)=>{setToken(t); setView("dashboard");}} />}
        {view === "dashboard" && token && <Dashboard token={token} onCreate={()=>setView("builder")} onOpen={(r)=>{setActiveResume(r); setView("builder");}}/>}
        {view === "builder" && token && <ResumeBuilder token={token} resume={activeResume} onBack={()=>setView("dashboard")} />}
      </main>
    </div>
  );
}
