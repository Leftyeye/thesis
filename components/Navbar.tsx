"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/blog", label: "文章" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b-3 border-black bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-bold text-xl bg-brutal-yellow border-2 border-black px-3 py-1 shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-100"
        >
          LEFTYEYE
        </Link>

        <div className="flex gap-1">
          {links.map(({ href, label }) => {
            const active =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`font-bold px-4 py-1.5 border-2 border-transparent transition-all duration-100 hover:border-black hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                  active
                    ? "border-black bg-brutal-yellow shadow-brutal-sm"
                    : ""
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
