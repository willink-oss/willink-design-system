/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@willink-labs/tailwind-preset",
    "@willink-labs/tokens",
    "@willink-labs/react",
  ],
};

export default nextConfig;
