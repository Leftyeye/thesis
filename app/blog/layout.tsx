import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import ArticleListPanel from "@/components/ArticleListPanel";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllPosts();

  return (
    <div className="flex h-full overflow-hidden">
      <Suspense fallback={<div className="w-60 flex-shrink-0 border-r border-black bg-slack-panel" />}>
        <ArticleListPanel posts={posts} />
      </Suspense>
      <div className="flex-1 overflow-y-auto bg-white">{children}</div>
    </div>
  );
}
