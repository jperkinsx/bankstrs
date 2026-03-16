import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { parseEther } from "viem";
import { Input } from "@/components/ui/input";
import { BAZAAR_ADDRESS, BAZAAR_ABI, NFT_CONTRACT } from "@/lib/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface BidFormProps {
  tokenId: number;
  currentBid: string;
  auctionEnded: boolean;
}

export function BidForm({ tokenId, currentBid, auctionEnded }: BidFormProps) {
  const [amount, setAmount] = useState("");
  const { isConnected } = useAccount();
  const { writeContract, isPending, isSuccess, isError, error } =
    useWriteContract();

  const handleBid = () => {
    if (!amount || isNaN(Number(amount))) return;
    writeContract({
      address: BAZAAR_ADDRESS,
      abi: BAZAAR_ABI,
      functionName: "bid",
      args: [
        NFT_CONTRACT,
        BigInt(tokenId),
        "0x0000000000000000000000000000000000000000",
        parseEther(amount),
      ],
      value: parseEther(amount),
    });
  };

  if (!isConnected) {
    return (
      <div data-testid="bid-form-connect" className="space-y-3">
        <p className="text-sm text-[var(--text-muted)]">
          Connect wallet to place a bid
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div data-testid="bid-form" className="space-y-3">
      <div className="text-sm text-[var(--text-muted)]">
        Current bid: <span className="font-mono text-[var(--neon-green)]" style={{ textShadow: "0 0 8px var(--neon-green-glow)" }}>{currentBid} ETH</span>
      </div>
      <div className="flex gap-2">
        <Input
          data-testid="bid-input"
          type="number"
          step="0.001"
          min="0"
          placeholder="ETH amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={auctionEnded || isPending}
          className="bg-[#0a0a0a] border-[#1a1a1a] font-mono text-[var(--neon-green)]"
          style={{ boxShadow: "var(--shadow-recessed)" }}
        />
        <button
          data-testid="bid-button"
          onClick={handleBid}
          disabled={auctionEnded || isPending || !amount}
          className="btn-physical btn-primary px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "Bidding..." : auctionEnded ? "Ended" : "Place Bid"}
        </button>
      </div>
      {isSuccess && (
        <p data-testid="bid-success" className="text-sm text-[var(--neon-green)]" style={{ textShadow: "0 0 6px var(--neon-green-glow)" }}>
          Bid placed successfully!
        </p>
      )}
      {isError && (
        <p data-testid="bid-error" className="text-sm text-[var(--molded-orange)]">
          {error?.message?.slice(0, 100) || "Bid failed"}
        </p>
      )}
    </div>
  );
}
