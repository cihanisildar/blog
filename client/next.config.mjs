/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:3001/:path*", // Proxy to backend
        },
      ];
    },
    images: {
      domains: [
        "blogchains3bucket.s3.amazonaws.com",
        "blogchains3bucket.s3.us-east-1.amazonaws.com",
      ],
    },
  };
  
  export default nextConfig;
  