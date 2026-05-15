"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("密码错误");
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-slack-panel">
      <div className="border-2 border-black shadow-[4px_4px_0_#000] bg-white p-8 w-80">
        <div className="mb-6">
          <div className="inline-block bg-brutal-yellow border-2 border-black px-3 py-1 text-xs font-black tracking-widest mb-3">
            ADMIN
          </div>
          <h1 className="text-2xl font-black">后台管理</h1>
          <p className="text-sm text-gray-500 mt-1">输入密码继续</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            autoFocus
            className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:shadow-[2px_2px_0_#000] font-medium"
          />
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full border-2 border-black bg-brutal-yellow py-2 text-sm font-bold shadow-[2px_2px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000] transition-all duration-100"
          >
            进入后台 →
          </button>
        </form>
      </div>
    </div>
  );
}
