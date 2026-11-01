import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <Container size="md" className="text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-400">
          <Compass className="h-8 w-8 animate-spin" />
        </div>
        <div className="space-y-2">
          <p className="font-mono text-xs font-semibold text-blue-400 uppercase tracking-widest">
            Error 404 — Coordinate Out of Bounds
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            The spatial hardware coordinate you requested could not be resolved. This route is either under construction in the NEXORA roadmap or does not exist.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Return to Headquarters
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
