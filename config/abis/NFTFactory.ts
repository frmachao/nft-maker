export const NFTFactoryABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "description",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "maxSupply",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "mintPrice",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "imageUrl",
        type: "string"
      },
      {
        internalType: "bool",
        name: "whitelistOnly",
        type: "bool"
      },
      {
        internalType: "address[]",
        name: "initialWhitelist",
        type: "address[]"
      },
      {
        internalType: "uint256",
        name: "maxMintsPerWallet",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "mintStartTime",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "mintEndTime",
        type: "uint256"
      }
    ],
    name: "createCollection",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "creationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256"
      }
    ],
    name: "setCreationFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "collection",
        type: "address"
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        indexed: false,
        internalType: "string",
        name: "imageUrl",
        type: "string"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxSupply",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintPrice",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintStartTime",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintEndTime",
        type: "uint256"
      }
    ],
    name: "CollectionCreated",
    type: "event"
  }
] as const; 