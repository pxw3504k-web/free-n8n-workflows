import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // 性能优化
  compress: true, // 启用 gzip 压缩
  
  // 实验性功能
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'], // 优化大型库的导入
  },
  
  // 图片优化
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    formats: ['image/avif', 'image/webp'], // 使用现代图片格式
    minimumCacheTTL: 60 * 60 * 24 * 30, // 缓存 30 天
  },
  
  // 生产构建优化
  productionBrowserSourceMaps: false, // 禁用生产环境的 source maps
};

export default nextConfig;
