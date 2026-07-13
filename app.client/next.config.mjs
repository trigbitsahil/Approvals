/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify: true, // Enabled by default in recent versions
  experimental: {
    // appDir: true, // Enabled by default in Next.js 13+
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
