import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { DEMO_USERS } from "./demo-data";

export type UserRole = "CITIZEN" | "OFFICIAL" | "ADMIN";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string;
  designation?: string;
  permittedPlots: string;
  exp: number; // unix timestamp in seconds
}

export const SESSION_COOKIE_NAME = "landtrace_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Secure fallback secret for development/demo; production should provide AUTH_SECRET
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "landtrace-secure-hmac-sha256-secret-key-2026-bangladesh-landtech";

/**
 * Signs a payload with HMAC-SHA256
 */
export function createSessionToken(payload: Omit<UserSession, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const fullPayload: UserSession = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a session token
 */
export function verifySessionToken(token: string): UserSession | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encodedPayload, providedSignature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(encodedPayload)
      .digest("base64url");

    const providedBuf = Buffer.from(providedSignature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (
      providedBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(providedBuf, expectedBuf)
    ) {
      return null;
    }

    const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const session: UserSession = JSON.parse(payloadJson);

    // Check expiration
    if (session.exp && session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    if (!session.isActive) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Synchronous / Server Action session getter from next/headers
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Hashes a plaintext password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plaintext password against bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  // If hash is a bcrypt hash
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
    return bcrypt.compare(password, hash);
  }
  // Fallback for plain demo comparison if unhashed in dev
  return password === hash;
}

/**
 * Authenticates user by email & password against Neon Database or fallback Demo User Store
 */
export async function authenticateUser(
  emailInput: string,
  passwordInput: string
): Promise<UserSession | null> {
  const email = emailInput.trim().toLowerCase();

  // 1. Attempt database lookup if connected
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (dbUser) {
      if (!dbUser.isActive) return null;
      const isMatch = await comparePassword(passwordInput, dbUser.passwordHash);
      if (isMatch) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role as UserRole,
          isActive: dbUser.isActive,
          phoneNumber: dbUser.phoneNumber || undefined,
          designation: dbUser.designation || undefined,
          permittedPlots: dbUser.permittedPlots || "ALL",
          exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
        };
      }
      return null;
    }
  } catch (err) {
    console.warn("DB user authentication skipped (fallback to synthetic accounts):", (err as Error).message);
  }

  // 2. Fallback to synthetic demo users
  const demoMatch = DEMO_USERS.find((u) => u.email.toLowerCase() === email);
  if (demoMatch) {
    if (!demoMatch.isActive) return null;

    // Check against standard demo passwords
    let isValid = false;
    if (email === "citizen@demo.landtrace.gov.bd" && passwordInput === "Citizen@LandTrace2026!") {
      isValid = true;
    } else if (email === "officer@demo.landtrace.gov.bd" && passwordInput === "Officer@LandTrace2026!") {
      isValid = true;
    } else if (email === "admin@demo.landtrace.gov.bd" && passwordInput === "Admin@LandTrace2026!") {
      isValid = true;
    } else {
      isValid = await comparePassword(passwordInput, demoMatch.passwordHash);
    }

    if (isValid) {
      return {
        id: demoMatch.id,
        email: demoMatch.email,
        name: demoMatch.name,
        role: demoMatch.role,
        isActive: demoMatch.isActive,
        phoneNumber: demoMatch.phoneNumber,
        designation: demoMatch.designation,
        permittedPlots: demoMatch.permittedPlots,
        exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
      };
    }
  }

  return null;
}

/**
 * Role-based access validation
 */
export function checkRoleAuthorization(
  userRole: UserRole,
  allowedRoles: UserRole[]
): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Checks if a citizen can view a specific parcel
 */
export function canUserViewParcel(
  session: UserSession | null,
  parcelNumber: string
): boolean {
  if (!session) return false;
  if (session.role === "ADMIN" || session.role === "OFFICIAL") return true;
  if (session.permittedPlots === "ALL") return true;

  const permitted = session.permittedPlots.split(",").map((s) => s.trim().toUpperCase());
  return permitted.includes(parcelNumber.toUpperCase());
}
