import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactClient from "@/components/ContactClient";

export const metadata = {
  title: "যোগাযোগ (Contact) | LandTrace",
  description: "ল্যান্ডট্রেস টিম ও ডেভেলপার রাফিউল কবির (Rafiul Kabir)-এর সাথে যোগাযোগের তথ্য।",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <ContactClient />
      </main>
      <Footer />
    </div>
  );
}
