import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ja" data-brand="i-willink">
      <body>{children}</body>
    </html>
  );
}
