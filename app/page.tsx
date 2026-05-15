import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="h-full overflow-y-auto">
      {/* Hero */}
      <section className="border-b-2 border-black bg-brutal-yellow px-8 py-16">
        <div className="max-w-2xl">
          <div className="inline-block bg-black text-brutal-yellow text-xs font-bold tracking-widest px-3 py-1 mb-5">
            PERSONAL BLOG
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-5">
            左椰椰
            <span className="text-3xl md:text-4xl font-bold text-black/50 ml-2">@Leftyeye</span>
          </h1>
          <p className="text-base font-medium max-w-sm leading-relaxed mb-8">
            设计、技术与思考。记录在构建产品路上的所见所想。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/blog" className="btn-brutal-black text-sm">
              阅读文章 →
            </Link>
            <Link href="/about" className="btn-brutal text-sm bg-white">
              关于我
            </Link>
          </div>
        </div>
      </section>

      {/* Recent posts */}
      <section className="px-8 py-12 max-w-4xl">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-block bg-brutal-yellow border-2 border-black px-3 py-1 text-xs font-bold shadow-brutal-sm mb-2">
              LATEST
            </div>
            <h2 className="text-2xl font-bold">最新文章</h2>
          </div>
          <Link
            href="/blog"
            className="font-bold text-sm border-b-2 border-black hover:bg-brutal-yellow transition-colors px-1"
          >
            查看全部 →
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="card-brutal p-10 text-center">
            <p className="text-lg font-bold mb-1">文章即将到来</p>
            <p className="text-gray-500 text-sm">
              在{" "}
              <code className="bg-brutal-yellow px-1 border border-black">
                content/posts/
              </code>{" "}
              下创建 .mdx 文件
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Tools section intentionally hidden — manage visibility from /admin */}
    </div>
  );
}
