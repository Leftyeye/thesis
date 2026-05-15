"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "首页",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/blog",
    label: "文章",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: "/tags",
    label: "标签",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "关于",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  // Tools hidden — add items here when ready to publish
  // { href: "/tools", label: "工具", icon: ... }
];

export default function IconSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-14 bg-slack-sidebar flex flex-col items-center py-3 gap-1 flex-shrink-0 border-r border-black">
      {/* Logo */}
      <Link href="/" title="左椰椰 @Leftyeye" className="w-9 h-9 bg-black flex items-center justify-center font-black text-slack-sidebar text-sm mb-3 border-2 border-black hover:scale-105 transition-transform">
        椰
      </Link>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {items.map(({ href, label, icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`w-10 h-10 flex items-center justify-center transition-all duration-100 group relative rounded-sm ${
                active
                  ? "bg-black text-slack-sidebar"
                  : "text-black/60 hover:bg-black/10 hover:text-black"
              }`}
            >
              {icon}
              <span className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Admin */}
      <Link
        href="/admin"
        title="后台管理"
        className="w-10 h-10 flex items-center justify-center text-black/40 hover:bg-black/10 hover:text-black transition-all duration-100 rounded-sm group relative"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        </svg>
        <span className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          管理后台
        </span>
      </Link>
    </aside>
  );
}
