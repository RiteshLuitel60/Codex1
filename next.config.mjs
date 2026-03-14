/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const basePath = isGithubPages && repoName ? `/${repoName}` : '';

const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  ...(isGithubPages
    ? {
        output: 'export',
        images: { unoptimized: true },
        basePath,
        assetPrefix: `${basePath}/`
      }
    : {})
};

export default nextConfig;
