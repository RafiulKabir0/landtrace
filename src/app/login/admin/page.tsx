import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "সিস্টেম অ্যাডমিন প্রবেশদ্বার (Admin Login) | LandTrace",
  description: "সিস্টেম নিরাপত্তা, ব্যবহারকারী অনুমোদন ও অডিট ট্রেইল অ্যাডমিনিস্ট্রেশন লগইন।",
};

async function AdminLoginContent() {
  const session = await getSession();
  if (session) {
    if (session.role === "ADMIN") redirect("/admin/dashboard");
    if (session.role === "OFFICIAL") redirect("/official/dashboard");
    redirect("/citizen/dashboard");
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <LoginForm targetRole="ADMIN" />
    </main>
  );
}

export default function AdminLoginPage() {
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
        <AdminLoginContent />
      </Suspense>
      <Footer />
    </div>
  );
}
