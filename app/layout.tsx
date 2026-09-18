import type { Metadata } from "next";
import { headers } from "next/headers";
import Shell from "./_components/Shell";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    title: "休闲游戏策略分析看板",
    description: "品类策略判断与单游戏证据双向连接的休闲游戏研究工作台。",
    openGraph: { title: "休闲游戏策略分析看板", description: "12个重点品类策略看板 · 单游戏证据详情", type: "website", images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "休闲游戏策略分析看板" }] },
    twitter: { card: "summary_large_image", title: "休闲游戏策略分析看板", description: "品类策略 · 游戏证据 · 专题研究", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><Shell>{children}</Shell></body></html>;
}
