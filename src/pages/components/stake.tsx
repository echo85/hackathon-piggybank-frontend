import { erc20Abi, Address } from "viem";
import { sepolia } from 'wagmi/chains'
import { parseUnits, formatUnits } from 'viem';
import { useWriteContract, useSimulateContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { type BaseError, useWalletClient, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { contractABI } from "../../utils/contractabi";

export default function StakeView(
    {
        taker, 
        usdeAddress,
        contractAddress,
        activeTab,
        isConnected
    } : 
    {
        taker: Address;
        usdeAddress: Address ;
        contractAddress: Address;
        activeTab: String;
        isConnected: Boolean;
    }
) {
const [amount, setAmount] = useState<string>('');
const { data: walletClient } = useWalletClient();
const { chain } = useAccount();

const { data: balanceData, isLoading } = useReadContract({
    address: usdeAddress,
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

const { data: allowance } = useReadContract({
  address: usdeAddress,
  abi: erc20Abi,
  functionName: "allowance",
  args: [taker, contractAddress],
});

const handleDeposit = async () => {
    try {
      writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'deposit',
        args: [parseUnits(amount,18), taker],
      })
      
    } catch (error) {
      console.error('Error during transaction:', error);
    }
  };

  var token;
  if(chain && (chain.id == 1 || chain.id == 73571))
    token = "ETH"
  else 
    token = "Piggy"

    return (
<div className="space-y-4">
<p className="mt-6 text-lg md:text-sm text-gray leading-relaxed">
        This vault is a combination of (sUSDe + {token} Token)
      </p>
              <input
                                type="number"
                                placeholder="Amount of USDe to Deposit"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                            />
                            <div className="flex justify-between items-center">
        
                               <BalancePiggyView taker={taker} activeTab={activeTab}/>
                               {isConnected && <button
                                    onClick={handleMaxClick}
                                    className="text-indigo-500 text-sm font-semibold"
                                >
                                    Max
                                </button>}
                            </div>
                           
                            
                            <ButtonView
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
scontract = usdeAddress;
symbol = "USDe";

const { data: balancePiggy, isLoading } = useReadContract({
  address: scontract,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [taker],
  account: taker,
});

return(balancePiggy &&
  <div className="flex justify-between items-center">
  <span className="text-sm text-gray-500">
   Balance on {chain?.name}: {isLoading ? 'Loading...' : `${parseFloat(formatUnits(balancePiggy, 18)).toFixed(2)}`} {symbol}
  </span>
  </div>
)};

function ButtonView({
  taker,
  activeTab
}: {
  taker: Address;
  activeTab: String;
}) {
 
      return(
        <ApproveOrReviewButton 
        taker={taker} 
        activeTab={activeTab}
        />
      )
}

  function ApproveOrReviewButton({
    taker,
    activeTab
  }: {
    taker: Address;
    activeTab: String;
  }) {

    const { data: allowance, refetch } = useReadContract({
      address: usdeAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args: [taker, contractAddress],
    });
    console.log(allowance);

    const { data } = useSimulateContract({
      address: usdeAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [contractAddress, parseUnits(amount,18)],
    });

        const {
          data: writeContractResult,
          writeContractAsync: writeContract,
          error,
        } = useWriteContract();
    
        const { data: approvalReceiptData, isLoading: isApproving, isSuccess: isSuccess } =
          useWaitForTransactionReceipt({
            hash: writeContractResult,
          });

      useEffect(() => {
        console.log(data);
        if (data) {
          refetch();
        }
      }, [data, refetch]);

      if (error) {
        return <div>Something went wrong: {error.message}</div>;
      }

          if (allowance === 0n) {
            return( 
              <button
                      onClick={async () => {
                        await writeContract({
                          abi: erc20Abi,
                          address: usdeAddress,
                          functionName: "approve",
                          args: [contractAddress, parseUnits(amount,18)],
                        });
                        console.log("approving spender to spend sell token");
                        console.log("approvata");
                        refetch();
                      }}
                      disabled={!walletClient || !amount || isPending}
                      className={`w-full px-4 py-2 text-white rounded-lg ${
                        !walletClient || !amount
                          ? 'bg-gray-400'
                          : 'bg-indigo-500 hover:bg-indigo-600'
                      }`}
                    >
                      {isApproving ? 'Approving...' : 'Approve'}
                    </button>
            )
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
                  {isPending ? 'Confirming...' : 'Deposit'}
                </button>
        )
  }
}