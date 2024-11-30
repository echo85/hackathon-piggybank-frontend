import { defineChain } from 'viem'

export const bleTestnet = defineChain({
  id: 52085143,
  name: 'Ble Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.rpc.ethena.fi'] }
  },
  blockExplorers: {
    default: {
      name: 'Ethena Explorer',
      url: 'https://testnet.explorer.ethena.fi'
    }
  },
  contracts: {
    usdeToken: {
      address: '0x426E7d03f9803Dd11cb8616C65b99a3c0AfeA6dE'
    }
  }
})