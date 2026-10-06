import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConnectionBanner } from "@/components/feedback/ConnectionBanner";

export const metadata: Metadata = {
  title: "Quiz for IPL Auction | Live Multiplayer Cricket Trivia",
  description:
    "Fast, mobile-first multiplayer IPL quiz for IPL auction events with server-authoritative scoring and live leaderboards.",
  applicationName: "Quiz for IPL Auction",
  keywords: ["IPL", "Auction", "Cricket", "Quiz", "Trivia", "Leaderboard"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B1F3A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cricket-orange selection:text-white ipl-stripe-top relative">
        {/* Fixed Stadium Background Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
          />
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050d1a]/75 via-[#050d1a]/60 to-[#050d1a]/80" />
          {/* Ambient Floodlight Shimmer Glow */}
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(245,130,32,0.1)_0%,transparent_70%)] animate-pulse-subtle" />
        </div>
        <ConnectionBanner />
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
      </body>
    </html>
  );
}
