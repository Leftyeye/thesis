"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PostMeta } from "@/lib/posts";

const ALL = "全部";

export default function ArticleListPanel({ posts }: { posts: PostMeta[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("cat") ?? ALL;
  const activeSlug = pathname.startsWith("/blog/")
    ? pathname.replace("/blog/", "")
    : null;

  // Derive unique categories
  const categories = [
    ALL,
    ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
  ];

  // Filter posts
  const visiblePosts =
    activeCategory === ALL
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const setCategory = (cat: string) => {
    const params = new URLSearchParams();
    if (cat !== ALL) params.set("cat", cat);
    router.push(`/blog${params.toString() ? "?" + params.toString() : ""}`);
  };

  return (
    <aside className="w-60 flex-shrink-0 border-r border-black flex flex-col overflow-hidden bg-slack-panel">
      {/* Header */}
      <div className="px-3 py-3 border-b border-black/20">
        <span className="text-xs font-black tracking-widest text-slack-muted uppercase">
          BLOG
        </span>
      </div>

      {/* Search (static UI) */}
      <div className="px-3 py-2 border-b border-black/10">
        <div className="flex items-center gap-2 bg-white border border-black/20 rounded-sm px-2 py-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-slack-muted flex-shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-xs text-slack-muted">搜索</span>
        </div>
      </div>

      {/* Categories — like Slack channels */}
      <div className="px-2 pt-3 pb-1">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-xs font-black tracking-widest text-slack-muted uppercase">
            分类
          </span>
        </div>
        {categories.map((cat) => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded-sm text-sm font-semibold transition-all duration-100 text-left ${
                active
                  ? "bg-slack-active text-white"
                  : "text-slack-text hover:bg-slack-hover"
              }`}
            >
              <span className={`text-xs font-bold ${active ? "text-white/80" : "text-slack-muted"}`}>
                #
              </span>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-3 my-2 border-t border-black/10" />

      {/* Article list */}
      <div className="px-2 pb-1 mb-1">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-xs font-black tracking-widest text-slack-muted uppercase">
            文章
          </span>
          <span className="text-xs font-bold text-slack-muted bg-black/5 px-1.5 rounded-sm">
            {visiblePosts.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {visiblePosts.length === 0 ? (
          <p className="text-xs text-slack-muted px-2 py-4">该分类暂无文章</p>
        ) : (
          visiblePosts.map((post) => {
            const active = activeSlug === post.slug;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}${activeCategory !== ALL ? `?cat=${encodeURIComponent(activeCategory)}` : ""}`}
                className={`flex items-center gap-2 px-2 py-1 rounded-sm text-sm font-semibold transition-all duration-100 ${
                  active
                    ? "bg-slack-active text-white"
                    : "text-slack-text hover:bg-slack-hover"
                }`}
              >
                <span className={`text-xs font-bold flex-shrink-0 ${active ? "text-white/70" : "text-slack-muted"}`}>
                  #
                </span>
                <span className="truncate">{post.title}</span>
              </Link>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-black/10 text-xs text-slack-muted font-medium">
        content/posts/*.mdx
      </div>
    </aside>
  );
}
