/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 配置图片域名优化
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ixqsqmftydqsibrjkuyc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // 优化图片加载
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128],
    formats: ['image/webp'],
  },
  
  // 配置 CORS 允许跨域访问
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
