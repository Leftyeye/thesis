import { getAllTags, getPostsByTag } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}) {
  const tag = decodeURIComponent(params.tag);
  return { title: `#${tag} — LEFTYEYE` };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link
        href="/tags"
        className="inline-flex items-center gap-1 font-bold text-sm border-2 border-black px-3 py-1 shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-100 mb-10"
      >
        ← 所有标签
      </Link>

      <div className="mb-12">
        <div className="inline-block bg-brutal-yellow border-2 border-black px-3 py-1 text-sm font-bold shadow-brutal-sm mb-4">
          TAG
        </div>
        <h1 className="text-5xl font-bold leading-none">#{tag}</h1>
        <p className="text-gray-500 mt-2 font-medium">{posts.length} 篇文章</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
