import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvestigationClient from "@/components/InvestigationClient";
import { getSession } from "@/lib/auth";
import { getParcelById, getParcelAudit } from "@/lib/parcels";
import { AlertCircle, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return [
    { id: "PLOT-DH-1001" },
    { id: "PLOT-DH-2045" },
    { id: "PLOT-SYL-5501" },
    { id: "PLOT-CTG-3301" },
    { id: "PLOT-RAJ-4402" },
    { id: "PLOT-KHL-6610" },
    { id: "PLOT-BAR-7703" },
    { id: "5aa3dd3f-e5c2-4750-b0e6-f4a3e8e132de" },
    { id: "6bb4ee4f-f6d3-5861-c1f7-05b4f9f243ef" },
    { id: "7cc5ff50-07e4-6972-d2a8-16c5000354f0" },
    { id: "8dd60061-18f5-7083-e3b9-27d6111465a1" },
    { id: "9ee71172-2906-8194-f4ca-38e7222576b2" },
    { id: "0ff82283-3a17-9205-05db-49f8333687c3" },
    { id: "1aa93394-4b28-0316-16ec-50a9444798d4" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `তদন্ত ফাইল: ${id} | LandTrace`,
    description: "স্বত্ববিরোধ, প্রমাণপত্র বিশ্লেষণ ও প্রশাসনিক সিদ্ধান্ত রেকর্ড।",
  };
}

async function InvestigationContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const parcel = await getParcelById(id);

  if (!parcel) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            কেস ফাইল পাওয়া যায়নি / Investigation File Not Found
          </h1>
          <p className="text-xs text-slate-500">
            নম্বর &apos;{id}&apos;-এর কোনো তদন্ত রেকর্ড ডাটাবেজে খুঁজে পাওয়া যায়নি।
          </p>
          <div className="pt-2">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>যাচাইকরণ তালিকায় ফিরুন / Back to Search</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const audit = getParcelAudit(parcel);

  return (
    <main className="flex-1">
      <InvestigationClient
        parcel={parcel}
        audit={audit}
        currentUser={
          session
            ? {
                id: session.id,
                name: session.name,
                role: session.role,
                designation: session.designation,
              }
            : null
        }
      />
    </main>
  );
}

export default function InvestigationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-20">
            তদন্ত ফাইল লোড হচ্ছে...
          </div>
        }
      >
        <InvestigationContent params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}
