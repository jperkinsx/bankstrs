import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import type { Bankstr } from "@shared/schema";

function truncateAddress(addr: string | null): string {
  if (!addr) return "Auction Active";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Gallery() {
  const { data: gallery, isLoading } = useQuery<Bankstr[]>({
    queryKey: ["/api/gallery"],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 font-mono text-xl font-bold text-[var(--text-bright)]">Gallery</h1>

      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <span className="font-mono text-sm text-[var(--text-muted)]">Loading...</span>
        </div>
      )}

      <div
        data-testid="gallery-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {gallery?.map((bankstr) => (
          <div key={bankstr.day} data-testid={`gallery-card-${bankstr.day}`} className="module-block p-0 overflow-hidden">
            <div className="crt-screen relative flex aspect-square items-center justify-center" style={{ borderRadius: "20px 20px 0 0" }}>
              <div className="crt-grid" />
              <span className="font-mono text-xs text-[var(--neon-green)] relative z-[2]" style={{ textShadow: "0 0 4px var(--neon-green-glow)" }}>
                #{bankstr.day}
              </span>
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-[var(--text-bright)]">
                  Bankstrs #{bankstr.day}
                </span>
                {bankstr.settled ? (
                  <Badge variant="outline" className="border-[var(--text-muted)] text-[var(--text-muted)]">
                    Settled
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-[var(--neon-green-dim)] text-[var(--neon-green)]" style={{ textShadow: "0 0 4px var(--neon-green-glow)" }}>
                    Active
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(bankstr.traits)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-[10px] border-[var(--neon-green-dim)] text-[var(--neon-green)] bg-transparent">
                      {value}
                    </Badge>
                  ))}
              </div>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                {truncateAddress(bankstr.owner)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <PerplexityAttribution />
      </div>
    </div>
  );
}
