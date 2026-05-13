"use client";

import { useState, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ResultDisplay from "@/components/ResultDisplay";
import { extractTextFromFile } from "@/lib/extractText";

const DEFAULT_PROMPT = `你是一个专业的学术论文格式化助手。用户会提供论文原文，你需要：

1. 识别并整理论文结构（标题、作者、摘要、关键词、引言、方法、结果、讨论、结论、参考文献等章节）
2. 统一标题层级格式（一级标题、二级标题等清晰区分）
3. 整理参考文献格式，统一为规范的学术引用格式
4. 修正明显的排版问题（多余空行、乱码、格式混乱等）
5. 保持原文内容不变，只改格式

请直接输出格式化后的完整论文文本，不需要额外解释。`;

export default function Home() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      let text: string;
      try {
        text = await extractTextFromFile(file);
      } catch {
        throw new Error("文件解析失败，请确认是有效的 PDF 或 Word 文件");
      }

      if (!text.trim()) {
        throw new Error("无法提取文字，请确认文件不是扫描版图片");
      }

      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, prompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "解析失败");
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">LeftyEye</span>
          <span className="text-sm text-gray-500">AI 工具集</span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            论文格式，交给 AI
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            上传 PDF 或 Word 文档，AI 自动整理结构、统一格式，省下排版的时间。
          </p>
        </div>
      </section>

      {/* Upload + Result */}
      <section className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-8">
        {/* Custom Prompt */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">自定义提示词</span>
            <svg
              className={`h-4 w-4 transition-transform ${showPrompt ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showPrompt && (
            <div className="border-t border-gray-200 p-4 space-y-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                className="w-full text-sm font-mono text-gray-800 border border-gray-200 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setPrompt(DEFAULT_PROMPT)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                恢复默认
              </button>
            </div>
          )}
        </div>

        <FileUpload onFile={handleFile} loading={loading} />
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {result && <ResultDisplay result={result} />}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-xs text-gray-400">
          leftyeye.cc · Powered by DeepSeek
        </div>
      </footer>
    </main>
  );
}
