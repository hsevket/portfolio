// models/Project.js
// ─────────────────────────────────────────────────────────────────────────────
// Project model — manages GitHub repos and side projects
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    longDescription: {
      type: String,
      default: "",
      // Detailed project description (Markdown)
    },
    language: {
      type: String,
      default: "JavaScript",
    },
    languageColor: {
      type: String,
      default: "#f7df1e",
      // Hex color for the language badge
    },
    tags: {
      type: [String],
      default: [],
      // e.g. ["D365", "Azure", "API"]
    },
    githubUrl: {
      type: String,
      default: null,
    },
    liveUrl: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "archived", "wip"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
      // Lower number = higher priority in display
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name if not provided
ProjectSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

// Indexes
ProjectSchema.index({ status: 1, sortOrder: 1 });
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
