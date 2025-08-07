import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "i.vimeocdn.com",
      // інші домени, які ти вже використовуєш
    ],
  },
  /* config options here */
  //devIndicators: false,
};

export default nextConfig;
