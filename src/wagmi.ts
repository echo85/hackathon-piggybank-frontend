import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
} from 'wagmi/chains';

import { vMainnet } from './tenderly.config';
import { bleTestnet } from './ethena.config';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    sepolia,
    //bleTestnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [vMainnet] : []),

  ],
  ssr: true,
});