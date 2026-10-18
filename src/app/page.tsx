import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: "ল্যান্ডট্রেস (LandTrace) | ভূমি রেকর্ড যাচাইকরণ ও সিদ্ধান্ত সহায়তা",
  description:
    "LandTech 2026 Problem Statement 3 (P3): Automated fraud, double-selling and chain-of-title contradiction detection for Bangladesh land administration.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <HomeClient />
      </main>
      <Footer />
    </div>
  );
}
