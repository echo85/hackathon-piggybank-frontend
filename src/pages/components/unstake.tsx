
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { erc20Abi, Address } from "viem";
import { parseUnits, formatUnits } from 'viem';
import { useWriteContract, useSimulateContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { type BaseError, useWalletClient } from 'wagmi';
import { useState, useEffect } from 'react';
import { contractABI } from "../../utils/contractabi";

export default function UnstakeView(
    {
        taker, 
        usdeAddress,
        contractAddress,
        activeTab,
        isConnected

    } : 
    {
        taker: Address;
        usdeAddress: Address;
        contractAddress: Address;
        activeTab: String;
        isConnected: Boolean;
    }
) {
const [amount, setAmount] = useState<string>('');
const { data: walletClient } = useWalletClient();
// Leggi il saldo di USDe dell'utente
const { data: balanceData, isLoading } = useReadContract({
    address: contractAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [taker],
    account: taker,
});

const handleMaxClick = () => {
if (balanceData) {

  const maxAmount = formatUnits(balanceData, 18); 
  setAmount(maxAmount);
}
};
// Simulazione della transazione
const { data } = useSimulateContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'deposit',
  args: [parseUnits(amount || '0', 18)], 
});

const { data: hash, error, isPending, writeContract } = useWriteContract();

const handleDeposit = async () => {
    try {
      writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'cooldownShares',
        args: [parseUnits(amount,18)],
      })
      
    } catch (error) {
      console.error('Error during transaction:', error);
    }
  };

    return (
<div className="space-y-4">
              <input
                                type="number"
                                placeholder="Amount to Unstake"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                            />
                            <div className="flex justify-between items-center">
        
                               <BalancePiggyView taker={taker} activeTab={activeTab}/>
                               {isConnected && 
                                <button
                                    onClick={handleMaxClick}
                                    className="text-indigo-500 text-sm font-semibold"
                                >
                                    Max
                                </button>}
                            </div>
                           
                            
                            <UnstakeButton 
                                taker={taker} 
                                activeTab={activeTab}
                                />
              {error && (
                  <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )}
              
            </div>);

function BalancePiggyView({
  taker,
  activeTab
}: {
  taker: Address;
  activeTab: String;
}) {
console.log(taker);
var scontract;
var symbol;
scontract = contractAddress;
symbol = "pUSDe";
 
const { data: balancePiggy, isLoading } = useReadContract({
  address: scontract,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [taker],
  account: taker,
});

if(balancePiggy) {
  return(
    <div className="flex justify-between items-center">
    <span className="text-sm text-gray-500">
        Balance: {isLoading ? 'Loading...' : `${formatUnits(balancePiggy, 18)}`} {symbol}
    </span>
    
  </div>
  )
} else {
  return(
    <div className="flex justify-between items-center">
    <span className="text-sm text-gray-500">
        Balance: 0 {symbol}
    </span>
    
  </div>
  )};
}

  function UnstakeButton({
    taker,
    activeTab
  }: {
    taker: Address;
    activeTab: String;
  }) {


    const { data } = useSimulateContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "cooldownShares",
      args: [contractAddress, parseUnits(amount,18)],
    });

        // Define useWriteContract for the 'approve' operation
        const {
          data: writeContractResult,
          writeContractAsync: writeContract,
          error,
        } = useWriteContract();
    
        // useWaitForTransactionReceipt to wait for the approval transaction to complete
        const { data: approvalReceiptData, isLoading: isApproving } =
          useWaitForTransactionReceipt({
            hash: writeContractResult,
          });

       
      if (error) {
        return <div>Something went wrong: {error.message}</div>;
      }

         

        return( 
          <button
                  onClick={handleDeposit}
                  disabled={!walletClient || !amount || isPending}
                  className={`w-full px-4 py-2 text-white rounded-lg ${
                    !walletClient || !amount
                      ? 'bg-gray-400'
                      : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  {isPending ? 'Confirming...' : 'Unstake'}
                </button>
        )
  } 
}