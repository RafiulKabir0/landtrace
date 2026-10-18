import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "ভূমি কর্মকর্তা প্রবেশদ্বার (Official Login) | LandTrace",
  description: "সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের জন্য স্বত্ব-শৃঙ্খল অডিট ও তদন্ত সিদ্ধান্ত সহায়তা লগইন।",
};

async function OfficialLoginContent() {
  const session = await getSession();
  if (session) {
    if (session.role === "ADMIN") redirect("/admin/dashboard");
    if (session.role === "OFFICIAL") redirect("/official/dashboard");
    redirect("/citizen/dashboard");
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <LoginForm targetRole="OFFICIAL" />
    </main>
  );
}

export default function OfficialLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-20">
            লোড হচ্ছে...
          </div>
        }
      >
        <OfficialLoginContent />
      </Suspense>
      <Footer />
    </div>
  );
}
