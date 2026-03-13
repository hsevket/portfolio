# Portfolio Database — MongoDB Setup

Complete MongoDB backend for your Next.js developer portfolio. Manages **Articles** and **Projects** with full CRUD API routes.

---

## Quick Start

### 1. Install dependencies

```bash
npm install mongoose dotenv
```

### 2. Set up MongoDB

**Option A: MongoDB Atlas (recommended)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string

**Option B: Local MongoDB**
```bash
# macOS
brew install mongodb-community && brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongo mongo:7
```

### 3. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your MongoDB connection string
```

### 4. Copy files to your Next.js project

```
your-nextjs-project/
├── lib/
│   ├── mongodb.js          # DB connection (cached)
│   └── api.js              # Client-side fetch helpers
├── models/
│   ├── Article.js           # Article schema
│   └── Project.js           # Project schema
├── pages/api/
│   ├── articles/
│   │   ├── index.js         # GET list, POST create
│   │   └── [slug].js        # GET one, PUT update, DELETE
│   └── projects/
│       ├── index.js         # GET list, POST create
│       └── [slug].js        # GET one, PUT update, DELETE
├── scripts/
│   └── seed.js              # Populate initial data
└── .env.local               # MongoDB connection string
```

### 5. Seed the database

```bash
node --experimental-modules scripts/seed.js
```

---

## API Reference

### Articles

| Method   | Endpoint                | Description              |
|----------|------------------------|--------------------------|
| `GET`    | `/api/articles`        | List articles            |
| `POST`   | `/api/articles`        | Create article           |
| `GET`    | `/api/articles/:slug`  | Get single article       |
| `PUT`    | `/api/articles/:slug`  | Update article           |
| `DELETE` | `/api/articles/:slug`  | Delete article           |

**Query parameters for GET /api/articles:**

| Param      | Default       | Options                        |
|-----------|---------------|--------------------------------|
| `status`  | `published`   | `published`, `draft`, `archived`, `all` |
| `tag`     | —             | Comma-separated tags           |
| `featured`| —             | `true`                         |
| `page`    | `1`           | Page number                    |
| `limit`   | `10`          | Items per page                 |
| `sort`    | `-publishedAt`| Any field, prefix `-` for desc |

### Projects

| Method   | Endpoint                | Description              |
|----------|------------------------|--------------------------|
| `GET`    | `/api/projects`        | List projects            |
| `POST`   | `/api/projects`        | Create project           |
| `GET`    | `/api/projects/:slug`  | Get single project       |
| `PUT`    | `/api/projects/:slug`  | Update project           |
| `DELETE` | `/api/projects/:slug`  | Delete project           |

**Query parameters for GET /api/projects:**

| Param      | Default   | Options                            |
|-----------|-----------|-------------------------------------|
| `status`  | `active`  | `active`, `archived`, `wip`, `all` |
| `featured`| —         | `true`                              |
| `tag`     | —         | Comma-separated tags                |
| `sort`    | `sortOrder`| Any field                          |

---

## Usage Examples

### In your Portfolio component (client-side)

```jsx
import { getArticles, getProjects } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Portfolio() {
  const [articles, setArticles] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getArticles().then((res) => setArticles(res.data || []));
    getProjects().then((res) => setProjects(res.data || []));
  }, []);

  return (
    <>
      {articles.map((a) => <ArticleCard key={a._id} article={a} />)}
      {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
    </>
  );
}
```

### With Next.js SSR (recommended for SEO)

```jsx
import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import Project from "@/models/Project";

export async function getStaticProps() {
  await connectDB();

  const articles = await Article.find({ status: "published" })
    .sort("-publishedAt")
    .select("-content")
    .lean();

  const projects = await Project.find({ status: "active" })
    .sort("sortOrder")
    .lean();

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)),
      projects: JSON.parse(JSON.stringify(projects)),
    },
    revalidate: 60,
  };
}
```

### Creating an article via API

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Article",
    "excerpt": "A short summary of the article",
    "content": "# Full markdown content here...",
    "tags": ["D365", "Tutorial"],
    "status": "published"
  }'
```

---

## Data Models

### Article

```
title          String    (required)
slug           String    (auto-generated from title, unique)
excerpt        String    (required, max 500 chars)
content        String    (full body — Markdown/HTML)
coverImage     String    (URL)
tags           [String]  (e.g. ["D365 F&O", "X++"])
readTime       String    (e.g. "8 min")
status         String    (draft | published | archived)
featured       Boolean
views          Number    (auto-incremented on GET)
publishedAt    Date      (auto-set when published)
createdAt      Date      (auto)
updatedAt      Date      (auto)
```

### Project

```
name           String    (required)
slug           String    (auto-generated from name, unique)
description    String    (required, max 500 chars)
longDescription String   (detailed — Markdown)
language       String    (e.g. "C#")
languageColor  String    (hex color for badge)
tags           [String]
githubUrl      String
liveUrl        String
coverImage     String
stars          Number
forks          Number
status         String    (active | archived | wip)
featured       Boolean
sortOrder      Number    (display priority)
createdAt      Date      (auto)
updatedAt      Date      (auto)
```

---

## Next Steps

- **Add authentication** — Protect POST/PUT/DELETE routes with NextAuth.js or a simple API key
- **Add an admin panel** — Build a `/admin` page to manage articles and projects from a UI
- **Add image uploads** — Use Cloudinary or AWS S3 for cover images
- **Add GitHub sync** — Auto-update project stars/forks from GitHub API on a cron job
