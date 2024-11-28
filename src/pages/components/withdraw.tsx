
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { erc20Abi, Address } from "viem";
import { parseUnits, formatUnits } from 'viem';
import { useWriteContract, useSimulateContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { type BaseError, useWalletClient } from 'wagmi';
import { useState, useEffect } from 'react';
import { contractABI } from "../../utils/contractabi";

export default function WitdrawView(
    {
        taker, 
        usdeAddress,
        contractAddress,
        activeTab
    } : 
    {
        taker: Address;
        usdeAddress: Address;
        contractAddress: Address;
        activeTab: String
    }
) {
const [amount, setAmount] = useState<string>('');
const { data: walletClient } = useWalletClient();
var amountAvailable = 0;

const { data: balanceData, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'cooldowns',
    args: [taker],
    account: taker,
});

interface Output {
  cooldownEnd: number;
  underlyingAmount: number;
}

if(balanceData && Array.isArray(balanceData)) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    console.log("Current"+currentTimestamp);
    
    if(currentTimestamp > balanceData[0])
        amountAvailable = balanceData[1];
    }
const handleMaxClick = () => {
if (balanceData && Array.isArray(balanceData) ) {

  const maxAmount = formatUnits(BigInt(amountAvailable), 18); 
  setAmount(maxAmount);
}
};
// Simulazione della transazione
const { data } = useSimulateContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'unstake',
  args: [parseUnits(amount || '0', 18)], 
});

const { data: hash, error, isPending, writeContract } = useWriteContract();

const handleDeposit = async () => {
    try {
      writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'unstake',
        args: [taker],
      })
      
    } catch (error) {
      console.error('Error during transaction:', error);
    }
  };

    return (
<div className="space-y-4">
            <BalancePiggyView taker={taker} activeTab={activeTab}/>

              <input
                                type="number"
                                placeholder="Amount to withdraw"
                                value={amountAvailable}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                                disabled
                            />
                            <div className="flex justify-between items-center">
  <span className="text-sm text-gray-500">
  USDe will be available to withdraw 7 days after unstaking.
  </span>
  
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
symbol = "USDe";
 
const { data, isLoading } = useReadContract({
  address: scontract,
  abi: contractABI,
  functionName: 'cooldowns',
  args: [taker],
  account: taker,
});
if(data && Array.isArray(data)) {
const currentTimestamp = Math.floor(Date.now() / 1000);
if(currentTimestamp > data[0])
    amountAvailable = data[1];
}
return(
  <div className="flex justify-between items-center">
  <span className="text-sm text-gray-500">
    The available {symbol} amount to withdraw is:
  </span>
  
</div>
)};

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
                  disabled={!walletClient || !amountAvailable || isPending}
                  className={`w-full px-4 py-2 text-white rounded-lg ${
                    !walletClient || !amountAvailable
                      ? 'bg-gray-400'
                      : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  {isPending ? 'Confirming...' : 'Withdraw'}
                </button>
        )
  } 
}