export const contractABI = [
    {
      type: "function",
      name: "deposit",
      inputs: [
        {
          "name": "assets",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "receiver",
          "type": "address",
          "internalType": "address"
        }
      ],
      outputs: [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      stateMutability: "nonpayable"
    },
        {
            type: "function",
            name: "cooldownShares",
            inputs: [
                {
                    "name": "shares",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            outputs: [
                {
                    "name": "assets",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            stateMutability: "nonpayable"
        },
        {
            type: "function",
            name: "cooldowns",
            inputs: [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            outputs: [
                {
                    "name": "cooldownEnd",
                    "type": "uint104",
                    "internalType": "uint104"
                },
                {
                    "name": "underlyingAmount",
                    "type": "uint152",
                    "internalType": "uint152"
                }
            ],
            stateMutability: "view"
        } ,
        {
            type: "function",
            name: "unstake",
            inputs: [
                {
                    "name": "_receiver",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            outputs: [],
            stateMutability: "nonpayable"
        }
  ];