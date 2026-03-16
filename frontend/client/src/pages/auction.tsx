import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Countdown } from "@/components/Countdown";
import { BidForm } from "@/components/BidForm";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import type { Bankstr } from "@shared/schema";

function truncateAddress(addr: string | null): string {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Auction() {
  const { data: auction, isLoading } = useQuery<Bankstr>({
    queryKey: ["/api/auction/current"],
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="font-mono text-sm text-[var(--text-muted)]">Loading...</span>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="font-mono text-sm text-[var(--text-muted)]">
          No active auction
        </span>
      </div>
    );
  }

  const auctionEnded = auction.auctionEndTime <= Math.floor(Date.now() / 1000);
  const traitEntries = Object.entries(auction.traits);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* CRT Display Area */}
        <div
          data-testid="auction-image"
          className="crt-screen relative flex aspect-square items-center justify-center p-6"
        >
          <div className="crt-grid" />
          <div className="crt-glare" />

          {/* CLI overlays */}
          <div className="cli-layer">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <span>&gt; init sequence... <span className="text-white" style={{ textShadow: "none" }}>OK</span></span>
                <span>&gt; loading model: <span className="text-white" style={{ textShadow: "none" }}>BNK_10K</span></span>
              </div>
              <div className="text-right">
                <span className="inline-block border border-[var(--neon-green)] bg-[rgba(57,255,20,0.1)] px-2 py-0.5" style={{ animation: "pulse-border 2s infinite" }}>
                  {auctionEnded ? "SETTLED" : "EVOLVING"}
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                {traitEntries.slice(0, 2).map(([key, value]) => (
                  <span key={key}>
                    {key.toUpperCase()} <span className="opacity-50 mx-1">[</span> <span className="text-white" style={{ textShadow: "none" }}>{String(value)}</span> <span className="opacity-50 mx-1">]</span>
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-1 text-right">
                {traitEntries.slice(2, 4).map(([key, value]) => (
                  <span key={key}>
                    {key.toUpperCase()}: <span className="text-white" style={{ textShadow: "none" }}>{String(value)}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Subject + reticle */}
          <div className="relative z-[2] flex items-center justify-center">
            <div className="target-reticle" />
            <span className="font-mono text-lg font-bold text-[var(--neon-green)]" style={{ textShadow: "0 0 12px var(--neon-green-glow)" }}>
              #{auction.day}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="font-mono text-xl font-bold text-[var(--text-bright)]">
              Bankstrs #{auction.day}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Day {auction.day} of 10,000
            </p>
          </div>

          {/* Traits */}
          <div className="module-block">
            <div className="module-header">
              <span className="hardware-label">Traits</span>
              <div className="status-light" />
            </div>
            <div data-testid="trait-list" className="flex flex-wrap gap-2">
              {traitEntries.map(([key, value]) => (
                <Badge key={key} variant="outline" className="border-[var(--neon-green-dim)] text-[var(--neon-green)] bg-transparent">
                  <span className="text-[var(--text-muted)]">{key}:</span>{" "}
                  <span>{String(value)}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Auction Status */}
          <div className="module-block">
            <div className="module-header">
              <span className="hardware-label">Auction Status</span>
              <div className="status-light" />
            </div>
            <div className="space-y-3">
              <div className="recessed-display flex items-center justify-between">
                <span className="hardware-label">Time Left</span>
                <Countdown endTime={auction.auctionEndTime} />
              </div>
              <div className="recessed-display flex items-center justify-between">
                <span className="hardware-label">Highest Bid</span>
                <span className="font-mono text-sm text-[var(--neon-green)]" style={{ textShadow: "0 0 8px var(--neon-green-glow)" }}>
                  {auction.highestBid} ETH
                </span>
              </div>
              <div className="recessed-display flex items-center justify-between">
                <span className="hardware-label">Bidder</span>
                <span className="font-mono text-xs text-[var(--text-bright)]">
                  {truncateAddress(auction.highestBidder)}
                </span>
              </div>
            </div>
          </div>

          {/* Bid Form */}
          <BidForm
            tokenId={auction.day}
            currentBid={auction.highestBid}
            auctionEnded={auctionEnded}
          />
        </div>
      </div>

      {/* Seed Verification */}
      <section data-testid="seed-verification" className="mt-12">
        <div className="module-block">
          <div className="module-header">
            <span className="hardware-label">Seed Verification</span>
            <div className="status-light" />
          </div>
          <div className="space-y-2">
            <div className="recessed-display flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-sm text-[var(--text-muted)]">Seed:</span>
              <code className="break-all font-mono text-xs text-[var(--neon-green)]" style={{ textShadow: "0 0 4px var(--neon-green-glow)" }}>
                {auction.seed}
              </code>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              The seed is derived from keccak256(treasuryBalance, dayNumber). Anyone
              can verify trait selection is deterministic and tamper-proof.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <PerplexityAttribution />
      </div>
    </div>
  );
}
