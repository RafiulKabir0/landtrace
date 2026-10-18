import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerifySearchClient from "@/components/VerifySearchClient";
import { getAllParcels, getParcelAudit } from "@/lib/parcels";
import { AuditResult } from "@/lib/detection-engine";

export const metadata = {
  title: "রেকর্ড অনুসন্ধান ও যাচাইকরণ (Verify Title) | LandTrace",
  description:
    "প্লট, দাগ, খতিয়ান বা দলিল নম্বর দিয়ে অনুসন্ধান করুন এবং ৫টি পি৩ শনাক্তকরণ অ্যালগরিদমের বিশ্লেষণ দেখুন।",
};

async function VerifyContent() {
  const parcels = await getAllParcels();
  const audits: Record<string, AuditResult> = {};

  parcels.forEach((p) => {
    audits[p.parcelNumber] = getParcelAudit(p);
    audits[p.id] = audits[p.parcelNumber];
  });

  return (
    <main className="flex-1">
      <VerifySearchClient parcels={parcels} audits={audits} />
    </main>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-20">
            যাচাইকরণ রেকর্ড লোড হচ্ছে...
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
      <Footer />
    </div>
  );
}
