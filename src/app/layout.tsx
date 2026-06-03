import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "建築会社スタッフアプリ",
  description: "建築会社向け従業員コンディション管理・予定共有・事務連絡アプリ",
  openGraph: {
    title: "建築会社スタッフアプリ",
    description: "従業員のコンディション管理・予定共有・事務連絡をサポート",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
