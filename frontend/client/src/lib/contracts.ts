export const BAZAAR_ADDRESS = "0xC8Edc7049b233641ad3723D6C60019D1c8771612" as const;
export const NFT_CONTRACT = "0x0000000000000000000000000000000000000000" as const;
export const CHAIN_ID = 11155111; // Sepolia

export const BAZAAR_ABI = [
  {
    name: "bid",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "_originContract", type: "address" },
      { name: "_tokenId", type: "uint256" },
      { name: "_currencyAddress", type: "address" },
      { name: "_amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "settleAuction",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_originContract", type: "address" },
      { name: "_tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "getAuctionDetails",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "_originContract", type: "address" },
      { name: "_tokenId", type: "uint256" },
    ],
    outputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "bytes32" },
      { name: "", type: "address[]" },
      { name: "", type: "uint8[]" },
    ],
  },
] as const;
