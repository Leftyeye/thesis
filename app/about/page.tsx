export const metadata = {
  title: "关于我 — LEFTYEYE",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-block bg-brutal-yellow border-2 border-black px-3 py-1 text-sm font-bold shadow-brutal-sm mb-4">
          ABOUT
        </div>
        <h1 className="text-5xl font-bold leading-none">关于我</h1>
      </div>

      {/* Avatar + Intro */}
      <div className="card-brutal p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar placeholder */}
          <div className="w-24 h-24 bg-brutal-yellow border-2 border-black shadow-brutal flex-shrink-0 flex items-center justify-center text-4xl font-black">
            L
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">LEFTYEYE</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              设计师 & 开发者，热爱将美学与功能融合在一起。对 UI 设计、前端工程和写作都充满热情。
            </p>
            <div className="flex flex-wrap gap-2">
              {["设计", "Next.js", "TypeScript", "写作"].map((skill) => (
                <span key={skill} className="tag-brutal bg-brutal-yellow">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card-brutal p-6">
          <h3 className="font-bold text-lg mb-3 border-b-2 border-black pb-2">
            正在做的事
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="bg-brutal-yellow border border-black px-1 font-bold text-xs mt-0.5">→</span>
              构建 AI 工具
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-brutal-yellow border border-black px-1 font-bold text-xs mt-0.5">→</span>
              研究 Neo-Brutalism 设计
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-brutal-yellow border border-black px-1 font-bold text-xs mt-0.5">→</span>
              写关于设计与技术的文章
            </li>
          </ul>
        </div>

        <div className="card-brutal p-6">
          <h3 className="font-bold text-lg mb-3 border-b-2 border-black pb-2">
            联系方式
          </h3>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <span className="font-bold">Email</span>
              <br />
              <span className="text-gray-600">iminixcharlotte@gmail.com</span>
            </li>
            <li>
              <span className="font-bold">GitHub</span>
              <br />
              <span className="text-gray-600">@Leftyeye</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="border-l-4 border-black pl-6 py-4 bg-brutal-yellow border-2 shadow-brutal">
        <p className="font-bold text-xl leading-snug">
          "设计不是让东西看起来好看，而是让它运转得好。"
        </p>
      </blockquote>
    </div>
  );
}
