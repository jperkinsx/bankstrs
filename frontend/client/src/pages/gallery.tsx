import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
      <h1 className="mb-8 font-mono text-xl font-bold text-foreground">Gallery</h1>

      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground">Loading...</span>
        </div>
      )}

      <div
        data-testid="gallery-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {gallery?.map((bankstr) => (
          <Card key={bankstr.day} data-testid={`gallery-card-${bankstr.day}`}>
            <div className="flex aspect-square items-center justify-center border-b border-border bg-muted">
              <span className="font-mono text-xs text-muted-foreground">
                #{bankstr.day}
              </span>
            </div>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-foreground">
                  Bankstrs #{bankstr.day}
                </span>
                <Badge variant={bankstr.settled ? "secondary" : "default"}>
                  {bankstr.settled ? "Settled" : "Active"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(bankstr.traits)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-[10px]">
                      {value}
                    </Badge>
                  ))}
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {truncateAddress(bankstr.owner)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16">
        <PerplexityAttribution />
      </div>
    </div>
  );
}
