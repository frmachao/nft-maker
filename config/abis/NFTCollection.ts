import { parseAbiItem } from "viem";
const pausedAbi = parseAbiItem(
  "function paused() external view returns (bool)"
);
// 白名单管理相关的 ABI
const whitelistAbi = {
  functions: {
    addToWhitelist: parseAbiItem(
      "function addToWhitelist(address[] calldata addresses) external"
    ),
    removeFromWhitelist: parseAbiItem(
      "function removeFromWhitelist(address[] calldata addresses) external"
    ),
    // 查询白名单状态
    whitelist: parseAbiItem(
      "function whitelist(address) external view returns (bool)"
    ),
    // 查询白名单模式
    whitelistOnly: parseAbiItem(
      "function whitelistOnly() external view returns (bool)"
    ),
  },
  events: {
    whitelistAdded: parseAbiItem("event WhitelistAdded(address[] addresses)"),
    whitelistRemoved: parseAbiItem(
      "event WhitelistRemoved(address[] addresses)"
    ),
  },
} as const;
export const NFTCollectionABI = [
  pausedAbi,
  whitelistAbi.functions.addToWhitelist,
  whitelistAbi.functions.removeFromWhitelist,
  whitelistAbi.functions.whitelist,
  whitelistAbi.functions.whitelistOnly,
  whitelistAbi.events.whitelistAdded,
  whitelistAbi.events.whitelistRemoved,
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "initDescription",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_maxSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_mintPrice",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
      {
        internalType: "string",
        name: "imageUrl",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "initialWhitelist",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_maxMintsPerWallet",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_mintStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_mintEndTime",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "image",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxMintsPerWallet",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintEndTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintStartTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "mintsPerWallet",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "remainingMints",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newPrice",
        type: "uint256",
      },
    ],
    name: "setMintPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintPrice",
        type: "uint256",
      },
    ],
    name: "NFTMinted",
    type: "event",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
    type: "function",
  },
  // 更新图片
  {
    inputs: [
      {
        internalType: "string",
        name: "_newImageUrl",
        type: "string",
      },
    ],
    name: "setImage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // OpenZeppelin Ownable 方法
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
