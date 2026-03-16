import { Badge } from "@/components/ui/badge";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { ExternalLink } from "lucide-react";

const AGENT_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function Agent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-mono text-xl font-bold text-[var(--text-bright)]">
        Agent & Token
      </h1>

      {/* Token Info */}
      <div className="module-block">
        <div className="module-header">
          <span className="hardware-label">$BNKSTR Token</span>
          <div className="status-light" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="recessed-display">
            <span className="hardware-label">Symbol</span>
            <p className="font-mono text-sm text-[var(--neon-green)] mt-1" style={{ textShadow: "0 0 8px var(--neon-green-glow)" }}>$BNKSTR</p>
          </div>
          <div className="recessed-display">
            <span className="hardware-label">Market Cap</span>
            <p className="font-mono text-sm text-[var(--text-bright)] mt-1">TBD</p>
          </div>
          <div className="recessed-display">
            <span className="hardware-label">Contract</span>
            <p className="font-mono text-sm text-[var(--text-bright)] mt-1">TBD</p>
          </div>
        </div>
        <div className="mt-4">
          <Badge variant="outline" className="border-[var(--molded-orange)] text-[var(--molded-orange)]">Coming Soon</Badge>
        </div>
      </div>

      {/* Agent Profile */}
      <div className="module-block mt-6">
        <div className="module-header">
          <span className="hardware-label">Bankr AI Agent</span>
          <div className="status-light" />
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          The BANKSTRS treasury is managed by an autonomous Bankr AI Agent.
          It monitors the treasury balance, executes trades, and manages the
          collection's financial strategy — all on-chain and verifiable.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <a
            href={`https://bankr.bot/agents/${AGENT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button data-testid="view-agent-button" className="btn-physical btn-primary px-6 py-3">
              View Agent on Bankr
              <ExternalLink className="h-3 w-3" />
            </button>
          </a>
        </div>
        <div className="recessed-display mt-4">
          <span className="hardware-label">Agent Address</span>
          <p className="font-mono text-xs text-[var(--neon-green)] break-all mt-1" style={{ textShadow: "0 0 4px var(--neon-green-glow)" }}>
            {AGENT_ADDRESS}
          </p>
        </div>
      </div>

      {/* Treasury Flywheel */}
      <div className="module-block mt-6">
        <div className="module-header">
          <span className="hardware-label">Treasury Flywheel</span>
          <div className="status-light" />
        </div>
        <div className="space-y-3">
          {[
            {
              step: "01",
              text: "Daily auction generates ETH revenue from Bankstrs NFT sales.",
            },
            {
              step: "02",
              text: "Revenue flows to the BANKSTRS treasury on Base.",
            },
            {
              step: "03",
              text: "The Bankr AI Agent manages the treasury autonomously — trading, staking, and growing the balance.",
            },
            {
              step: "04",
              text: "The treasury balance determines the next day's seed, creating a verifiable feedback loop.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 items-start">
              <span className="font-mono text-sm font-bold text-[var(--molded-orange)] shrink-0" style={{ textShadow: "0 0 8px rgba(255, 77, 0, 0.3)" }}>
                {item.step}
              </span>
              <p className="text-sm text-[var(--text-muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <PerplexityAttribution />
      </div>
    </div>
  );
}
