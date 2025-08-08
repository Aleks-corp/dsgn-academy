import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
        port: "",
        pathname: "/video/**",
      },
    ],
  },
  /* config options here */
  //devIndicators: false,
};

export default nextConfig;
