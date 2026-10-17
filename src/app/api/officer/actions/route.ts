import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();

  // Only Officials and Admins can record formal investigation actions
  if (!session || (session.role !== "OFFICIAL" && session.role !== "ADMIN")) {
    return NextResponse.json(
      {
        error:
          "অননুমোদিত পদক্ষেপ। শুধুমাত্র ভূমি কর্মকর্তা ও অ্যাডমিন এই পদক্ষেপ রেকর্ড করতে পারেন / Unauthorized. Only Land Officials or Admins can record investigation actions.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { parcelId, parcelNumber, actionType, details } = body;

    if (!actionType || !details) {
      return NextResponse.json(
        { error: "পদক্ষেপের ধরন ও বিবরণ প্রদান আবশ্যক / Action type and details are required" },
        { status: 400 }
      );
    }

    const officerName = `${session.name} (${session.designation || session.role})`;
    const logDetails = parcelNumber ? `[${parcelNumber}] ${details.trim()}` : details.trim();
    let recordedLog;

    try {
      recordedLog = await prisma.auditLog.create({
        data: {
          parcelId: parcelId || null,
          userId: session.id,
          officerName,
          action: actionType,
          details: logDetails,
        },
      });
    } catch {
      // In-memory fallback
      recordedLog = {
        id: `log-${Date.now()}`,
        parcelId,
        officerName,
        action: actionType,
        details: logDetails,
        timestamp: new Date().toISOString(),
      };
    }


    // Accurate prototype disclaimer: strictly stating recorded in prototype decision support buffer
    return NextResponse.json({
      success: true,
      messageEn: `Action '${actionType}' recorded in prototype decision-support buffer. (Prototype state only; not transmitted to external government servers).`,
      messageBn: `পদক্ষেপ '${actionType}' ল্যান্ডট্রেস প্রোটোটাইপ সিদ্ধান্ত-সহায়ক বাফারে রেকর্ড করা হয়েছে। (এটি প্রোটোটাইপ সংরক্ষণ; কোনো সরকারি লাইভ পোর্টালে সরাসরি প্রেরিত হয়নি)।`,
      log: recordedLog,
    });
  } catch (error) {
    console.error("Officer action API error:", error);
    return NextResponse.json({ error: "পদক্ষেপ সংরক্ষণে সার্ভার ত্রুটি / Server error" }, { status: 500 });
  }
}
