import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.js";
import resumeRouter from "./routes/resumes.js";
import { auth } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
  credentials: true
}));

app.get("/", (req, res) => res.json({ ok: true, message: "Resume Platform API" }));
app.use("/api/auth", authRouter);
app.use("/api/resumes", auth, resumeRouter);

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error("Mongo connection failed", err);
  process.exit(1);
});
