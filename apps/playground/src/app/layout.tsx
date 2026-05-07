import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "willink-design-system playground",
  description: "i-Willink Design System tokens & brand axes preview",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" data-brand="i-willink" className={notoSansJP.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
