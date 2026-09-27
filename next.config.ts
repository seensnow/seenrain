import type { NextConfig } from 'next';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'seenrain';
const basePath = process.env.GITHUB_PAGES === 'true' ? `/${repositoryName}` : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
