import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <span className="font-mono text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="font-mono text-sm text-muted-foreground">
          No active auction
        </span>
      </div>
    );
  }

  const auctionEnded = auction.auctionEndTime <= Math.floor(Date.now() / 1000);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div
          data-testid="auction-image"
          className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted"
        >
          <span className="font-mono text-sm text-muted-foreground">
            Bankstrs #{auction.day}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="font-mono text-xl font-bold text-foreground">
              Bankstrs #{auction.day}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Day {auction.day} of 10,000
            </p>
          </div>

          {/* Traits */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Traits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div data-testid="trait-list" className="flex flex-wrap gap-2">
                {Object.entries(auction.traits).map(([key, value]) => (
                  <Badge key={key} variant="outline">
                    <span className="text-muted-foreground">{key}:</span>{" "}
                    <span className="text-foreground">{value}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Auction Status */}
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Time Left</span>
                <Countdown endTime={auction.auctionEndTime} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Highest Bid</span>
                <span className="font-mono text-sm text-foreground">
                  {auction.highestBid} ETH
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bidder</span>
                <span className="font-mono text-xs text-foreground">
                  {truncateAddress(auction.highestBidder)}
                </span>
              </div>
            </CardContent>
          </Card>

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
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Seed Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-sm text-muted-foreground">Seed:</span>
              <code className="break-all rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
                {auction.seed}
              </code>
            </div>
            <p className="text-xs text-muted-foreground">
              The seed is derived from keccak256(treasuryBalance, dayNumber). Anyone
              can verify trait selection is deterministic and tamper-proof.
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="mt-12">
        <PerplexityAttribution />
      </div>
    </div>
  );
}
