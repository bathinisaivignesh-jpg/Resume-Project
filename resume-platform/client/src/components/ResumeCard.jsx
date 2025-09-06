import React from "react";
import { downloadPdf } from "../api.js";

export default function ResumeCard({ resume, onOpen, token }) {
  return (
    <div className="card">
      <h3>{resume.title}</h3>
      <p>Updated: {new Date(resume.updatedAt).toLocaleString()}</p>
      <div className="row">
        <button onClick={onOpen}>Edit</button>
        <button onClick={()=>downloadPdf(`/resumes/${resume._id}/pdf`, { token })}>Download PDF</button>
      </div>
    </div>
  );
}
