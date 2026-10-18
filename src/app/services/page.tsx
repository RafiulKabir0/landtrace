import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesClient from "@/components/ServicesClient";

export const metadata = {
  title: "সেবাসমূহ (Service Directory) | LandTrace",
  description:
    "ল্যান্ডট্রেস সার্বিক সেবা ডিরেক্টরি: দ্বৈত বিক্রয়, স্বত্ব ধারাবাহিকতা, পরিমাপ অসঙ্গতি ও নামজারি নিরীক্ষা।",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <ServicesClient />
      </main>
      <Footer />
    </div>
  );
}
