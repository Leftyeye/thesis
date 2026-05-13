import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeftyEye",
  description: "AI 论文格式化工具",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
