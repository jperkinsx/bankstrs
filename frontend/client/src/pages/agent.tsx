import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { ExternalLink } from "lucide-react";

const AGENT_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function Agent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-mono text-xl font-bold text-foreground">
        Agent & Token
      </h1>

      {/* Token Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            $BNKSTR Token
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <span className="text-xs text-muted-foreground">Symbol</span>
              <p className="font-mono text-sm text-foreground">$BNKSTR</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Market Cap</span>
              <p className="font-mono text-sm text-foreground">TBD</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Contract</span>
              <p className="font-mono text-sm text-foreground">TBD</p>
            </div>
          </div>
          <Badge variant="outline">Coming Soon</Badge>
        </CardContent>
      </Card>

      {/* Agent Profile */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Bankr AI Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The BANKSTRS treasury is managed by an autonomous Bankr AI Agent.
            It monitors the treasury balance, executes trades, and manages the
            collection's financial strategy — all on-chain and verifiable.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={`https://bankr.bot/agents/${AGENT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button data-testid="view-agent-button">
                View Agent on Bankr
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </a>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Agent Address</span>
            <p className="font-mono text-xs text-foreground break-all">
              {AGENT_ADDRESS}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Treasury Flywheel */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Treasury Flywheel
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              <div key={item.step} className="flex gap-3">
                <span className="font-mono text-xs text-primary">{item.step}</span>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-16">
        <PerplexityAttribution />
      </div>
    </div>
  );
}
