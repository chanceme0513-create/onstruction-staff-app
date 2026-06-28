import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STAPO",
  description: "従業員コンディション管理・サーベイ・チームコミュニケーションツール",
  openGraph: {
    title: "STAPO",
    description: "従業員のコンディション管理・サーベイ・チームコミュニケーションをサポート",
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
