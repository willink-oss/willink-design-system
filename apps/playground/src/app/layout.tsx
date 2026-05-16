import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

import "./globals.css";

/**
 * Noto Sans JP — i-Willink brand font (matches i-willink.com / clublink.jp).
 * Loaded via next/font/google for self-hosted woff2 + automatic fallback
 * metric adjustment. Sets `--font-sans` so the tailwind-preset font stack
 * actually resolves to the brand face rather than a generic system font.
 */
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "willink-design-system playground",
  description: "i-Willink Design System tokens & components preview",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
