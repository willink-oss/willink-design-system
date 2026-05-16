/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@willink-labs/tailwind-preset",
    "@willink-labs/tokens",
    "@willink-labs/react",
  ],
  // GitHub Pages deploy: static export under /willink-design-system/
  // Activated only when NEXT_PUBLIC_BASE_PATH is set (CI/Pages); dev server
  // (pnpm dev) remains a regular Next.js server with no basePath.
  output: process.env.NEXT_PUBLIC_BASE_PATH ? "export" : undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: !!process.env.NEXT_PUBLIC_BASE_PATH,
  },
  trailingSlash: !!process.env.NEXT_PUBLIC_BASE_PATH,
};

export default nextConfig;
