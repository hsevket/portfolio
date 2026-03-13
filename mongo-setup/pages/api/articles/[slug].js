// pages/api/articles/[slug].js
// ─────────────────────────────────────────────────────────────────────────────
// GET    /api/articles/:slug  — Get single article (with full content)
// PUT    /api/articles/:slug  — Update article
// DELETE /api/articles/:slug  — Delete article
// ─────────────────────────────────────────────────────────────────────────────

import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";

export default async function handler(req, res) {
  await connectDB();
  const { slug } = req.query;

  // ── GET: Single article ───────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const article = await Article.findOne({ slug }).lean();

      if (!article) {
        return res.status(404).json({ success: false, error: "Article not found" });
      }

      // Increment view count (fire and forget)
      Article.updateOne({ slug }, { $inc: { views: 1 } }).exec();

      return res.status(200).json({ success: true, data: article });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // ── PUT: Update article ───────────────────────────────────────────────────
  if (req.method === "PUT") {
    try {
      const article = await Article.findOneAndUpdate(
        { slug },
        req.body,
        { new: true, runValidators: true }
      );

      if (!article) {
        return res.status(404).json({ success: false, error: "Article not found" });
      }

      return res.status(200).json({ success: true, data: article });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // ── DELETE: Remove article ────────────────────────────────────────────────
  if (req.method === "DELETE") {
    try {
      const article = await Article.findOneAndDelete({ slug });

      if (!article) {
        return res.status(404).json({ success: false, error: "Article not found" });
      }

      return res.status(200).json({ success: true, message: "Article deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
