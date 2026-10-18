import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession, UserRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEMO_USERS } from "@/lib/demo-data";
import { getAllParcels } from "@/lib/parcels";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const metadata = {
  title: "সিস্টেম অ্যাডমিন ড্যাশবোর্ড (Admin Dashboard) | LandTrace",
  description: "ব্যবহারকারী ও ভূমিকা ব্যবস্থাপনা, অডিট ট্রেইল এবং সিস্টেম কনফিগারেশন।",
};

interface AdminUserItem {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string;
  designation?: string;
  permittedPlots: string;
  createdAt: string;
}

async function AdminDashboardContent() {
  const session = await getSession();

  if (!session) {
    redirect("/login/admin");
  }

  // Strictly enforce ADMIN role
  if (session.role !== "ADMIN") {
    if (session.role === "OFFICIAL") redirect("/official/dashboard");
    redirect("/citizen/dashboard");
  }

  // Fetch users from database or fallback demo list
  let usersList: AdminUserItem[] = [];
  try {
    const dbUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        phoneNumber: true,
        designation: true,
        permittedPlots: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbUsers && dbUsers.length > 0) {
      usersList = dbUsers.map((u) => ({
        ...u,
        role: u.role as UserRole,
        phoneNumber: u.phoneNumber || undefined,
        designation: u.designation || undefined,
        permittedPlots: u.permittedPlots || "ALL",
        createdAt: u.createdAt.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("Prisma user query fallback in Admin dashboard:", (err as Error).message);
  }

  if (usersList.length === 0) {
    usersList = DEMO_USERS.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      isActive: u.isActive,
      phoneNumber: u.phoneNumber,
      designation: u.designation,
      permittedPlots: u.permittedPlots,
      createdAt: u.createdAt,
    }));
  }

  const parcels = await getAllParcels();

  return (
    <main className="flex-1">
      <AdminDashboardClient
        currentUser={{
          id: session.id,
          email: session.email,
          name: session.name,
          role: session.role,
        }}
        initialUsers={usersList}
        totalParcelsCount={parcels.length}
      />
    </main>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-20">
            অ্যাডমিন ড্যাশবোর্ড লোড হচ্ছে...
          </div>
        }
      >
        <AdminDashboardContent />
      </Suspense>
      <Footer />
    </div>
  );
}
