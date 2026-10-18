import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerifyDetailClient from "@/components/VerifyDetailClient";
import { getParcelById, getParcelAudit } from "@/lib/parcels";
import { AlertCircle, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return [
    { recordId: "PLOT-DH-1001" },
    { recordId: "PLOT-DH-2045" },
    { recordId: "PLOT-SYL-5501" },
    { recordId: "PLOT-CTG-3301" },
    { recordId: "PLOT-RAJ-4402" },
    { recordId: "PLOT-KHL-6610" },
    { recordId: "PLOT-BAR-7703" },
    { recordId: "5aa3dd3f-e5c2-4750-b0e6-f4a3e8e132de" },
    { recordId: "6bb4ee4f-f6d3-5861-c1f7-05b4f9f243ef" },
    { recordId: "7cc5ff50-07e4-6972-d2a8-16c5000354f0" },
    { recordId: "8dd60061-18f5-7083-e3b9-27d6111465a1" },
    { recordId: "9ee71172-2906-8194-f4ca-38e7222576b2" },
    { recordId: "0ff82283-3a17-9205-05db-49f8333687c3" },
    { recordId: "1aa93394-4b28-0316-16ec-50a9444798d4" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;
  return {
    title: `রেকর্ড যাচাই: ${recordId} | LandTrace`,
    description: "ক্যাডাস্ট্রাল জরিপ, মালিকানা ধারাবাহিকতা ও স্বয়ংক্রিয় জালিয়াতি শনাক্তকরণ বিশ্লেষণ।",
  };
}

async function VerifyDetailContent({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;
  const parcel = await getParcelById(recordId);

  if (!parcel) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            রেকর্ড পাওয়া যায়নি / Record Not Found
          </h1>
          <p className="text-xs text-slate-500">
            নম্বর &apos;{recordId}&apos;-এর কোনো প্লট, দাগ বা খতিয়ান ডাটাবেজে খুঁজে পাওয়া যায়নি।
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
      <VerifyDetailClient parcel={parcel} audit={audit} />
    </main>
  );
}

export default function VerifyDetailPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-20">
            রেকর্ড বিশ্লেষণ লোড হচ্ছে...
          </div>
        }
      >
        <VerifyDetailContent params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}
