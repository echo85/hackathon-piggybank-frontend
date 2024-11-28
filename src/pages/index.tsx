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
const { address, isConnected } = useAccount();
const [activeTab, setActiveTab] = useState("Stake");


// Indirizzo e ABI del contratto
const contractAddress = '0xB90FfB53387751dc2ff0eEFC890a628BE5d29254'; // Smart Piggy Contract
//const usdeAddress = '0xf805ce4F96e0EdD6f0b6cd4be22B34b92373d696'; // Sepolia
const usdeAddress = '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3';  //MainNet

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
       
      <ConnectButton />
        <div className="flex justify-center items-center bg-gray-0 p-3">
             <img src="/logo.png" width="200px" alt="Piggy Bank" className="h-auto max-w-xsd" />
        </div>
        
        
        
       
        
        {!isConnected ? (
           <ConnectButton />
         
        ) : (
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
    
          {/* Contenuto */}
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-lg mt-4">
            <h2 className="text-lg font-bold mb-2">{activeTab}</h2>

            <TabView 
                 taker={address!}
                 usdeAddress={usdeAddress}
                 contractAddress={contractAddress}
                 activeTab={activeTab}
            />
           
          </div>
        </div>
            
          
        )}
      </div>

      

     
    </div>
  );

function TabView ({
    taker, 
    usdeAddress,
    contractAddress,
    activeTab
} : 
{
    taker: Address;
    usdeAddress: Address | undefined;
    contractAddress: Address | undefined;
    activeTab: String
}) {
  if(activeTab == "Stake") {
    return(
      <StakeView 
                 taker={taker}
                 usdeAddress={usdeAddress!}
                 contractAddress={contractAddress!}
                 activeTab={activeTab}
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
            />
    )
  }
}

};

export default Home;
