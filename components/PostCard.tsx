import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const COVER_COLORS = [
  "bg-brutal-yellow",
  "bg-blue-200",
  "bg-pink-200",
  "bg-green-200",
  "bg-orange-200",
  "bg-purple-200",
];

function getColor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}

export default function PostCard({ post }: { post: PostMeta }) {
  const color = post.coverColor ?? getColor(post.slug);

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="card-brutal transition-all duration-100 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-brutal-lg h-full flex flex-col">
        {/* Color strip */}
        <div className={`${color} border-b-2 border-black h-2`} />

        <div className="p-5 flex flex-col flex-1">
          {/* Date */}
          <time className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            {new Date(post.date).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          {/* Title */}
          <h2 className="text-xl font-bold leading-tight mb-3 group-hover:underline decoration-2 underline-offset-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-brutal bg-white">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
