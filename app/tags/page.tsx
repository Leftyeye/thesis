import { getAllTags } from "@/lib/posts";
import Link from "next/link";

export const metadata = {
  title: "标签 — LEFTYEYE",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="inline-block bg-brutal-yellow border-2 border-black px-3 py-1 text-sm font-bold shadow-brutal-sm mb-4">
          TAGS
        </div>
        <h1 className="text-5xl font-bold leading-none">标签</h1>
      </div>

      {tags.length === 0 ? (
        <div className="border-2 border-black p-12 text-center shadow-brutal">
          <p className="text-xl font-bold">暂无标签</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="card-brutal px-5 py-3 flex items-center gap-3 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-100 group"
            >
              <span className="font-bold text-lg group-hover:underline decoration-2">
                #{tag}
              </span>
              <span className="bg-brutal-yellow border-2 border-black px-2 py-0.5 text-xs font-bold shadow-brutal-sm">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
