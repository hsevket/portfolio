// scripts/seed.js
// ─────────────────────────────────────────────────────────────────────────────
// Run: node scripts/seed.js
// Seeds the database with your initial articles and projects
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// ── Schemas (inline to avoid import issues with ESM) ────────────────────────

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    coverImage: { type: String, default: null },
    tags: { type: [String], default: [] },
    readTime: { type: String, default: "5 min" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    language: { type: String, default: "JavaScript" },
    languageColor: { type: String, default: "#f7df1e" },
    tags: { type: [String], default: [] },
    githubUrl: { type: String, default: null },
    liveUrl: { type: String, default: null },
    coverImage: { type: String, default: null },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "archived", "wip"], default: "active" },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", ArticleSchema);
const Project = mongoose.model("Project", ProjectSchema);

// ── Seed Data ───────────────────────────────────────────────────────────────

const articles = [
  {
    title: "Extending D365 F&O with Chain of Command",
    slug: "extending-d365-fo-chain-of-command",
    excerpt: "Chain of Command is the modern way to customize D365 without over-layering. Here's how to use it effectively and avoid common pitfalls in production.",
    content: `# Extending D365 F&O with Chain of Command

Chain of Command (CoC) was introduced as the recommended extensibility pattern in Dynamics 365 Finance & Operations. Unlike the old overlayering approach, CoC lets you wrap existing methods without modifying the base code directly.

## Why Chain of Command?

- **No overlayering conflicts** during updates
- **Cleaner upgrade path** when Microsoft releases new versions
- **Better separation of concerns** between base and custom code

## Basic Pattern

\`\`\`xpp
[ExtensionOf(classStr(SalesFormLetter))]
final class SalesFormLetter_Extension
{
    public void main(Args args)
    {
        // Pre-processing logic
        next main(args);
        // Post-processing logic
    }
}
\`\`\`

## Best Practices

1. Always call \`next\` to ensure the base logic executes
2. Keep extensions focused — one extension class per business requirement
3. Use \`CoC\` for methods, event handlers for broader scenarios
4. Test thoroughly — CoC changes affect the entire call chain

## Common Pitfalls

- Forgetting to call \`next\` breaks the chain
- Over-using CoC when event handlers would be more appropriate
- Not considering execution order when multiple extensions exist

This approach keeps your codebase clean and upgrade-safe while giving you full control over customization.`,
    tags: ["D365 F&O", "X++"],
    readTime: "8 min",
    status: "published",
    featured: true,
    publishedAt: new Date("2026-02-12"),
  },
  {
    title: "Building Custom Power Apps for D365 Workflows",
    slug: "building-custom-power-apps-d365-workflows",
    excerpt: "A practical guide to creating canvas and model-driven apps that extend your Dynamics 365 processes with real-time data integration.",
    content: `# Building Custom Power Apps for D365 Workflows

Power Apps provides a low-code way to extend D365 with custom interfaces tailored to specific business processes.

## Canvas vs Model-Driven

**Canvas Apps** give you pixel-perfect control over the UI. Great for:
- Mobile-first experiences
- Task-specific interfaces
- External user-facing forms

**Model-Driven Apps** are built on top of Dataverse tables. Great for:
- Data-heavy CRUD operations
- Business process flows
- Complex entity relationships

## Connecting to D365

Use the built-in Dynamics 365 connector to read and write data directly. For F&O, use the OData connector with your environment URL.

## Real-World Example

We built a warehouse inspection app that:
1. Pulls inventory data from D365 F&O via OData
2. Lets warehouse staff scan barcodes and log inspections
3. Syncs results back to D365 in real-time via Power Automate

The entire solution was built in 2 weeks — a fraction of the time a custom X++ solution would take.`,
    tags: ["Power Platform", "D365"],
    readTime: "12 min",
    status: "published",
    featured: false,
    publishedAt: new Date("2026-01-28"),
  },
  {
    title: "Data Migration Strategies for D365 Finance",
    slug: "data-migration-strategies-d365-finance",
    excerpt: "Migrating legacy data into D365 is one of the riskiest parts of any implementation. Here's a battle-tested approach using Data Entities and DMF.",
    content: `# Data Migration Strategies for D365 Finance

Data migration can make or break a D365 implementation. A structured approach using the Data Management Framework (DMF) reduces risk significantly.

## The DMF Approach

1. **Map source to target** — Identify which legacy fields map to D365 data entities
2. **Cleanse first** — Fix data quality issues before migration, not after
3. **Stage and validate** — Use DMF staging tables to catch errors early
4. **Migrate in sequence** — Respect entity dependencies (master data → transactions)
5. **Reconcile** — Compare source totals with D365 totals post-migration

## Key Data Entities

- \`CustomersV3\` — Customer master records
- \`VendorsV2\` — Vendor master records
- \`ReleasedProductsV2\` — Item/product master
- \`GeneralJournalAccountEntry\` — Opening balances

## Tips from the Trenches

- Always run a full dry-run migration in a sandbox environment
- Build automated reconciliation reports
- Plan for 3-4 migration iterations minimum
- Document every transformation rule`,
    tags: ["Data Migration", "DMF"],
    readTime: "10 min",
    status: "published",
    featured: false,
    publishedAt: new Date("2025-12-15"),
  },
  {
    title: "Azure Integration Patterns for Dynamics 365",
    slug: "azure-integration-patterns-dynamics-365",
    excerpt: "From Logic Apps to Service Bus — a deep dive into connecting D365 with the broader Azure ecosystem for event-driven architectures.",
    content: `# Azure Integration Patterns for Dynamics 365

D365 becomes significantly more powerful when integrated with Azure services. Here are the most common patterns.

## Pattern 1: Logic Apps for Simple Integrations

Best for point-to-point integrations with built-in connectors. Example: syncing D365 customers to Salesforce.

## Pattern 2: Service Bus for Reliable Messaging

When you need guaranteed delivery and decoupled systems. D365 business events publish to Service Bus topics, and subscribers process independently.

## Pattern 3: Azure Functions for Custom Logic

Lightweight compute for transformation, validation, or orchestration. Triggered by Service Bus messages or HTTP calls.

## Pattern 4: Event Grid for Real-Time React

Best for fan-out scenarios where multiple systems need to react to D365 events simultaneously.

## Architecture Decision Guide

| Pattern | Best For | Complexity |
|---------|----------|------------|
| Logic Apps | Simple, connector-based | Low |
| Service Bus | Reliable, decoupled | Medium |
| Functions | Custom transformation | Medium |
| Event Grid | Real-time fan-out | High |

Choose based on your reliability requirements, volume, and team expertise.`,
    tags: ["Azure", "Integration"],
    readTime: "15 min",
    status: "published",
    featured: true,
    publishedAt: new Date("2025-11-03"),
  },
];

