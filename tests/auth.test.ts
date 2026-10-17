import test from "node:test";
import assert from "node:assert/strict";
import {
  createSessionToken,
  verifySessionToken,
  comparePassword,
  checkRoleAuthorization,
  canUserViewParcel,
  UserSession,
} from "../src/lib/auth";
import { DEMO_USERS } from "../src/lib/demo-data";

test("Auth: createSessionToken generates valid HMAC-SHA256 signed token", () => {
  const payload = {
    id: "usr-test-1",
    email: "test@example.com",
    name: "Test User",
    role: "CITIZEN" as const,
    isActive: true,
    permittedPlots: "PLOT-DH-1001",
  };

  const token = createSessionToken(payload);
  assert.ok(typeof token === "string");
  assert.equal(token.split(".").length, 2);

  const decoded = verifySessionToken(token);
  assert.ok(decoded !== null);
  assert.equal(decoded.email, "test@example.com");
  assert.equal(decoded.role, "CITIZEN");
});

test("Auth: verifySessionToken rejects tampered signature", () => {
  const token = createSessionToken({
    id: "usr-test-2",
    email: "attacker@example.com",
    name: "Attacker",
    role: "CITIZEN" as const,
    isActive: true,
    permittedPlots: "ALL",
  });

  const [payload] = token.split(".");
  const tamperedToken = `${payload}.tamperedSignatureString123456`;

  const decoded = verifySessionToken(tamperedToken);
  assert.equal(decoded, null);
});

test("Auth: verifySessionToken rejects deactivated accounts", () => {
  const token = createSessionToken({
    id: "usr-test-3",
    email: "deactivated@example.com",
    name: "Inactive User",
    role: "CITIZEN" as const,
    isActive: false,
    permittedPlots: "PLOT-DH-1001",
  });

  const decoded = verifySessionToken(token);
  assert.equal(decoded, null);
});

test("Auth: demo account password hashes verify with bcrypt", async () => {
  const citizen = DEMO_USERS.find((u) => u.role === "CITIZEN");
  assert.ok(citizen);
  assert.equal(citizen.email, "citizen@demo.landtrace.gov.bd");

  const isCitizenMatch = await comparePassword("Citizen@LandTrace2026!", citizen.passwordHash);
  assert.equal(isCitizenMatch, true);

  const officer = DEMO_USERS.find((u) => u.role === "OFFICIAL");
  assert.ok(officer);
  assert.equal(officer.email, "officer@demo.landtrace.gov.bd");

  const isOfficerMatch = await comparePassword("Officer@LandTrace2026!", officer.passwordHash);
  assert.equal(isOfficerMatch, true);

  const admin = DEMO_USERS.find((u) => u.role === "ADMIN");
  assert.ok(admin);
  assert.equal(admin.email, "admin@demo.landtrace.gov.bd");

  const isAdminMatch = await comparePassword("Admin@LandTrace2026!", admin.passwordHash);
  assert.equal(isAdminMatch, true);

  const isWrongMatch = await comparePassword("WrongPassword123!", admin.passwordHash);
  assert.equal(isWrongMatch, false);
});


test("Auth: checkRoleAuthorization enforces role-based access control", () => {
  // Citizen permissions
  assert.equal(checkRoleAuthorization("CITIZEN", ["CITIZEN"]), true);
  assert.equal(checkRoleAuthorization("CITIZEN", ["OFFICIAL", "ADMIN"]), false);

  // Land Official permissions
  assert.equal(checkRoleAuthorization("OFFICIAL", ["OFFICIAL", "ADMIN"]), true);
  assert.equal(checkRoleAuthorization("OFFICIAL", ["ADMIN"]), false);

  // Admin permissions
  assert.equal(checkRoleAuthorization("ADMIN", ["ADMIN"]), true);
  assert.equal(checkRoleAuthorization("ADMIN", ["OFFICIAL", "ADMIN"]), true);
  assert.equal(checkRoleAuthorization("ADMIN", ["CITIZEN", "OFFICIAL", "ADMIN"]), true);
});

test("Auth: canUserViewParcel restricts unauthorized records for citizens", () => {
  const citizenSession: UserSession = {
    id: "c1",
    email: "citizen@demo.landtrace.gov.bd",
    name: "Citizen Karim",
    role: "CITIZEN",
    isActive: true,
    permittedPlots: "PLOT-DH-1001",
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const officialSession: UserSession = {
    id: "o1",
    email: "officer@demo.landtrace.gov.bd",
    name: "AC Land Rahman",
    role: "OFFICIAL",
    isActive: true,
    permittedPlots: "ALL",
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  // Citizen can view their permitted plot
  assert.equal(canUserViewParcel(citizenSession, "PLOT-DH-1001"), true);
  // Citizen cannot view other contested parcels
  assert.equal(canUserViewParcel(citizenSession, "PLOT-DH-2045"), false);
  assert.equal(canUserViewParcel(citizenSession, "PLOT-BAR-7703"), false);

  // Officer can view all parcels
  assert.equal(canUserViewParcel(officialSession, "PLOT-DH-1001"), true);
  assert.equal(canUserViewParcel(officialSession, "PLOT-DH-2045"), true);
  assert.equal(canUserViewParcel(officialSession, "PLOT-BAR-7703"), true);

  // Unauthenticated user cannot view
  assert.equal(canUserViewParcel(null, "PLOT-DH-1001"), false);
});
