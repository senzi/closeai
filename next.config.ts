import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 纯静态托管：构建直接产出 out/ 静态文件。
  // 站点无 API 路由 / SSR，所有页面均为静态预渲染（?r= 直链由客户端处理）。
  output: "export",
};

export default nextConfig;
