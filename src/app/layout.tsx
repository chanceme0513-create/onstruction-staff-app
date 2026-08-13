import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STAPO",
  description: "従業員コンディション管理・サーベイ・チームコミュニケーションツール",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "STAPO",
  },
  openGraph: {
    title: "STAPO",
    description: "従業員のコンディション管理・サーベイ・チームコミュニケーションをサポート",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF7A35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
