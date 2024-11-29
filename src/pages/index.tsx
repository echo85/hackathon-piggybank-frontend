import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { type BaseError, useAccount, useWalletClient } from 'wagmi';
import { useWriteContract, useSimulateContract, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { usdeABI } from "../utils/usdeabi";
import { contractABI } from "../utils/contractabi";
import StakeView from "./components/stake";
import UnstakeView from "./components/unstake";
import WithdrawView from "./components/withdraw";
import { erc20Abi, Address } from "viem";

export const Home: NextPage = () => {
const { address, isConnected, chain } = useAccount();
const [activeTab, setActiveTab] = useState("Stake");

var contractAddress: Address;
var usdeAddress: Address;
if(chain && chain.id == 1) { //Ethereum Mainnet
  contractAddress = '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3'; // Smart Piggy Contract 
  usdeAddress = '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3';  //USDe
}
else if(chain && chain.id == 73571) { //Virtual TestNet on Tenderly (Fork of Mainnet)
  contractAddress = '0xB90FfB53387751dc2ff0eEFC890a628BE5d29254'; // Smart Piggy Contract
  usdeAddress = '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3';  //USDe
}
else { //Sepolia
  contractAddress = '0x4E91C2E99e0f4D1584156EA19A716AbDAFBD8359'; // Smart Piggy Contract
  usdeAddress = '0xf805ce4F96e0EdD6f0b6cd4be22B34b92373d696';  //USDe
}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Head>
        <title>PiggyBank</title>
        <meta
          content="Piggy Bank "
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      
      <div data-theme>
      <div className="flex justify-center items-center bg-gray-0 p-3">
      {<ConnectButton />}
        </div>
     
        <div className="flex justify-center items-center bg-gray-0 p-3">
             <img src="/logo.png" width="200px" alt="Piggy Bank" className="h-auto max-w-xsd" />
        </div>

        <section className="flex items-center justify-center">
    <div className="max-w-4xl text-center">
      <h1 className="text-4xl md:text-2xl font-extrabold bg-gradient-to-r from-red-400 to-yellow-600 text-transparent bg-clip-text">
        Earn, Stake, and Speculate with Confidence
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray leading-relaxed">
        Welcome to <span className="font-semibold text-black">Pyggy Bank</span>, the ultimate platform for combining 
        steady returns with bold speculation.
      </p>
      <div className="mt-8 space-y-3">
        <div className="p-3 rounded-lg">
          <h2 className="text-xl font-bold text-black">How It Works</h2>
          <ul className="mt-4 text-left text-gray space-y-4">
            <li>
              <span className="font-bold text-black">1.</span> <strong>Stake Your USDe</strong>: Deposit USDe and earn consistent <strong>APY (29% currently)</strong>
            </li>
            <li>
              <span className="font-bold text-black">2.</span> <strong>Automated Speculative Growth</strong>: Accrued yield reinvested every 7 days into ERC-20 tokens, including meme coins.
            </li>
            <li>
              <span className="font-bold text-black">3.</span> <strong>Seamless Redemption</strong>: Withdraw your initial USDe plus any speculative returns after a cooldown of 7 days.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
        
          <div className="max-w-md mx-auto p-4">
          {/* Tabs */}
          <div className="flex border-b border-gray-300">
            {["Stake", "Unstake", "Withdraw"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 px-4 text-center font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
  
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-lg mt-4">
            <h2 className="text-lg font-bold mb-2">{activeTab}</h2>

            <TabView 
                 taker={address!}
                 usdeAddress={usdeAddress}
                 contractAddress={contractAddress}
                 activeTab={activeTab}
                 isConnected={isConnected}
            />
           
          </div>
        </div>    
      </div>
     
    </div>
  );

function TabView ({
    taker, 
    usdeAddress,
    contractAddress,
    activeTab,
    isConnected
} : 
{
    taker: Address;
    usdeAddress: Address | undefined;
    contractAddress: Address | undefined;
    activeTab: String
    isConnected: Boolean
}) {
  if(activeTab == "Stake") {
    return(
      <StakeView 
                 taker={taker}
                 usdeAddress={usdeAddress!}
                 contractAddress={contractAddress!}
                 activeTab={activeTab}
                 isConnected={isConnected}
            />
    )
  }
  else if (activeTab == "Unstake") {
    return(
      <UnstakeView 
                 taker={taker}
                 usdeAddress={usdeAddress!}
                 contractAddress={contractAddress!}
                 activeTab={activeTab}
                 isConnected={isConnected}
            />
    )
  }
  else {
    return(
      <WithdrawView
                 taker={taker}
                 usdeAddress={usdeAddress!}
                 contractAddress={contractAddress!}
                 activeTab={activeTab}
                 isConnected={isConnected}
            />
    )
  }
}

};

export default Home;