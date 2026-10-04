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
      <body className="bg-navy-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cricket-orange selection:text-white">
        <ConnectionBanner />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
