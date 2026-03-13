// lib/api.js
// ─────────────────────────────────────────────────────────────────────────────
// Client-side API helpers for fetching articles and projects
// Use these in your React components or Next.js pages
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = "/api";

// ── Articles ────────────────────────────────────────────────────────────────

export async function getArticles({ status, tag, featured, page, limit, sort } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (tag) params.set("tag", tag);
  if (featured) params.set("featured", "true");
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (sort) params.set("sort", sort);

  const res = await fetch(`${API_BASE}/articles?${params}`);
  return res.json();
}

export async function getArticle(slug) {
  const res = await fetch(`${API_BASE}/articles/${slug}`);
  return res.json();
}

export async function createArticle(data) {
  const res = await fetch(`${API_BASE}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateArticle(slug, data) {
  const res = await fetch(`${API_BASE}/articles/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteArticle(slug) {
  const res = await fetch(`${API_BASE}/articles/${slug}`, { method: "DELETE" });
  return res.json();
}

// ── Projects ────────────────────────────────────────────────────────────────

export async function getProjects({ status, featured, tag, sort } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (featured) params.set("featured", "true");
  if (tag) params.set("tag", tag);
  if (sort) params.set("sort", sort);

  const res = await fetch(`${API_BASE}/projects?${params}`);
  return res.json();
}

export async function getProject(slug) {
  const res = await fetch(`${API_BASE}/projects/${slug}`);
  return res.json();
}

export async function createProject(data) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProject(slug, data) {
  const res = await fetch(`${API_BASE}/projects/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProject(slug) {
  const res = await fetch(`${API_BASE}/projects/${slug}`, { method: "DELETE" });
  return res.json();
}

// ── Usage with Next.js SSR (getServerSideProps / getStaticProps) ────────────
// 
// For server-side rendering, import the models directly instead:
//
//   import connectDB from "@/lib/mongodb";
//   import Article from "@/models/Article";
//
//   export async function getStaticProps() {
//     await connectDB();
//     const articles = await Article.find({ status: "published" })
//       .sort("-publishedAt")
//       .select("-content")
//       .lean();
//     return {
//       props: {
//         articles: JSON.parse(JSON.stringify(articles)),
//       },
//       revalidate: 60, // ISR: regenerate every 60 seconds
//     };
//   }
