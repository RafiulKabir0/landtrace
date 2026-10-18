import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuideClient from "@/components/GuideClient";

export const metadata = {
  title: "ব্যবহার নির্দেশিকা (User Guide) | LandTrace",
  description:
    "ল্যান্ডট্রেস প্ল্যাটফর্ম ব্যবহারের নির্দেশিকা: জমি ক্রেতা, ওয়ারিশ ও সহকারী কমিশনার (ভূমি) কর্মকর্তাদের জন্য।",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <GuideClient />
      </main>
      <Footer />
    </div>
  );
}
