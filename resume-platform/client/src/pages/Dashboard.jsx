import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import ResumeCard from "../components/ResumeCard.jsx";

export default function Dashboard({ token, onCreate, onOpen }) {
  const [resumes, setResumes] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const data = await api("/resumes", { token });
      setResumes(data);
    } catch (e) { setErr(e.message); }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <div className="row between">
        <h2>Your Resumes</h2>
        <button onClick={async ()=>{ await api("/resumes", { method: "POST", token, body: { title: "New Resume" } }); load(); onCreate(); }}>+ New Resume</button>
      </div>
      {err && <p className="error">{err}</p>}
      <div className="grid">
        {resumes.map(r => <ResumeCard key={r._id} resume={r} onOpen={()=>onOpen(r)} token={token} />)}
      </div>
    </div>
  );
}
