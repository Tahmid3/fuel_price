import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const basePath = isGithubActions && repoName ? `/${repoName}` : '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
