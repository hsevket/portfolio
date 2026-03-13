// pages/api/articles/index.js
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/articles         — List articles (with filters)
// POST /api/articles         — Create a new article
// ─────────────────────────────────────────────────────────────────────────────

import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";

export default async function handler(req, res) {
  await connectDB();

  // ── GET: List articles ────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const {
        status = "published",
        tag,
        featured,
        page = 1,
        limit = 10,
        sort = "-publishedAt",
      } = req.query;

      const filter = {};

      // Filter by status (use "all" to skip filtering)
      if (status !== "all") {
        filter.status = status;
      }

      // Filter by tag
      if (tag) {
        filter.tags = { $in: tag.split(",") };
      }

      // Filter by featured
      if (featured === "true") {
        filter.featured = true;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [articles, total] = await Promise.all([
        Article.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .select("-content") // Exclude full content from list view
          .lean(),
        Article.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        data: articles,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // ── POST: Create article ──────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const article = await Article.create(req.body);
      return res.status(201).json({ success: true, data: article });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: "An article with this slug already exists",
        });
      }
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // ── Unsupported method ────────────────────────────────────────────────────
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
