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
    <main className="min-h-screen bg-[#070b14] text-slate-100">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-slate-400">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <span>Loading LandTrace Title Registry...</span>
            </div>
          </div>
        }
      >
        <LandTraceContent />
      </Suspense>
    </main>
  );
}
