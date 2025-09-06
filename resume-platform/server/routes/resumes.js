import { Router } from "express";
import Resume from "../models/Resume.js";
import PDFDocument from "pdfkit";

const router = Router();

// Get all resumes for user
router.get("/", async (req, res) => {
  const list = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  res.json(list);
});

// Create new resume (empty)
router.post("/", async (req, res) => {
  const { title = "My Resume" } = req.body || {};
  const resume = await Resume.create({ userId: req.user.id, title, latest: {}, versions: [] });
  res.status(201).json(resume);
});

// Update resume latest and push version
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, title } = req.body;
  const resume = await Resume.findOne({ _id: id, userId: req.user.id });
  if (!resume) return res.status(404).json({ message: "Not found" });
  if (title) resume.title = title;
  if (data && typeof data === "object") {
    resume.latest = data;
    resume.versions.unshift({ data }); // newest first
    // keep only last 10 versions
    resume.versions = resume.versions.slice(0, 10);
  }
  await resume.save();
  res.json(resume);
});

// Get single resume
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const resume = await Resume.findOne({ _id: id, userId: req.user.id });
  if (!resume) return res.status(404).json({ message: "Not found" });
  res.json(resume);
});

// Download latest as PDF
router.get("/:id/pdf", async (req, res) => {
  const { id } = req.params;
  const resume = await Resume.findOne({ _id: id, userId: req.user.id });
  if (!resume) return res.status(404).json({ message: "Not found" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${(resume.title||'resume').replace(/\s+/g,'_')}.pdf"`);

  const doc = new PDFDocument({ margin: 36 });
  doc.pipe(res);

  const d = resume.latest || {};
  const section = (title) => { doc.moveDown().fontSize(14).text(title, { underline: true }); doc.moveDown(0.3); };

  doc.fontSize(20).text(d.name || "Your Name");
  doc.fontSize(10).text(d.email || "", { continued: true }).text(d.phone ? " | " + d.phone : "");
  doc.moveDown();

  if (d.summary) { section("Summary"); doc.fontSize(11).text(d.summary); }

  if (Array.isArray(d.education) && d.education.length) {
    section("Education");
    d.education.forEach(e => {
      doc.fontSize(11).text(`${e.degree || ""} - ${e.institution || ""}`);
      doc.fontSize(10).text(`${e.start || ""} - ${e.end || ""}`);
      doc.moveDown(0.5);
    });
  }

  if (Array.isArray(d.experience) && d.experience.length) {
    section("Experience");
    d.experience.forEach(x => {
      doc.fontSize(11).text(`${x.role || ""} - ${x.company || ""}`);
      doc.fontSize(10).text(`${x.start || ""} - ${x.end || ""}`);
      if (x.description) doc.fontSize(10).text(x.description);
      doc.moveDown(0.5);
    });
  }

  if (Array.isArray(d.skills) && d.skills.length) {
    section("Skills");
    doc.fontSize(11).text(d.skills.join(", "));
  }

  doc.end();
});

// Restore a specific version index (0 = latest version)
router.post("/:id/restore/:idx", async (req, res) => {
  const { id, idx } = req.params;
  const resume = await Resume.findOne({ _id: id, userId: req.user.id });
  if (!resume) return res.status(404).json({ message: "Not found" });
  const i = parseInt(idx, 10);
  if (isNaN(i) || i < 0 || i >= resume.versions.length) return res.status(400).json({ message: "Invalid index" });
  resume.latest = resume.versions[i].data;
  resume.versions.unshift({ data: resume.latest });
  resume.versions = resume.versions.slice(0, 10);
  await resume.save();
  res.json(resume);
});

export default router;
