import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getClient() {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY ?? "placeholder",
    baseURL: "https://api.deepseek.com",
  });
}

const SYSTEM_PROMPT = `你是一个专业的学术论文格式化助手。用户会提供论文原文，你需要：

1. 识别并整理论文结构（标题、作者、摘要、关键词、引言、方法、结果、讨论、结论、参考文献等章节）
2. 统一标题层级格式（一级标题、二级标题等清晰区分）
3. 整理参考文献格式，统一为规范的学术引用格式
4. 修正明显的排版问题（多余空行、乱码、格式混乱等）
5. 保持原文内容不变，只改格式

请直接输出格式化后的完整论文文本，不需要额外解释。`;


export async function POST(req: NextRequest) {
  const { text, prompt: customPrompt } = await req.json();
  const systemPrompt = customPrompt?.trim() || SYSTEM_PROMPT;

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "未收到文本内容" }, { status: 400 });
  }

  const truncated = text.slice(0, 30000);

  try {
    const completion = await getClient().chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: truncated },
      ],
      temperature: 0.3,
    });

    const result = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error("DeepSeek API error:", err);
    return NextResponse.json(
      { error: "AI 解析失败，请检查 API Key 是否正确" },
      { status: 500 }
    );
  }
}
