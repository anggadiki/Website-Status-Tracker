import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  allowedDevOrigins: ["http://192.168.1.21:3000", "http://localhost:3000"],
};

export default nextConfig;
