// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:3001/api/:path*", // Прокси на API-сервер
        },
      ];
    },
  };
  
  export default nextConfig;
  