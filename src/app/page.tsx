import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import LandTraceClient, { Parcel } from "./LandTraceClient";

async function LandTraceContent() {
  let initialParcels: Parcel[] = [];

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
    initialParcels = rawParcels as Parcel[];
  } catch (error) {
    console.error("Database query failed:", error);
  }

  return <LandTraceClient initialParcels={initialParcels} />;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-slate-500 bg-slate-50">
            <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="h-5 w-5 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
              <span className="text-sm font-medium">Loading LandTrace Registry...</span>
            </div>
          </div>
        }
      >
        <LandTraceContent />
      </Suspense>
    </main>
  );
}
