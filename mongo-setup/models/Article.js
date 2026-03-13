// models/Article.js
// ─────────────────────────────────────────────────────────────────────────────
// Article model — supports full blog posts with rich content
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      default: "",
      // Stores the full article body (Markdown or HTML)
    },
    coverImage: {
      type: String,
      default: null,
      // URL to cover image
    },
    tags: {
      type: [String],
      default: [],
      // e.g. ["D365 F&O", "X++", "Power Platform"]
    },
    readTime: {
      type: String,
      default: "5 min",
      // Estimated read time
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    // Adds createdAt and updatedAt automatically
  }
);

// Auto-generate slug from title if not provided
ArticleSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

// Set publishedAt when status changes to published
ArticleSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for efficient querying
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);
