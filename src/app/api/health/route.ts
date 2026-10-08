import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const parcelCount = await prisma.parcel.count();
    const anomalyCount = await prisma.fraudAnomaly.count();
    const parcels = await prisma.parcel.findMany({
      include: {
        anomalies: true,
        deeds: true,
      },
    });

    return NextResponse.json({
      status: "healthy",
      service: "LandTrace API",
      database: "Neon PostgreSQL",
      metrics: {
        parcels: parcelCount,
        anomalies: anomalyCount,
      },
      data: parcels,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "error",
        error: message,
      },
      { status: 500 }
    );
  }
}
