import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getParcelById, getParcelAudit } from "@/lib/parcels";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CitizenDashboardClient from "@/components/CitizenDashboardClient";

export const metadata = {
  title: "নাগরিক ড্যাশবোর্ড (Citizen Dashboard) | LandTrace",
  description: "নাগরিক জমি রেকর্ড সারাংশ, স্বত্ব নিরাপত্তা ও স্থানান্তর পূর্ববর্তী ঝুঁকি সিমুলেটর।",
};

async function CitizenDashboardContent() {
  const session = await getSession();

  if (!session) {
    redirect("/login/citizen");
  }

  // Role routing enforcement
  if (session.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (session.role === "OFFICIAL") {
    redirect("/official/dashboard");
  }

  // Fetch citizen's permitted plot
  const permittedPlotNumber = session.permittedPlots.split(",")[0]?.trim() || "PLOT-DH-1001";
  const parcel = await getParcelById(permittedPlotNumber);
  const audit = parcel ? getParcelAudit(parcel) : null;

  return (
    <main className="flex-1">
      <CitizenDashboardClient
        user={{
          id: session.id,
          email: session.email,
          name: session.name,
          designation: session.designation,
          permittedPlots: session.permittedPlots,
        }}
        parcel={parcel}
        audit={audit}
      />
    </main>
  );
}

export default function CitizenDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-20">
            নাগরিক ড্যাশবোর্ড লোড হচ্ছে...
          </div>
        }
      >
        <CitizenDashboardContent />
      </Suspense>
      <Footer />
    </div>
  );
}
