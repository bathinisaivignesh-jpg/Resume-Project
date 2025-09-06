import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, default: "My Resume" },
  latest: { type: Object, default: {} },
  versions: { type: [versionSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
