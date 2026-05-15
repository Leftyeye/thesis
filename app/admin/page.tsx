"use client";

import { useEffect, useRef, useState } from "react";
import type { PostMeta } from "@/lib/posts";

type TabId = "all" | "published" | "draft";

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-blue-100 text-blue-800 border-blue-300",
  编程: "bg-purple-100 text-purple-800 border-purple-300",
  生活: "bg-green-100 text-green-800 border-green-300",
  设计: "bg-pink-100 text-pink-800 border-pink-300",
  工具: "bg-orange-100 text-orange-800 border-orange-300",
};

function CategoryBadge({ category }: { category: string }) {
  if (!category) return <span className="text-gray-300">—</span>;
  const cls = CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-700 border-gray-300";
  return (
    <span className={`inline-block border text-xs font-bold px-1.5 py-0.5 rounded-sm ${cls}`}>
      {category}
    </span>
  );
}

function TagChip({ tag }: { tag: string }) {
  return (
    <span className="inline-block border border-black/30 text-xs px-1.5 py-0.5 rounded-sm font-medium bg-white">
      #{tag}
    </span>
  );
}

export default function AdminPage() {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");
  const [editingTags, setEditingTags] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [catInput, setCatInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showMsg = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/posts");
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = posts.filter((p) => {
    if (tab === "published" && !p.published) return false;
    if (tab === "draft" && p.published) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const togglePublish = async (post: PostMeta) => {
    const res = await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: post.slug, published: !post.published }),
    });
    if (res.ok) {
      setPosts((ps) => ps.map((p) => p.slug === post.slug ? { ...p, published: !p.published } : p));
      showMsg(post.published ? "已设为草稿" : "已发布");
    } else {
      const d = await res.json();
      showMsg(d.error ?? "操作失败", false);
    }
  };

  const saveTags = async (slug: string) => {
    const tags = tagInput.split(/[,，\s]+/).map((t) => t.trim()).filter(Boolean);
    const res = await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, tags }),
    });
    if (res.ok) {
      setPosts((ps) => ps.map((p) => p.slug === slug ? { ...p, tags } : p));
      showMsg("标签已保存");
    } else {
      showMsg("保存失败", false);
    }
    setEditingTags(null);
  };

  const saveCategory = async (slug: string) => {
    const res = await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, category: catInput.trim() }),
    });
    if (res.ok) {
      setPosts((ps) => ps.map((p) => p.slug === slug ? { ...p, category: catInput.trim() } : p));
      showMsg("分类已保存");
    } else {
      showMsg("保存失败", false);
    }
    setEditingCategory(null);
  };

  const deletePost = async (slug: string, title: string) => {
    if (!confirm(`确认删除「${title}」？此操作不可撤销。`)) return;
    const res = await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      setPosts((ps) => ps.filter((p) => p.slug !== slug));
      showMsg("已删除");
    } else {
      showMsg("删除失败", false);
    }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      showMsg(`已上传：${data.slug}`);
      load();
    } else {
      showMsg(data.error ?? "上传失败", false);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "published", label: "已发布" },
    { id: "draft", label: "草稿" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slack-panel">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-black/20 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-black text-lg tracking-tight">后台管理</span>
          <span className="text-xs font-bold text-gray-400 border border-gray-200 px-2 py-0.5 rounded-sm">
            本地模式
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索标题…"
            className="border border-black/20 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:border-black w-48"
          />

          {/* Upload MD */}
          <input
            ref={fileRef}
            type="file"
            accept=".md,.mdx"
            className="hidden"
            onChange={uploadFile}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 border-2 border-black bg-white px-3 py-1.5 text-sm font-bold shadow-[2px_2px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000] transition-all duration-100 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {uploading ? "上传中…" : "上传 MD"}
          </button>

          <a
            href="/blog"
            target="_blank"
            className="flex items-center gap-1.5 border-2 border-black bg-brutal-yellow px-3 py-1.5 text-sm font-bold shadow-[2px_2px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100"
          >
            查看博客 ↗
          </a>
        </div>
      </div>

      {/* Toast */}
      {msg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 text-sm font-bold border-2 border-black shadow-[3px_3px_0_#000] ${msg.ok ? "bg-green-200" : "bg-red-200"}`}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 pt-4 flex items-center gap-1 border-b border-black/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
              tab === t.id
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs font-bold opacity-60">
              {t.id === "all" ? posts.length
                : t.id === "published" ? posts.filter(p => p.published).length
                : posts.filter(p => !p.published).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="py-20 text-center text-gray-400 font-medium">加载中…</div>
        ) : (
          <div className="border-2 border-black overflow-hidden shadow-[4px_4px_0_#000]">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  {["标题", "分类", "标签", "状态", "日期", "操作"].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 font-bold text-xs tracking-widest uppercase border-r border-white/10 last:border-r-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      暂无文章
                    </td>
                  </tr>
                ) : (
                  filtered.map((post, i) => (
                    <tr
                      key={post.slug}
                      className={`border-b border-black/10 hover:bg-yellow-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      {/* Title */}
                      <td className="px-3 py-2.5 border-r border-black/10 max-w-xs">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="font-semibold hover:underline text-black line-clamp-1"
                        >
                          {post.title}
                        </a>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{post.slug}</div>
                      </td>

                      {/* Category */}
                      <td className="px-3 py-2.5 border-r border-black/10 min-w-[100px]">
                        {editingCategory === post.slug ? (
                          <div className="flex gap-1">
                            <input
                              autoFocus
                              value={catInput}
                              onChange={(e) => setCatInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveCategory(post.slug);
                                if (e.key === "Escape") setEditingCategory(null);
                              }}
                              className="border border-black text-xs px-1.5 py-1 w-20 focus:outline-none"
                              placeholder="分类"
                            />
                            <button onClick={() => saveCategory(post.slug)} className="text-xs font-bold text-green-700">✓</button>
                            <button onClick={() => setEditingCategory(null)} className="text-xs text-gray-400">✕</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingCategory(post.slug); setCatInput(post.category ?? ""); }}
                            className="hover:opacity-70 transition-opacity"
                          >
                            <CategoryBadge category={post.category} />
                          </button>
                        )}
                      </td>

                      {/* Tags */}
                      <td className="px-3 py-2.5 border-r border-black/10 min-w-[160px]">
                        {editingTags === post.slug ? (
                          <div className="flex gap-1 items-center">
                            <input
                              autoFocus
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveTags(post.slug);
                                if (e.key === "Escape") setEditingTags(null);
                              }}
                              className="border border-black text-xs px-1.5 py-1 w-32 focus:outline-none"
                              placeholder="标签1, 标签2"
                            />
                            <button onClick={() => saveTags(post.slug)} className="text-xs font-bold text-green-700">✓</button>
                            <button onClick={() => setEditingTags(null)} className="text-xs text-gray-400">✕</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingTags(post.slug); setTagInput(post.tags?.join(", ") ?? ""); }}
                            className="flex flex-wrap gap-1 hover:opacity-70 transition-opacity text-left"
                          >
                            {post.tags?.length ? post.tags.map((t) => <TagChip key={t} tag={t} />) : <span className="text-gray-300 text-xs">点击添加</span>}
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5 border-r border-black/10">
                        <button
                          onClick={() => togglePublish(post)}
                          className={`inline-flex items-center gap-1 border text-xs font-bold px-2 py-1 transition-colors ${
                            post.published
                              ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                              : "border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-green-500" : "bg-gray-400"}`} />
                          {post.published ? "Published" : "Invisible"}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-2.5 border-r border-black/10 text-gray-500 text-xs font-mono whitespace-nowrap">
                        {post.date}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            查看
                          </a>
                          <button
                            onClick={() => deletePost(post.slug, post.title)}
                            className="text-xs font-bold text-red-500 hover:text-red-700"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
