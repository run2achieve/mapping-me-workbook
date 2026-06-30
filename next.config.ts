import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGitHubPages ? "export" : undefined,
  trailingSlash: isGitHubPages,
  basePath: isGitHubPages ? "/mapping-me-workbook" : undefined,
  assetPrefix: isGitHubPages ? "/mapping-me-workbook/" : undefined
};

export default nextConfig;
