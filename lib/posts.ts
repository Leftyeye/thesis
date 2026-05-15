import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  published: boolean;
  coverColor?: string;
}

export interface PostFull extends PostMeta {
  content: string;
}

function readPost(filename: string): PostMeta {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(postsDir, filename), "utf-8");
  const { data } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    category: data.category ?? "",
    published: data.published !== false, // default true
    coverColor: data.coverColor,
  };
}

export function getAllPosts(includeUnpublished = false): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs
    .readdirSync(postsDir)
    .filter((f) => /\.mdx?$/.test(f));

  return files
    .map(readPost)
    .filter((p) => includeUnpublished || p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): PostFull {
  const base = path.join(postsDir, slug);
  const filepath = fs.existsSync(base + ".mdx")
    ? base + ".mdx"
    : base + ".md";
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    category: data.category ?? "",
    published: data.published !== false,
    coverColor: data.coverColor,
    content,
  };
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags?.includes(tag));
}

export function getCategories(): string[] {
  return Array.from(
    new Set(getAllPosts().map((p) => p.category).filter(Boolean))
  );
}

/** Admin only — write frontmatter changes back to the MDX file */
export function updatePostMeta(
  slug: string,
  updates: Partial<Omit<PostMeta, "slug" | "content">>
): void {
  const base = path.join(postsDir, slug);
  const filepath = fs.existsSync(base + ".mdx")
    ? base + ".mdx"
    : base + ".md";
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  const newData = { ...data, ...updates };
  const newRaw = matter.stringify(content, newData);
  fs.writeFileSync(filepath, newRaw, "utf-8");
}

/** Admin only — save a new MDX file */
export function createPost(slug: string, frontmatter: object, content: string): void {
  const filepath = path.join(postsDir, `${slug}.mdx`);
  if (fs.existsSync(filepath)) throw new Error(`文章 ${slug} 已存在`);
  fs.writeFileSync(filepath, matter.stringify(content, frontmatter), "utf-8");
}

/** Admin only — delete an MDX file */
export function deletePost(slug: string): void {
  const base = path.join(postsDir, slug);
  const filepath = fs.existsSync(base + ".mdx")
    ? base + ".mdx"
    : base + ".md";
  fs.unlinkSync(filepath);
}
