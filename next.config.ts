import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mobimatterstorage.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
      {
        protocol: "https",
        hostname: "api.mobimatter.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
