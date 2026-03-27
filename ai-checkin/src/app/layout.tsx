import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 知识打卡 - 团队 AI 学习平台",
  description: "每天一点 AI 知识，武装你的团队",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
