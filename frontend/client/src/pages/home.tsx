import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Countdown } from "@/components/Countdown";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { BankstrCoin } from "@/components/BankstrCoin";
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
        <h1 className="text-xl font-bold tracking-widest text-[var(--text-muted)] uppercase" style={{ fontFamily: "var(--font-sans)" }}>
          BANKSTRS
        </h1>
        <p className="mt-3 font-mono text-sm text-[var(--text-muted)]">
          10,000 days. One Bankstr per day. Zero-reserve auction.
        </p>
        <p className="mt-1 font-mono text-xs text-[var(--text-muted)] opacity-60">
          Built on Rare Protocol + Bankr
        </p>
      </section>

      {/* Stats */}
      <section data-testid="stats" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Day", value: stats?.currentDay ? `#${stats.currentDay}` : "—" },
          { label: "Total Minted", value: stats?.totalMinted ?? "—" },
          { label: "Current Bid", value: auction ? `${auction.highestBid} ETH` : "—" },
        ].map((stat) => (
          <div key={stat.label} className="module-block">
            <div className="module-header">
              <span className="hardware-label">{stat.label}</span>
              <div className="status-light" />
            </div>
            <div className="recessed-display">
              <span className="font-mono text-lg text-[var(--neon-green)]" style={{ textShadow: "0 0 8px var(--neon-green-glow)" }}>
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Today's Auction Preview */}
      {auction && (
        <section data-testid="auction-preview" className="mt-10">
          <div className="module-block">
            <div className="module-header">
              <span className="hardware-label">Today's Auction</span>
              <div className="status-light" />
            </div>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="crt-screen flex h-48 w-48 shrink-0 items-center justify-center p-4">
                <div className="crt-grid" />
                <div className="relative z-[2]">
                  <BankstrCoin size={120} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="font-mono text-lg font-semibold text-[var(--text-bright)]">
                  Bankstrs #{auction.day}
                </h2>
                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span>
                    Bid: <span className="font-mono text-[var(--neon-green)]" style={{ textShadow: "0 0 8px var(--neon-green-glow)" }}>{auction.highestBid} ETH</span>
                  </span>
                  <Countdown endTime={auction.auctionEndTime} />
                </div>
                <Link href="/auction">
                  <button data-testid="go-to-auction" className="btn-physical btn-primary px-6 py-3">
                    View Auction
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section data-testid="how-it-works" className="mt-16">
        <h2 className="mb-6 font-mono text-lg font-semibold text-[var(--text-bright)]">
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
            <div key={item.step} className="module-block">
              <span className="font-mono text-sm font-bold text-[var(--molded-orange)]" style={{ textShadow: "0 0 8px rgba(255, 77, 0, 0.3)" }}>
                {item.step}
              </span>
              <h3 className="mt-2 text-sm font-semibold text-[var(--text-bright)]">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <PerplexityAttribution />
      </div>
    </div>
  );
}
