import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HelpCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <TopBar />
      <main className="max-w-md mx-auto w-full px-4 py-16 flex-1 flex flex-col justify-center text-center">
        <Card variant="glass" className="p-8 border-navy-700 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-navy-900 border border-navy-700 text-cricket-orange flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Quiz Room Not Found</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            The page or room code you are trying to visit does not exist, or the session has ended and been cleaned up.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/join">
              <Button variant="primary" size="md" className="w-full">
                Join Another Quiz
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="md" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
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
