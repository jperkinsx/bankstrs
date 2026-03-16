import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="font-mono text-lg font-bold text-foreground">
              404 — Not Found
            </h1>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This page doesn't exist.
          </p>
          <Link href="/">
            <Button data-testid="go-home" variant="outline" size="sm" className="mt-4">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
