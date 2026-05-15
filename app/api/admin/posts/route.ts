import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, updatePostMeta, createPost, deletePost } from "@/lib/posts";

function isReadOnly() {
  return process.env.VERCEL === "1";
}

// GET /api/admin/posts — list all posts (including unpublished)
export async function GET() {
  const posts = getAllPosts(true);
  return NextResponse.json({ posts });
}

// PATCH /api/admin/posts — update a post's metadata
export async function PATCH(req: NextRequest) {
  if (isReadOnly()) {
    return NextResponse.json({ error: "线上环境不支持写入，请在本地管理" }, { status: 403 });
  }
  const { slug, ...updates } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  try {
    updatePostMeta(slug, updates);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST /api/admin/posts — create new post
export async function POST(req: NextRequest) {
  if (isReadOnly()) {
    return NextResponse.json({ error: "线上环境不支持写入，请在本地管理" }, { status: 403 });
  }
  const { slug, frontmatter, content } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  try {
    createPost(slug, frontmatter, content ?? "");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE /api/admin/posts — delete a post
export async function DELETE(req: NextRequest) {
  if (isReadOnly()) {
    return NextResponse.json({ error: "线上环境不支持写入，请在本地管理" }, { status: 403 });
  }
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  try {
    deletePost(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
