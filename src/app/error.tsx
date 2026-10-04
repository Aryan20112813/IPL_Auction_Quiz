"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global client error caught:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <TopBar />
      <main className="max-w-md mx-auto w-full px-4 py-16 flex-1 flex flex-col justify-center text-center">
        <Card variant="glass" className="p-8 border-red-500/30 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Something went wrong!</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {error.message || "An unexpected error occurred while rendering the page."}
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="primary" size="md" onClick={() => reset()} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" size="md" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
