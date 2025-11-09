import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, holesky, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'DeFi Karma',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [sepolia, holesky, mainnet],
  ssr: true,
});

