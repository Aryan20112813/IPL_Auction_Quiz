import { NextResponse } from "next/server";
import prisma from "@/server/db/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      db: "ok",
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        db: "disconnected",
        serverTime: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
