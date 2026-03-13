"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/articles/${params.slug}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setArticle(res.data);
        else setError("Article not found");
      })
      .catch(() => setError("Failed to load article"))
      .finally(() => setLoading(false));
  }, [params.slug]);

  // Simple markdown-to-HTML converter
  function renderMarkdown(md) {
    if (!md) return "";
    return md
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#111118;border:1px solid #ffffff0a;border-radius:8px;padding:20px;overflow-x:auto;margin:24px 0;font-size:13px;line-height:1.6"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code style="background:#111118;padding:2px 6px;border-radius:4px;font-size:13px;color:#c4b5fd">$1</code>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3 style="font-family:Sora,sans-serif;font-size:18px;font-weight:600;color:#eee;margin:32px 0 12px">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-family:Sora,sans-serif;font-size:22px;font-weight:600;color:#f0f0f0;margin:40px 0 16px">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-family:Sora,sans-serif;font-size:28px;font-weight:700;color:#f8f8f8;margin:0 0 24px">$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#ddd;font-weight:600">$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.+)$/gm, '<li style="margin:4px 0;padding-left:4px">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li style="margin:4px 0;padding-left:4px">$2</li>')
      // Table rows
      .replace(/^\|(.+)\|$/gm, (match, content) => {
        if (content.includes('---')) return '';
        const cells = content.split('|').map(c => c.trim());
        const tag = cells.length > 0 ? 'td' : 'td';
        return '<tr>' + cells.map(c => `<${tag} style="padding:8px 12px;border-bottom:1px solid #ffffff0a">${c}</${tag}>`).join('') + '</tr>';
      })
      // Paragraphs (double newline)
      .replace(/\n\n/g, '</p><p style="margin:16px 0;line-height:1.8;color:#aaa">')
      // Single newlines inside paragraphs
      .replace(/\n/g, '<br/>');
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <style>{css}</style>
        <div style={styles.container}>
          <div style={styles.loader}>
            <div style={styles.loaderDot} />
            <div style={{ ...styles.loaderDot, animationDelay: "0.2s" }} />
            <div style={{ ...styles.loaderDot, animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={styles.page}>
        <style>{css}</style>
        <div style={styles.container}>
          <button onClick={() => router.push("/")} style={styles.backBtn} className="back-btn">
            ← Back to portfolio
          </button>
          <h1 style={{ fontFamily: "'Sora'", fontSize: 28, color: "#f0f0f0", marginTop: 40 }}>Article not found</h1>
          <p style={{ color: "#888", marginTop: 12 }}>The article you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const publishDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : article.date || "";

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <article style={styles.container}>
        {/* Back button */}
        <button onClick={() => router.push("/")} style={styles.backBtn} className="back-btn">
          ← Back to portfolio
        </button>

        {/* Header */}
        <header style={styles.header}>
          <div style={styles.tagRow}>
            {(article.tags || []).map((t) => (
              <span key={t} style={styles.tag}>{t}</span>
            ))}
          </div>
          <h1 style={styles.title}>{article.title}</h1>
          <div style={styles.meta}>
            <span>{publishDate}</span>
            <span style={styles.dot}>·</span>
            <span>{article.readTime}</span>
            {article.views > 0 && (
              <>
                <span style={styles.dot}>·</span>
                <span>{article.views.toLocaleString()} views</span>
              </>
            )}
          </div>
          {article.excerpt && (
            <p style={styles.excerpt}>{article.excerpt}</p>
          )}
        </header>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Content */}
        <div
          style={styles.content}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />

        {/* Footer */}
        <div style={styles.divider} />
        <footer style={styles.footer}>
          <button onClick={() => router.push("/")} style={styles.backBtn} className="back-btn">
            ← Back to all articles
          </button>
        </footer>
      </article>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  .back-btn:hover { color: #c4b5fd !important; }
  @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
  pre code { font-family: 'Courier New', monospace; color: #c4b5fd; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  ul, ol { padding-left: 24px; margin: 12px 0; color: #aaa; }
  li { line-height: 1.8; }
`;

const styles = {
  page: {
    fontFamily: "'Outfit', sans-serif",
    background: "#050508",
    color: "#e0e0e0",
    minHeight: "100vh",
    padding: "40px 24px 80px",
  },
  container: {
    maxWidth: 720,
    margin: "0 auto",
  },
  loader: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    paddingTop: 200,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#a78bfa",
    animation: "pulse 1s ease infinite",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#a78bfa",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    cursor: "pointer",
    padding: "8px 0",
    transition: "color 0.3s",
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  tagRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#a78bfa",
    background: "rgba(167,139,250,0.08)",
    padding: "4px 10px",
    borderRadius: 4,
    fontWeight: 500,
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 700,
    lineHeight: 1.2,
    color: "#f8f8f8",
    marginBottom: 20,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    color: "#666",
  },
  dot: { color: "#444" },
  excerpt: {
    fontSize: 17,
    lineHeight: 1.7,
    color: "#999",
    marginTop: 20,
    fontStyle: "italic",
    borderLeft: "3px solid #a78bfa33",
    paddingLeft: 20,
  },
  divider: {
    height: 1,
    background: "linear-gradient(90deg, transparent, #ffffff12, transparent)",
    margin: "40px 0",
  },
  content: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#bbb",
  },
  footer: {
    paddingBottom: 40,
  },
};