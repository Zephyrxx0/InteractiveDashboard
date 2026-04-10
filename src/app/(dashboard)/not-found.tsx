import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-4xl font-display font-bold tracking-tighter text-foreground">
          404
        </h2>
        <h3 className="text-xl font-display font-bold tracking-tight text-foreground">
          Page Not Found
        </h3>
        <p className="text-muted-foreground font-mono text-sm max-w-md">
          The dashboard component or project you're looking for doesn't exist or
          has been moved.
        </p>
      </div>

      <Link href="/dashboard">
        <Button className="font-mono text-xs uppercase tracking-wider">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
