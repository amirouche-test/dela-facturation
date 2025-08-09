// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  });
  
  module.exports = withPWA({
    experimental: {
      appDir: true, // actif pour Next.js 13+ avec app/
    },
    reactStrictMode: true,
  });
  
