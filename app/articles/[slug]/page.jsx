"use client";

import dynamic from "next/dynamic";

const ArticleContent = dynamic(() => import("./ArticleContent"), {
  ssr: false,
});

export default function ArticlePage() {
  return <ArticleContent />;
}