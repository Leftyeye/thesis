import type { Metadata } from "next";
import "./globals.css";
import IconSidebar from "@/components/IconSidebar";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "左椰椰 @Leftyeye",
  description: "设计、技术与思考",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="bg-white text-black antialiased h-screen overflow-hidden flex">
        <IconSidebar />
        <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
