import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutClient from "@/components/AboutClient";

export const metadata = {
  title: "পরিচিতি ও সীমাবদ্ধতা (About LandTrace) | LandTrace",
  description:
    "ল্যান্ডটেক ২০২৬ সমস্যা ৩: ল্যান্ডট্রেস প্রকল্পের প্রেক্ষাপট, প্রযুক্তিগত স্থাপত্য এবং সীমাবদ্ধতা।",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <AboutClient />
      </main>
      <Footer />
    </div>
  );
}
