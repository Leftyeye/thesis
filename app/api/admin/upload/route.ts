import { NextRequest, NextResponse } from "next/server";
import { createPost } from "@/lib/posts";
import matter from "gray-matter";
import path from "path";

export async function POST(req: NextRequest) {
  if (process.env.VERCEL === "1") {
    return NextResponse.json({ error: "线上环境不支持写入，请在本地管理" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const text = await file.text();
  const { data, content } = matter(text);

  // Derive slug from filename
  const slug = path.basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9一-鿿-]/g, "");

  // Merge defaults into frontmatter
  const frontmatter = {
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString().slice(0, 10),
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    category: data.category ?? "",
    published: data.published !== false,
    ...data,
  };

  try {
    createPost(slug, frontmatter, content);
    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
