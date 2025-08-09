// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
});

export default nextConfig;

