/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/KOL-INFO-GATHERER',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'p16-sign-va.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p77-sign-va.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p16-sign.tiktokcdn-us.com' },
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
    ],
  },
};
module.exports = nextConfig;
