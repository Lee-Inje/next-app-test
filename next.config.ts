import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 프론트 요청 주소
        destination: 'http://localhost:4000/:path*' // 실제 API 서버
      }
    ];
  }
};

export default nextConfig;
