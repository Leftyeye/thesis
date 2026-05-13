"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
  onFile: (file: File) => void;
  loading: boolean;
}

const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function FileUpload({ onFile, loading }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED.includes(file.type)) {
        alert("请上传 PDF 或 Word (.docx) 文件");
        return;
      }
      setFileName(file.name);
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors px-8 py-16 cursor-pointer
        ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"}
        ${loading ? "pointer-events-none opacity-60" : ""}
      `}
      onClick={() => !loading && document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={onInputChange}
        disabled={loading}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm font-medium">AI 正在解析中，请稍候…</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-gray-500 select-none">
          <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0-3 3m3-3 3 3M4.5 19.5h15a1.5 1.5 0 001.5-1.5v-9a1.5 1.5 0 00-1.5-1.5H15l-1.5-3h-3L9 7.5H4.5A1.5 1.5 0 003 9v9a1.5 1.5 0 001.5 1.5z" />
          </svg>
          <div className="text-center">
            <p className="font-medium text-gray-700">
              {fileName ? fileName : "点击或拖拽文件至此处"}
            </p>
            <p className="text-sm mt-1">支持 PDF、Word (.docx)</p>
          </div>
        </div>
      )}
    </div>
  );
}
