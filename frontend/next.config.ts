import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Suppress telemetry errors from Base Account using webpack module replacement
  // Note: This requires using --webpack flag with Next.js 16+ (Turbopack is default)
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Replace Base Account telemetry initialization with a no-op
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@base-org\/account\/src\/core\/telemetry\/initCCA/,
          require.resolve('./lib/noop-telemetry.ts')
        )
      );
    }
    return config;
  },
};

export default nextConfig;
