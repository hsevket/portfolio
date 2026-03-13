// pages/api/projects/index.js
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/projects         — List projects (with filters)
// POST /api/projects         — Create a new project
// ─────────────────────────────────────────────────────────────────────────────

import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export default async function handler(req, res) {
  await connectDB();

  // ── GET: List projects ────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const {
        status = "active",
        featured,
        tag,
        sort = "sortOrder",
      } = req.query;

      const filter = {};

      if (status !== "all") {
        filter.status = status;
      }

      if (featured === "true") {
        filter.featured = true;
      }

      if (tag) {
        filter.tags = { $in: tag.split(",") };
      }

      const projects = await Project.find(filter)
        .sort(sort)
        .lean();

      return res.status(200).json({ success: true, data: projects });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // ── POST: Create project ──────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const project = await Project.create(req.body);
      return res.status(201).json({ success: true, data: project });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: "A project with this slug already exists",
        });
      }
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
