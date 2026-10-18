import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllParcels, getParcelAudit } from "@/lib/parcels";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfficialDashboardClient from "@/components/OfficialDashboardClient";
import { AuditResult } from "@/lib/detection-engine";

export const metadata = {
  title: "ভূমি কর্মকর্তা ড্যাশবোর্ড (Official Dashboard) | LandTrace",
  description: "সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের জন্য স্বত্ব-শৃঙ্খল অডিট ও তদন্ত সিদ্ধান্ত সহায়তা।",
};

async function OfficialDashboardContent() {
  const session = await getSession();

  if (!session) {
    redirect("/login/official");
  }

  // Citizens cannot access official dashboard
  if (session.role === "CITIZEN") {
    redirect("/citizen/dashboard");
  }

  const parcels = await getAllParcels();
  const audits: Record<string, AuditResult> = {};

  parcels.forEach((p) => {
    audits[p.parcelNumber] = getParcelAudit(p);
    audits[p.id] = audits[p.parcelNumber];
  });

  return (
    <main className="flex-1">
      <OfficialDashboardClient
        user={{
          id: session.id,
          email: session.email,
          name: session.name,
          role: session.role,
          designation: session.designation,
        }}
        parcels={parcels}
        audits={audits}
      />
    </main>
  );
}

export default function OfficialDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-20">
            ভূমি কর্মকর্তা ড্যাশবোর্ড লোড হচ্ছে...
          </div>
        }
      >
        <OfficialDashboardContent />
      </Suspense>
      <Footer />
    </div>
  );
}
