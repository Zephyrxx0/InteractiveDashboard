"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground font-mono text-sm max-w-md">
          An error occurred while rendering this page. The system has logged the
          event.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          variant="outline"
          className="font-mono text-xs uppercase tracking-wider"
        >
          Try again
        </Button>
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="font-mono text-xs uppercase tracking-wider"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
