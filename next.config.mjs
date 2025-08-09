// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import withPWA from 'next-pwa';

const pwaOptions = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
};

const nextConfig = {
  reactStrictMode: true,
  // supprime experimental.appDir
};

export default withPWA(pwaOptions)(nextConfig);



