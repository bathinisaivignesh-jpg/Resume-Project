import React, { useEffect, useState } from "react";
import { api, downloadPdf } from "../api.js";
import ResumeForm from "../components/ResumeForm.jsx";

export default function ResumeBuilder({ token, resume, onBack }) {
  const [data, setData] = useState(resume?.latest || {});
  const [title, setTitle] = useState(resume?.title || "My Resume");
  const [versions, setVersions] = useState(resume?.versions || []);
  const [id, setId] = useState(resume?._id);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(()=>{
    (async ()=>{
      try {
        if (!id) {
          const list = await api("/resumes", { token });
          const newest = list[0];
          if (newest) {
            setId(newest._id);
            setTitle(newest.title);
            setData(newest.latest || {});
            setVersions(newest.versions || []);
          }
        } else {
          const fresh = await api(`/resumes/${id}`, { token });
          setTitle(fresh.title);
          setData(fresh.latest || {});
          setVersions(fresh.versions || []);
        }
      } catch (e) { setErr(e.message); }
    })();
  }, []);

  async function save() {
    try {
      const saved = await api(`/resumes/${id}`, { method: "PUT", token, body: { data, title } });
      setVersions(saved.versions);
      setMsg("Saved!");
      setTimeout(()=>setMsg(""), 1200);
    } catch (e) { setErr(e.message); }
  }

  async function restore(i) {
    try {
      const saved = await api(`/resumes/${id}/restore/${i}`, { method: "POST", token });
      setData(saved.latest);
      setVersions(saved.versions);
      setMsg("Restored version");
      setTimeout(()=>setMsg(""), 1200);
    } catch (e) { setErr(e.message); }
  }

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <div className="row between">
        <input className="title" value={title} onChange={e=>setTitle(e.target.value)} />
        <div className="row">
          <button onClick={save}>Save</button>
          <button onClick={()=>downloadPdf(`/resumes/${id}/pdf`, { token })}>Download PDF</button>
        </div>
      </div>

      {msg && <p className="ok">{msg}</p>}
      {err && <p className="error">{err}</p>}

      <ResumeForm value={data} onChange={setData} />

      <h3>Versions</h3>
      <ol>
        {versions.map((v, i) => (
          <li key={i} className="version">
            <span>{new Date(v.createdAt).toLocaleString()}</span>
            <button onClick={()=>restore(i)}>Restore</button>
          </li>
        ))}
      </ol>
    </div>
  );
}
