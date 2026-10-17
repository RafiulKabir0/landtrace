import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { SYNTHETIC_PARCELS } from "@/lib/demo-data";
import LandTraceClient, { Parcel } from "./LandTraceClient";

async function LandTraceContent() {
  let parcels: Parcel[] = [];
  const session = await getSession();

  try {
    const rawParcels = await prisma.parcel.findMany({
      include: {
        deeds: {
          orderBy: { serialOrder: "asc" },
        },
        mutations: true,
        anomalies: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (rawParcels && rawParcels.length > 0) {
      parcels = rawParcels as unknown as Parcel[];
    }
  } catch (error) {
    console.warn("Database query skipped, using deterministic synthetic dataset:", (error as Error).message);
  }

  // Graceful fallback to rich synthetic parcels if database returned empty
  if (parcels.length === 0) {
    parcels = SYNTHETIC_PARCELS as unknown as Parcel[];
  }

  return <LandTraceClient initialParcels={parcels} initialSession={session} />;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-slate-500 bg-slate-50">
            <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="h-5 w-5 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
              <span className="text-sm font-medium">
                ল্যান্ডট্রেস রেকর্ড রেজিস্ট্রি লোড হচ্ছে... / Loading LandTrace Registry...
              </span>
            </div>
          </div>
        }
      >
        <LandTraceContent />
      </Suspense>
    </main>
  );
}
