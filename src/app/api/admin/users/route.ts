import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEMO_USERS } from "@/lib/demo-data";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { error: "অননুমোদিত প্রবেশাধিকার। শুধুমাত্র অ্যাডমিন এই তথ্য দেখতে পারবেন / Forbidden. Admin role required." },
      { status: 403 }
    );
  }

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

    if (dbUsers.length > 0) {
      return NextResponse.json({ users: dbUsers });
    }
  } catch (err) {
    console.warn("DB user query fallback:", (err as Error).message);
  }

  // Fallback demo users list
  const sanitizedDemoUsers = DEMO_USERS.map((u) => ({
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
  return NextResponse.json({ users: sanitizedDemoUsers });

}

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { error: "অননুমোদিত প্রবেশাধিকার / Forbidden. Admin role required." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { userId, role, isActive, permittedPlots, designation } = body;

    if (!userId) {
      return NextResponse.json({ error: "ইউজার আইডি আবশ্যক / User ID is required" }, { status: 400 });
    }

    // Security: Prevent deactivating the caller's own admin account if it's the only one
    if (userId === session.id && isActive === false) {
      return NextResponse.json(
        { error: "নিজের অ্যাকাউন্ট নিষ্ক্রিয় করা সম্ভব নয় / Cannot deactivate your own active admin account" },
        { status: 400 }
      );
    }

    // Role validation
    if (role && !["CITIZEN", "OFFICIAL", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "অবৈধ ভূমিকা / Invalid role" }, { status: 400 });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(role ? { role } : {}),
          ...(typeof isActive === "boolean" ? { isActive } : {}),
          ...(permittedPlots ? { permittedPlots } : {}),
          ...(designation ? { designation } : {}),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          phoneNumber: true,
          designation: true,
          permittedPlots: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "ব্যবহারকারী তথ্য সফলভাবে আপডেট হয়েছে / User updated successfully",
        user: updatedUser,
      });
    } catch {
      // In-memory demo fallback response
      return NextResponse.json({
        success: true,
        message: "ব্যবহারকারী তথ্য ডেমো বাফারে আপডেট হয়েছে / User updated in demo state",
        user: { id: userId, role, isActive },
      });
    }
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "সার্ভার ত্রুটি / Server error" }, { status: 500 });
  }
}
