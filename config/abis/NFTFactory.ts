import { parseAbiItem } from "viem";
export const CollectionCreatedEvent = parseAbiItem(
  'event CollectionCreated(' +
      'address indexed creator, ' +
      'address indexed collection, ' +
      'string name, ' +
      'string imageUrl, ' +
      'uint256 maxSupply, ' +
      'uint256 mintPrice, ' +
      'uint256 mintStartTime, ' +
      'uint256 mintEndTime, ' +
      'bool whitelistOnly, ' +
      'uint256 maxMintsPerWallet' +
  ')'
)

export const NFTFactoryABI = [
  CollectionCreatedEvent,
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
] as const; 