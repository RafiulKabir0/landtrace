import { NextResponse } from "next/server";
import { authenticateUser, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ইমেইল ও পাসওয়ার্ড প্রদান করা আবশ্যক / Email and password are required" },
        { status: 400 }
      );
    }

    const session = await authenticateUser(email, password);

    if (!session) {
      return NextResponse.json(
        {
          error:
            "ভুল ইমেইল বা পাসওয়ার্ড অথবা অ্যাকাউন্টটি নিষ্ক্রিয় / Invalid credentials or account deactivated",
        },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
      isActive: session.isActive,
      phoneNumber: session.phoneNumber,
      designation: session.designation,
      permittedPlots: session.permittedPlots,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        designation: session.designation,
        permittedPlots: session.permittedPlots,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "লগইন প্রক্রিয়ায় সার্ভার ত্রুটি / Server error during login" },
      { status: 500 }
    );
  }
}
