/** @type {import('next').NextConfig} */
const isPagesEnv = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isPagesEnv ? "/Codex1" : "",
  assetPrefix: isPagesEnv ? "/Codex1/" : "",
};

export default nextConfig;
