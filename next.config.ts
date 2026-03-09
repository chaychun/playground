import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pasgu7dzhuxgk8ea.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
