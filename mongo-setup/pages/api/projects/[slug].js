// pages/api/projects/[slug].js
// ─────────────────────────────────────────────────────────────────────────────
// GET    /api/projects/:slug  — Get single project
// PUT    /api/projects/:slug  — Update project
// DELETE /api/projects/:slug  — Delete project
// ─────────────────────────────────────────────────────────────────────────────

import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export default async function handler(req, res) {
  await connectDB();
  const { slug } = req.query;

  // ── GET ───────────────────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const project = await Project.findOne({ slug }).lean();

      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }

      return res.status(200).json({ success: true, data: project });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // ── PUT ───────────────────────────────────────────────────────────────────
  if (req.method === "PUT") {
    try {
      const project = await Project.findOneAndUpdate(
        { slug },
        req.body,
        { new: true, runValidators: true }
      );

      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }

      return res.status(200).json({ success: true, data: project });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  if (req.method === "DELETE") {
    try {
      const project = await Project.findOneAndDelete({ slug });

      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }

      return res.status(200).json({ success: true, message: "Project deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
