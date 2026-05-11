import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "willink-design-system playground",
  description: "i-Willink Design System tokens & brand axes preview",
};

/**
 * playground は internal dev / preview ツール。Google Fonts の build-time
 * 取得は network 依存で flaky なため、preset.css の `--font-sans` (system-ui
 * + Noto Sans JP fallback stack) をそのまま利用する。consumer (i-willink.com /
 * clublink-platform 等) は production で `next/font/google` を併用してよい。
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" data-brand="willink">
      <body className="antialiased">{children}</body>
    </html>
  );
}