const projects = [
  {
    name: "d365-devtools",
    slug: "d365-devtools",
    description: "Developer utilities for D365 F&O — code generators, label search, metadata explorers.",
    longDescription: "A comprehensive toolkit for D365 F&O developers that streamlines common tasks like generating extension classes, searching labels across modules, exploring metadata relationships, and automating build processes.",
    language: "C#",
    languageColor: "#68217A",
    tags: ["D365", "Developer Tools", "X++"],
    githubUrl: "https://github.com/hamdisevketbeyoglu/d365-devtools",
    stars: 847,
    forks: 112,
    status: "active",
    featured: true,
    sortOrder: 1,
  },
  {
    name: "power-automate-templates",
    slug: "power-automate-templates",
    description: "Ready-to-use Power Automate flow templates for common D365 business processes.",
    longDescription: "A curated collection of Power Automate flow templates covering approval workflows, notification systems, data synchronization, and scheduled batch processing for Dynamics 365 environments.",
    language: "TypeScript",
    languageColor: "#3178c6",
    tags: ["Power Automate", "D365", "Automation"],
    githubUrl: "https://github.com/hamdisevketbeyoglu/power-automate-templates",
    stars: 523,
    forks: 89,
    status: "active",
    featured: true,
    sortOrder: 2,
  },
  {
    name: "xpp-snippets",
    slug: "xpp-snippets",
    description: "Curated X++ code snippets and patterns for D365 Finance & Operations development.",
    longDescription: "A living repository of X++ code patterns covering Chain of Command, SysOperation framework, batch jobs, form extensions, security patterns, and more. Designed to be copy-paste friendly.",
    language: "X++",
    languageColor: "#512BD4",
    tags: ["X++", "D365 F&O", "Patterns"],
    githubUrl: "https://github.com/hamdisevketbeyoglu/xpp-snippets",
    stars: 412,
    forks: 145,
    status: "active",
    featured: false,
    sortOrder: 3,
  },
  {
    name: "d365-data-migrator",
    slug: "d365-data-migrator",
    description: "Automated data migration toolkit for D365 using Data Entities with validation and rollback.",
    language: "C#",
    languageColor: "#68217A",
    tags: ["D365", "Data Migration", "DMF"],
    githubUrl: "https://github.com/hamdisevketbeyoglu/d365-data-migrator",
    stars: 364,
    forks: 67,
    status: "active",
    featured: false,
    sortOrder: 4,
  },
  {
    name: "ssrs-report-builder",
    slug: "ssrs-report-builder",
    description: "Simplified SSRS report development for D365 with reusable templates.",
    language: "C#",
    languageColor: "#68217A",
    tags: ["SSRS", "D365", "Reporting"],
    githubUrl: "https://github.com/hamdisevketbeyoglu/ssrs-report-builder",
    stars: 289,
    forks: 42,
    status: "active",
    featured: false,
    sortOrder: 5,
  },
  {
    name: "d365-azure-connector",
    slug: "d365-azure-connector",
    description: "Lightweight library for integrating D365 with Azure services.",
    language: "C#",
    languageColor: "#68217A",
    tags: ["Azure", "D365", "Integration"],
    githubUrl: "https://github.com/hamdisevketbeyoglu/d365-azure-connector",
    stars: 215,
    forks: 38,
    status: "active",
    featured: false,
    sortOrder: 6,
  },
];

// ── Run Seed ────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Article.deleteMany({});
    await Project.deleteMany({});
    console.log("🗑️  Cleared existing articles and projects");

    // Insert seed data
    const insertedArticles = await Article.insertMany(articles);
    const insertedProjects = await Project.insertMany(projects);

    console.log(`📝 Inserted ${insertedArticles.length} articles`);
    console.log(`📦 Inserted ${insertedProjects.length} projects`);
    console.log("\n🎉 Database seeded successfully!");

    // Print summary
    console.log("\n── Articles ──────────────────────────────");
    insertedArticles.forEach((a) => console.log(`  • ${a.title} (${a.slug})`));
    console.log("\n── Projects ──────────────────────────────");
    insertedProjects.forEach((p) => console.log(`  • ${p.name} (${p.slug})`));
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

seed();
