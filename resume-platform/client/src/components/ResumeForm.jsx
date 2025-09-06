import React from "react";

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function ResumeForm({ value, onChange }) {
  const v = value || {};
  const set = (key, val) => onChange({ ...v, [key]: val });

  const updateArrayItem = (key, idx, item) => {
    const arr = Array.isArray(v[key]) ? [...v[key]] : [];
    arr[idx] = item;
    set(key, arr);
  };
  const addArrayItem = (key, template) => {
    const arr = Array.isArray(v[key]) ? [...v[key]] : [];
    arr.push(template);
    set(key, arr);
  };
  const removeArrayItem = (key, idx) => {
    const arr = Array.isArray(v[key]) ? [...v[key]] : [];
    arr.splice(idx,1);
    set(key, arr);
  };

  return (
    <div className="card">
      <Field label="Full Name">
        <input value={v.name || ""} onChange={e=>set("name", e.target.value)} />
      </Field>
      <div className="row">
        <Field label="Email">
          <input value={v.email || ""} onChange={e=>set("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input value={v.phone || ""} onChange={e=>set("phone", e.target.value)} />
        </Field>
      </div>
      <Field label="Summary">
        <textarea value={v.summary || ""} onChange={e=>set("summary", e.target.value)} />
      </Field>

      <h4>Education</h4>
      {(v.education || []).map((e, idx)=>(
        <div key={idx} className="subcard">
          <div className="row">
            <Field label="Degree">
              <input value={e.degree || ""} onChange={ev=>updateArrayItem("education", idx, { ...e, degree: ev.target.value })} />
            </Field>
            <Field label="Institution">
              <input value={e.institution || ""} onChange={ev=>updateArrayItem("education", idx, { ...e, institution: ev.target.value })} />
            </Field>
          </div>
          <div className="row">
            <Field label="Start">
              <input value={e.start || ""} onChange={ev=>updateArrayItem("education", idx, { ...e, start: ev.target.value })} />
            </Field>
            <Field label="End">
              <input value={e.end || ""} onChange={ev=>updateArrayItem("education", idx, { ...e, end: ev.target.value })} />
            </Field>
          </div>
          <button className="danger" onClick={()=>removeArrayItem("education", idx)}>Remove</button>
        </div>
      ))}
      <button onClick={()=>addArrayItem("education", { degree:"", institution:"", start:"", end:"" })}>+ Add Education</button>

      <h4>Experience</h4>
      {(v.experience || []).map((x, idx)=>(
        <div key={idx} className="subcard">
          <div className="row">
            <Field label="Role">
              <input value={x.role || ""} onChange={ev=>updateArrayItem("experience", idx, { ...x, role: ev.target.value })} />
            </Field>
            <Field label="Company">
              <input value={x.company || ""} onChange={ev=>updateArrayItem("experience", idx, { ...x, company: ev.target.value })} />
            </Field>
          </div>
          <div className="row">
            <Field label="Start">
              <input value={x.start || ""} onChange={ev=>updateArrayItem("experience", idx, { ...x, start: ev.target.value })} />
            </Field>
            <Field label="End">
              <input value={x.end || ""} onChange={ev=>updateArrayItem("experience", idx, { ...x, end: ev.target.value })} />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={x.description || ""} onChange={ev=>updateArrayItem("experience", idx, { ...x, description: ev.target.value })} />
          </Field>
          <button className="danger" onClick={()=>removeArrayItem("experience", idx)}>Remove</button>
        </div>
      ))}
      <button onClick={()=>addArrayItem("experience", { role:"", company:"", start:"", end:"", description:"" })}>+ Add Experience</button>

      <h4>Skills</h4>
      <Field label="Comma-separated">
        <input value={(v.skills||[]).join(", ")} onChange={e=>set("skills", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} />
      </Field>
    </div>
  );
}
