import Link from "next/link";
import { Trophy, Users, Zap, ShieldCheck, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 flex flex-col items-center text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900 border border-cricket-orange/40 text-cricket-gold text-xs sm:text-sm font-bold shadow-lg shadow-orange-950/20 mb-8 animate-fadeIn">
          <Flame className="w-4 h-4 fill-cricket-orange text-cricket-orange" />
          <span>Live Multiplayer Cricket Auction Trivia</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Quiz for{" "}
          <span className="bg-gradient-to-r from-cricket-orange via-[#F97316] to-cricket-gold bg-clip-text text-transparent">
            IPL Auction
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10">
          Fast, tamper-proof multiplayer quiz built for IPL mock auction events, campus competitions, and fan gatherings. 
          Server-authoritative scoring, instant auto-saves, and live leaderboards.
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-md flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/join" className="flex-1">
            <Button variant="primary" size="lg" className="w-full text-lg shadow-xl glow-orange">
              Join a Quiz
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/host/new" className="flex-1">
            <Button variant="outline" size="lg" className="w-full text-lg">
              Host a Quiz
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="p-5 rounded-2xl glass-card border border-navy-700/80 flex flex-col gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-cricket-orange/40 text-cricket-orange flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">25 Random Questions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every quiz randomly samples 25 distinct questions from a master 100-question bank verified through IPL 2025.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-navy-700/80 flex flex-col gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-950/80 border border-cricket-gold/40 text-cricket-gold flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Millisecond Tie-Breaker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Higher score ranks first. Equal scores are fairly broken by shorter server-verified completion time.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-navy-700/80 flex flex-col gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Zero Friction Joining</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No accounts, passwords, or emails. Join in seconds with just a name and Room Code or QR scan.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
