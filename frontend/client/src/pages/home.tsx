import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import type { Bankstr, Stats } from "@shared/schema";

export default function Home() {
  const { data: auction } = useQuery<Bankstr>({
    queryKey: ["/api/auction/current"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <section data-testid="hero" className="pb-16 text-center">
        <h1 className="font-mono text-xl font-bold tracking-widest text-primary">
          BANKSTRS
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          10,000 days. One Bankstr per day. Zero-reserve auction.
        </p>
      </section>

      {/* Stats */}
      <section data-testid="stats" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-lg text-foreground">
              #{stats?.currentDay ?? "—"}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Minted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-lg text-foreground">
              {stats?.totalMinted ?? "—"}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Current Bid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-lg text-foreground">
              {auction ? `${auction.highestBid} ETH` : "—"}
            </span>
          </CardContent>
        </Card>
      </section>

      {/* Today's Auction Preview */}
      {auction && (
        <section data-testid="auction-preview" className="mt-10">
          <Card>
            <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row">
              <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                <span className="font-mono text-xs text-muted-foreground">
                  Bankstrs #{auction.day}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="font-mono text-lg font-semibold text-foreground">
                  Today's Auction
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Bid: <span className="font-mono text-foreground">{auction.highestBid} ETH</span>
                  </span>
                  <Countdown endTime={auction.auctionEndTime} />
                </div>
                <Link href="/auction">
                  <Button data-testid="go-to-auction" size="sm">
                    View Auction
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* How It Works */}
      <section data-testid="how-it-works" className="mt-16">
        <h2 className="mb-6 font-mono text-lg font-semibold text-foreground">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Seed Generation",
              desc: "Each day, the treasury balance and day number produce a deterministic seed via keccak256.",
            },
            {
              step: "02",
              title: "Trait Selection",
              desc: "The seed selects traits across 6 categories to create a unique Bankstr character.",
            },
            {
              step: "03",
              title: "Auction & Treasury",
              desc: "The Bankstr is minted and auctioned for 24 hours. Revenue flows to the AI-managed treasury.",
            },
          ].map((item) => (
            <Card key={item.step}>
              <CardContent className="p-5">
                <span className="font-mono text-xs text-primary">{item.step}</span>
                <h3 className="mt-2 text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <PerplexityAttribution />
      </div>
    </div>
  );
}
