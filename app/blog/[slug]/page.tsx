import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = getPostBySlug(params.slug);
    return { title: `${post.title} — LEFTYEYE` };
  } catch {
    return { title: "文章未找到" };
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="tag-brutal bg-brutal-yellow hover:shadow-brutal transition-all duration-100 text-xs"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 pb-6 border-b-2 border-black">
        <time>{new Date(post.date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</time>
        {post.category && (
          <>
            <span>·</span>
            <span className="text-slack-active">{post.category}</span>
          </>
        )}
      </div>

      {/* Content */}
      <article className="prose-brutal">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}
