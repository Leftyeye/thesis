# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

This is a Next.js 14 (App Router) single-page AI tool. The main feature: user uploads a PDF or Word document → text is extracted client-side → sent to a backend API route → DeepSeek formats it.

**Key design decision**: Text extraction happens entirely in the browser (`lib/extractText.ts`) before anything is sent to the server. This bypasses Vercel's 4.5MB request body limit, since Word files with images can be large but their text content is small.

### Data flow

1. `app/page.tsx` — manages state (prompt, result, loading, error), calls `extractTextFromFile()`, then POSTs `{ text, prompt }` as JSON to `/api/parse`
2. `lib/extractText.ts` — browser-side extraction: mammoth (`.docx`) and pdfjs-dist (`.pdf`)
3. `app/api/parse/route.ts` — receives `{ text, prompt }`, truncates to 30k chars, calls DeepSeek via OpenAI-compatible client, returns `{ result }`

### Components

- `components/FileUpload.tsx` — drag-and-drop + click upload, accepts `.pdf` and `.docx` only
- `components/ResultDisplay.tsx` — displays result with copy and `.txt` download buttons

### DeepSeek integration

Uses the `openai` npm package pointed at `https://api.deepseek.com`. Model: `deepseek-chat`. Requires `DEEPSEEK_API_KEY` in `.env.local`.

The system prompt lives in two places: default defined in `app/page.tsx` (`DEFAULT_PROMPT`) shown in the editable UI textarea, and the API route uses whatever prompt is sent in the request body (falling back to `SYSTEM_PROMPT` constant if empty).

## Environment

```
DEEPSEEK_API_KEY=sk-...
```

## Deployment

Deployed on Vercel. Git proxy configured in `~/.gitconfig` to use Shadowrocket on `127.0.0.1:1082`. Push via GitHub Desktop or terminal after ensuring Shadowrocket is running.
