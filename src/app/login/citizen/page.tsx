import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "নাগরিক প্রবেশদ্বার (Citizen Login) | LandTrace",
  description: "নাগরিক জমি ক্রেতা ও ওয়ারিশদের জন্য ল্যান্ডট্রেস রেকর্ড ও স্থানান্তর ঝুঁকি যাচাই লগইন।",
};

async function CitizenLoginContent() {
  const session = await getSession();
  if (session) {
    if (session.role === "ADMIN") redirect("/admin/dashboard");
    if (session.role === "OFFICIAL") redirect("/official/dashboard");
    redirect("/citizen/dashboard");
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <LoginForm targetRole="CITIZEN" />
    </main>
  );
}

export default function CitizenLoginPage() {
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
        <CitizenLoginContent />
      </Suspense>
      <Footer />
    </div>
  );
}
