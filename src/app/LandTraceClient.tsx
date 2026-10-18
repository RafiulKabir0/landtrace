"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  ShieldAlert,
  Search,
  Database,
  FileText,
  AlertTriangle,
  History,
  CheckCircle2,
  Sparkles,
  Layers,
  MapPin,
  RefreshCw,
  Scale,
  UserCheck,
  Printer,
  FileCheck2,
  AlertOctagon,
  Info,
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  LogOut,
  LogIn,
  Building2,
  Home,
  Eye,
  EyeOff,
  BookOpen,
  Phone,
  ExternalLink,
  Lock,
} from "lucide-react";

import { auditParcel, ParcelRecord } from "@/lib/detection-engine";
import {
  Language,
  STORAGE_KEY,
  translations,
  formatNumber,
  formatArea,
  formatScore,
  formatDate,
  formatTime,
  getAnomalyTypeLabel,
  getSeverityLabel,
  getRecommendedAction,
} from "@/lib/i18n";
import { UserRole, UserSession } from "@/lib/auth";

export interface Deed {
  id: string;
  deedNumber: string;
  sellerName: string;
  buyerName: string;
  transferredArea: number;
  deedDate: string | Date;
  registrationOffice: string;
  deedType: string;
  serialOrder?: number;
  isVerified?: boolean;
  dagNumber?: string;
  surveyType?: string;
}

export interface Mutation {
  id: string;
  caseNumber: string;
  applicantName: string;
  mutatedArea: number;
  khatianNumber: string;
  approvalDate: string | Date;
  officerName: string;
  status: string;
  dagNumber?: string;
}

export interface AnomalyItem {
  id?: string;
  anomalyType?: string;
  severity: string;
  title: string;
  description: string;
  evidence?: string;
}

export interface Parcel extends ParcelRecord {
  dagNumber?: string;
  surveyType?: string;
  ownershipShares?: string;
  provenance?: string;
  deeds: Deed[];
  mutations: Mutation[];
  anomalies?: AnomalyItem[];
}

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

interface Props {
  initialParcels: Parcel[];
  initialSession?: UserSession | null;
}

export default function LandTraceClient({ initialParcels, initialSession }: Props) {
  // Default language is Bangla on first visit, persisted in localStorage
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
        if (saved === "bn" || saved === "en") return saved;
      } catch {}
    }
    return "bn";
  });

  // Current authenticated user session (null by default for public guests, or initial server session)
  const [session, setSession] = useState<UserSession | null>(() => {
    if (initialSession) return initialSession;
    return null;
  });

  // Supported Navigation Views across the 5 Layers
  const [activeTab, setActiveTab] = useState<
    | "HOME"
    | "LOGIN_CITIZEN"
    | "LOGIN_OFFICIAL"
    | "LOGIN_ADMIN"
    | "DASHBOARD"
    | "INVESTIGATION"
    | "TRANSFER_CHECK"
    | "ALERTS"
    | "ADMIN"
  >(() => (initialSession ? "DASHBOARD" : "HOME"));

  const navigateHomeSection = (sectionId: string) => {
    if (activeTab !== "HOME") {
      setActiveTab("HOME");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "FLAGGED">("ALL");
  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    initialParcels[0]?.id || ""
  );

  // Layer 1: Public Homepage Quick Search State
  const [homeSearchTerm, setHomeSearchTerm] = useState("");
  const [homeSearchResult, setHomeSearchResult] = useState<Parcel | null>(null);
  const [homeSearchAttempted, setHomeSearchAttempted] = useState(false);

  // Verification & Action States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<"LOGIN" | "REGISTER" | null>(null);
  const [authRoleTab, setAuthRoleTab] = useState<UserRole>("CITIZEN");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Auth form inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Officer Notes & Action trail
  const [customNoteText, setCustomNoteText] = useState("");
  const [auditNotes, setAuditNotes] = useState<string[]>([
    "[10:30 AM] Initial custody chain loaded into decision-support buffer — ACL-DH-2026",
  ]);

  // Admin User Management State
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([
    {
      id: "usr-citizen-001",
      email: "citizen@demo.landtrace.gov.bd",
      name: "Mohammad Abdul Karim (নাগরিক)",
      role: "CITIZEN",
      isActive: true,
      phoneNumber: "01700-000001",
      designation: "জমি ক্রেতা / নাগরিক আবেদনকারী",
      permittedPlots: "PLOT-DH-1001",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "usr-officer-001",
      email: "officer@demo.landtrace.gov.bd",
      name: "A. S. M. Rahman (ভূমি কর্মকর্তা)",
      role: "OFFICIAL",
      isActive: true,
      phoneNumber: "01800-000002",
      designation: "সহকারী কমিশনার (ভূমি) / সাব-রেজিস্ট্রার",
      permittedPlots: "ALL",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "usr-admin-001",
      email: "admin@demo.landtrace.gov.bd",
      name: "System Administrator (সিস্টেম অ্যাডমিন)",
      role: "ADMIN",
      isActive: true,
      phoneNumber: "01900-000003",
      designation: "ভূমি মন্ত্রণালয় আইসিটি সেল সুপার-অ্যাডমিন",
      permittedPlots: "ALL",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ]);

  // Pre-registration Transfer Risk Check Simulator state
  const [simSeller, setSimSeller] = useState("");
  const [simBuyer, setSimBuyer] = useState("");
  const [simArea, setSimArea] = useState<number>(5.0);
  const [simDate, setSimDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [simPlotId, setSimPlotId] = useState<string>(initialParcels[0]?.id || "");
  const [simResult, setSimResult] = useState<{
    tested: boolean;
    pass: boolean;
    reasons: string[];
  } | null>(null);

  // Language switch handler: immediate translation without reload + persists to localStorage
  const switchLanguage = (newLang: Language) => {
    if (newLang === lang) return;
    setLang(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
      }
    } catch {}
  };

  const t = translations[lang];

  // Permitted Parcels based on user role & authorizations
  const accessibleParcels = useMemo(() => {
    if (!session) return [];
    if (session.role === "ADMIN" || session.role === "OFFICIAL") {
      return initialParcels;
    }
    // Citizen role: filter to designated / permitted parcels
    if (session.permittedPlots === "ALL") return initialParcels;
    const allowed = session.permittedPlots
      .split(",")
      .map((s) => s.trim().toUpperCase());
    return initialParcels.filter((p) => allowed.includes(p.parcelNumber.toUpperCase()));
  }, [initialParcels, session]);

  // Filtered parcels based on search and status
  const filteredParcels = useMemo(() => {
    return accessibleParcels.filter((p) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        p.parcelNumber.toLowerCase().includes(q) ||
        (p.dagNumber && p.dagNumber.toLowerCase().includes(q)) ||
        p.khatianNumber.toLowerCase().includes(q) ||
        p.mouza.toLowerCase().includes(q) ||
        p.currentOwner.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.deeds.some((d) => d.deedNumber.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? p.status === "ACTIVE"
          : p.status === "FLAGGED";

      return matchesSearch && matchesStatus;
    });
  }, [accessibleParcels, searchTerm, statusFilter]);

  const selectedParcel = useMemo(() => {
    return (
      accessibleParcels.find((p) => p.id === selectedParcelId) ||
      filteredParcels[0] ||
      accessibleParcels[0] ||
      null
    );
  }, [accessibleParcels, selectedParcelId, filteredParcels]);

  // Run dynamic engine audit on selected parcel
  const currentAudit = useMemo(() => {
    if (!selectedParcel) return null;
    return auditParcel(selectedParcel);
  }, [selectedParcel]);

  // Core Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = accessibleParcels.length;
    const clean = accessibleParcels.filter((p) => p.status === "ACTIVE").length;
    const flagged = total - clean;
    return { total, clean, flagged };
  }, [accessibleParcels]);

  // Quick Demo Role Switcher for instant competition demonstration
  const handleQuickDemoSwitch = async (role: UserRole) => {
    let email = "officer@demo.landtrace.gov.bd";
    let password = "Officer@LandTrace2026!";
    if (role === "CITIZEN") {
      email = "citizen@demo.landtrace.gov.bd";
      password = "Citizen@LandTrace2026!";
    } else if (role === "ADMIN") {
      email = "admin@demo.landtrace.gov.bd";
      password = "Admin@LandTrace2026!";
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setSession({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          isActive: true,
          designation: data.user.designation,
          permittedPlots: data.user.permittedPlots,
          exp: Math.floor(Date.now() / 1000) + 86400 * 7,
        });
        setActiveTab("DASHBOARD");
      }
    } catch {
      // In-memory fallback if server offline
      if (role === "CITIZEN") {
        setSession({
          id: "usr-citizen-001",
          email: "citizen@demo.landtrace.gov.bd",
          name: "Mohammad Abdul Karim (নাগরিক)",
          role: "CITIZEN",
          isActive: true,
          phoneNumber: "01700-000001",
          designation: "জমি ক্রেতা / নাগরিক আবেদনকারী",
          permittedPlots: "PLOT-DH-1001",
          exp: Math.floor(Date.now() / 1000) + 86400 * 7,
        });
      } else if (role === "ADMIN") {
        setSession({
          id: "usr-admin-001",
          email: "admin@demo.landtrace.gov.bd",
          name: "System Administrator (সিস্টেম অ্যাডমিন)",
          role: "ADMIN",
          isActive: true,
          phoneNumber: "01900-000003",
          designation: "ভূমি মন্ত্রণালয় আইসিটি সেল সুপার-অ্যাডমিন",
          permittedPlots: "ALL",
          exp: Math.floor(Date.now() / 1000) + 86400 * 7,
        });
      } else {
        setSession({
          id: "usr-officer-001",
          email: "officer@demo.landtrace.gov.bd",
          name: "A. S. M. Rahman (ভূমি কর্মকর্তা)",
          role: "OFFICIAL",
          isActive: true,
          phoneNumber: "01800-000002",
          designation: "সহকারী কমিশনার (ভূমি) / সাব-রেজিস্ট্রার",
          permittedPlots: "ALL",
          exp: Math.floor(Date.now() / 1000) + 86400 * 7,
        });
      }
      setActiveTab("DASHBOARD");
    }
  };

  // Pre-fill demo credentials in the login modal
  const fillDemoCredentials = (role: UserRole) => {
    setAuthRoleTab(role);
    if (role === "CITIZEN") {
      setLoginEmail("citizen@demo.landtrace.gov.bd");
      setLoginPassword("Citizen@LandTrace2026!");
    } else if (role === "OFFICIAL") {
      setLoginEmail("officer@demo.landtrace.gov.bd");
      setLoginPassword("Officer@LandTrace2026!");
    } else if (role === "ADMIN") {
      setLoginEmail("admin@demo.landtrace.gov.bd");
      setLoginPassword("Admin@LandTrace2026!");
    }
  };

  // Layer 1: Public Homepage Quick Search Handler
  const handleHomeSearch = (query?: string) => {
    const q = (query !== undefined ? query : homeSearchTerm).toLowerCase().trim();
    if (!q) {
      setHomeSearchResult(null);
      setHomeSearchAttempted(false);
      return;
    }
    setHomeSearchAttempted(true);
    const match = initialParcels.find((p) =>
      p.parcelNumber.toLowerCase().includes(q) ||
      (p.dagNumber && p.dagNumber.toLowerCase().includes(q)) ||
      p.khatianNumber.toLowerCase().includes(q) ||
      p.mouza.toLowerCase().includes(q) ||
      p.currentOwner.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.deeds.some((d) => d.deedNumber.toLowerCase().includes(q))
    );
    setHomeSearchResult(match || null);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setSession(null);
    setActiveTab("HOME");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Login failed");
        return;
      }
      setSession(data.user);
      setShowAuthModal(null);
      setLoginPassword("");
      setActiveTab("DASHBOARD");
    } catch {
      setAuthError("Network error during login");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phoneNumber: regPhone,
          password: regPassword,
          role: "CITIZEN",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Registration failed");
        return;
      }
      setSession(data.user);
      setShowAuthModal(null);
      setRegPassword("");
      setActiveTab("DASHBOARD");
    } catch {
      setAuthError("Network error during registration");
    }
  };

  // Primary action: Verify Land Record
  const handleVerifyRecord = () => {
    setIsVerifying(true);
    setVerifyNotice(null);

    // If search term matches a parcel, select it
    if (searchTerm.trim() !== "") {
      const match = accessibleParcels.find((p) => {
        const q = searchTerm.toLowerCase().trim();
        return (
          p.parcelNumber.toLowerCase().includes(q) ||
          (p.dagNumber && p.dagNumber.toLowerCase().includes(q)) ||
          p.khatianNumber.toLowerCase().includes(q) ||
          p.mouza.toLowerCase().includes(q) ||
          p.deeds.some((d) => d.deedNumber.toLowerCase().includes(q))
        );
      });
      if (match) {
        setSelectedParcelId(match.id);
      }
    }

    setTimeout(() => {
      setIsVerifying(false);
      const target = selectedParcel;
      if (target) {
        const isFlagged = target.status === "FLAGGED";
        setVerifyNotice(
          isFlagged
            ? t.verifyNoticeWarning(target.parcelNumber)
            : t.verifyNoticeSuccess(target.parcelNumber)
        );
      }
    }, 350);
  };

  // Switch to dedicated investigation view
  const openInvestigationView = (parcelId: string) => {
    setSelectedParcelId(parcelId);
    setActiveTab("INVESTIGATION");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Officer Actions with realistic prototype buffer persistence and feedback
  const handleOfficerAction = async (actionTitle: string) => {
    if (!session || (session.role !== "OFFICIAL" && session.role !== "ADMIN")) {
      setActionFeedback(t.citizenRestrictedMsg);
      return;
    }

    const timeString = formatTime(new Date(), lang);
    const newNote = `[${timeString}] ${actionTitle} — ${selectedParcel?.parcelNumber || "Plot"}`;
    setAuditNotes((prev) => [newNote, ...prev]);

    try {
      const res = await fetch("/api/officer/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: selectedParcel?.id,
          parcelNumber: selectedParcel?.parcelNumber,
          actionType: actionTitle,
          details: `Officer executed ${actionTitle} on ${selectedParcel?.parcelNumber}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback(lang === "bn" ? data.messageBn : data.messageEn);
      }
    } catch {
      setActionFeedback(t.actionRecordedNotice(actionTitle));
    }

    setTimeout(() => setActionFeedback(null), 5000);
  };

  const handleSaveCustomNote = async () => {
    if (!customNoteText.trim()) return;
    const timeString = formatTime(new Date(), lang);
    const prefix = lang === "bn" ? "মন্তব্য" : "Note";
    const newNote = `[${timeString}] ${prefix} on ${selectedParcel?.parcelNumber}: "${customNoteText.trim()}"`;
    setAuditNotes((prev) => [newNote, ...prev]);

    try {
      await fetch("/api/officer/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: selectedParcel?.id,
          parcelNumber: selectedParcel?.parcelNumber,
          actionType: "INVESTIGATION_NOTE_ADDED",
          details: customNoteText.trim(),
        }),
      });
    } catch {}

    setCustomNoteText("");
    setShowNoteModal(false);
    setActionFeedback(t.actionRecordedNotice("তদন্ত নোট"));
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Admin user status/role update
  const handleAdminUpdateUser = async (
    userId: string,
    updatedFields: Partial<AdminUserItem>
  ) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updatedFields } : u))
    );
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updatedFields }),
      });
    } catch {}
  };

  const runPreRegistrationCheck = () => {
    const targetPlot = accessibleParcels.find((p) => p.id === simPlotId);
    if (!targetPlot) return;

    const reasons: string[] = [];
    const normalizedSeller = simSeller.trim().toLowerCase();

    // Check 1: Does seller exist in preceding buyers or initial survey owner?
    const hasPriorTitle =
      targetPlot.deeds.some(
        (d) => d.buyerName.trim().toLowerCase() === normalizedSeller
      ) ||
      targetPlot.deeds.some(
        (d) =>
          d.sellerName.trim().toLowerCase() === normalizedSeller &&
          d.serialOrder === 1
      ) ||
      targetPlot.currentOwner.trim().toLowerCase() === normalizedSeller;

    if (!hasPriorTitle) {
      reasons.push(
        t.simReasonChainBreak(
          simSeller || (lang === "bn" ? "অনির্দিষ্ট দাতা" : "Unspecified Seller")
        )
      );
    }

    // Check 2: Area overflow
    if (simArea > targetPlot.totalArea) {
      reasons.push(t.simReasonAreaExceeded(simArea, targetPlot.totalArea));
    }

    // Check 3: Has this seller already sold?
    const alreadySold = targetPlot.deeds.some(
      (d) => d.sellerName.trim().toLowerCase() === normalizedSeller
    );
    if (alreadySold) {
      reasons.push(t.simReasonDoubleSelling());
    }

    setSimResult({
      tested: true,
      pass: reasons.length === 0,
      reasons,
    });
  };

  // Helper for status badge
  const getIssueLabel = (parcel: Parcel) => {
    if (parcel.status === "ACTIVE") {
      return {
        label: t.cleanStatus,
        color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      };
    }
    const firstAnomaly = parcel.anomalies?.[0];
    if (firstAnomaly?.anomalyType) {
      const typeLabel = getAnomalyTypeLabel(firstAnomaly.anomalyType, lang);
      return {
        label: typeLabel,
        color:
          firstAnomaly.anomalyType === "DOUBLE_SELLING" ||
          firstAnomaly.anomalyType === "CHAIN_BREAK"
            ? "bg-red-50 text-red-800 border-red-200"
            : "bg-amber-50 text-amber-900 border-amber-200",
      };
    }
    return {
      label: t.flaggedStatus,
      color: "bg-red-50 text-red-800 border-red-200",
    };
  };

  return (

    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. TOP HEADER & OFFICIAL BRANDING */}
      <header className="bg-white border-b border-slate-200/90 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-normal">
                    {t.appName}
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-teal-50 text-teal-800 border border-teal-200 leading-normal">
                    {t.badge}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] rounded bg-slate-100 text-slate-600 border border-slate-200 leading-normal">
                    {t.govtBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">{t.tagline}</p>
              </div>
            </div>

            {/* Navigation & Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Public Menu (when not logged in) */}
              {!session && (
                <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 mr-1">
                  <button
                    onClick={() => setActiveTab("HOME")}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                      activeTab === "HOME"
                        ? "text-teal-800 bg-teal-50"
                        : "hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {t.navHome}
                  </button>
                  <button
                    onClick={() => navigateHomeSection("services-section")}
                    className="px-2.5 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    {t.navServices}
                  </button>
                  <button
                    onClick={() => navigateHomeSection("about-section")}
                    className="px-2.5 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    {t.navAbout}
                  </button>
                  <button
                    onClick={() => navigateHomeSection("guide-section")}
                    className="px-2.5 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    {t.navGuide}
                  </button>
                  <button
                    onClick={() => navigateHomeSection("contact-section")}
                    className="px-2.5 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    {t.navContact}
                  </button>
                </div>
              )}

              {/* Authenticated User / Role Display */}
              {session ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50/80 border border-teal-200 text-xs text-teal-900">
                  <UserCheck className="h-3.5 w-3.5 text-teal-700 flex-shrink-0" />
                  <span className="font-semibold">{session.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-200/60 font-bold">
                    {session.role === "CITIZEN"
                      ? t.roleCitizen
                      : session.role === "ADMIN"
                      ? t.roleAdmin
                      : t.roleOfficial}
                  </span>
                  <button
                    onClick={handleLogout}
                    title={t.logoutBtn}
                    className="ml-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      fillDemoCredentials("CITIZEN");
                      setActiveTab("LOGIN_CITIZEN");
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "LOGIN_CITIZEN"
                        ? "bg-teal-800 text-white shadow-xs"
                        : "bg-teal-700 hover:bg-teal-800 text-white"
                    }`}
                  >
                    <UserCheck className="h-3 w-3" />
                    <span>{t.authTabCitizen}</span>
                  </button>
                  <button
                    onClick={() => {
                      fillDemoCredentials("OFFICIAL");
                      setActiveTab("LOGIN_OFFICIAL");
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "LOGIN_OFFICIAL"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300"
                    }`}
                  >
                    <Building2 className="h-3 w-3 text-teal-700" />
                    <span>{t.authTabOfficial}</span>
                  </button>
                  <button
                    onClick={() => {
                      fillDemoCredentials("ADMIN");
                      setActiveTab("LOGIN_ADMIN");
                    }}
                    className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "LOGIN_ADMIN"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300"
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3 text-teal-700" />
                    <span>{t.authTabAdmin}</span>
                  </button>
                </div>
              )}

              {/* Database indicator */}
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
                <Database className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-mono text-[11px] text-slate-700">{t.dbConnected}</span>
              </div>

              {/* Language Toggle: Small, clearly labeled 'বাংলা | English' toggle */}
              <div
                className="flex items-center rounded-lg border border-slate-300 bg-slate-100 p-0.5 shadow-xs"
                role="group"
                aria-label="Language selection"
              >
                <button
                  type="button"
                  onClick={() => switchLanguage("bn")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all leading-normal ${
                    lang === "bn"
                      ? "bg-white text-teal-800 shadow-xs ring-1 ring-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  aria-pressed={lang === "bn"}
                >
                  <span>বাংলা</span>
                </button>
                <span className="text-slate-300 text-xs px-0.5 select-none font-bold">|</span>
                <button
                  type="button"
                  onClick={() => switchLanguage("en")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all leading-normal ${
                    lang === "en"
                      ? "bg-white text-teal-800 shadow-xs ring-1 ring-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  aria-pressed={lang === "en"}
                >
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Demo Role Switcher Bar for competition evaluators */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-600 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
                {t.quickDemoRolesTitle}
              </span>
              <button
                onClick={() => handleQuickDemoSwitch("CITIZEN")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                  session?.role === "CITIZEN"
                    ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {t.demoCitizenBtn}
              </button>
              <button
                onClick={() => handleQuickDemoSwitch("OFFICIAL")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                  session?.role === "OFFICIAL"
                    ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {t.demoOfficerBtn}
              </button>
              <button
                onClick={() => handleQuickDemoSwitch("ADMIN")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                  session?.role === "ADMIN"
                    ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {t.demoAdminBtn}
              </button>
            </div>

            <div className="flex items-center gap-1 text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 w-fit text-[11px]">
              <Info className="h-3 w-3 text-amber-700 flex-shrink-0" />
              <span>{t.syntheticNotice}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Action feedback alert banner */}
      {actionFeedback && (
        <div className="bg-teal-900 text-white py-2 px-4 shadow-sm border-b border-teal-950 text-xs flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-300" />
              {actionFeedback}
            </span>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-teal-200 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 py-2 overflow-x-auto">
            {/* If in role login view */}
            {activeTab === "LOGIN_CITIZEN" ||
            activeTab === "LOGIN_OFFICIAL" ||
            activeTab === "LOGIN_ADMIN" ? (
              <div className="flex items-center justify-between w-full text-xs">
                <button
                  onClick={() => setActiveTab("HOME")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-teal-800 hover:bg-slate-100 font-semibold"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t.backToHomeBtn}</span>
                </button>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">
                    {activeTab === "LOGIN_CITIZEN"
                      ? `👤 ${t.loginCitizenTitle}`
                      : activeTab === "LOGIN_OFFICIAL"
                      ? `🏛️ ${t.loginOfficialTitle}`
                      : `🛡️ ${t.loginAdminTitle}`}
                  </span>
                  <div className="hidden sm:flex items-center gap-2 border-l pl-3 border-slate-200">
                    <button
                      onClick={() => {
                        fillDemoCredentials("CITIZEN");
                        setActiveTab("LOGIN_CITIZEN");
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-semibold ${
                        activeTab === "LOGIN_CITIZEN"
                          ? "bg-teal-50 text-teal-800 font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {lang === "bn" ? "নাগরিক" : "Citizen"}
                    </button>
                    <button
                      onClick={() => {
                        fillDemoCredentials("OFFICIAL");
                        setActiveTab("LOGIN_OFFICIAL");
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-semibold ${
                        activeTab === "LOGIN_OFFICIAL"
                          ? "bg-teal-50 text-teal-800 font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {lang === "bn" ? "কর্মকর্তা" : "Officer"}
                    </button>
                    <button
                      onClick={() => {
                        fillDemoCredentials("ADMIN");
                        setActiveTab("LOGIN_ADMIN");
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-semibold ${
                        activeTab === "LOGIN_ADMIN"
                          ? "bg-teal-50 text-teal-800 font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {lang === "bn" ? "প্রশাসক" : "Admin"}
                    </button>
                  </div>
                </div>
              </div>
            ) : !session ? (
              // Public View
              <div className="flex items-center gap-2 text-xs overflow-x-auto w-full py-0.5">
                <button
                  onClick={() => setActiveTab("HOME")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap leading-normal ${
                    activeTab === "HOME"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>{t.tabHome}</span>
                </button>
                <button
                  onClick={() => navigateHomeSection("services-section")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 whitespace-nowrap"
                >
                  <Layers className="h-3.5 w-3.5 text-teal-700" />
                  <span>{t.navServices}</span>
                </button>
                <button
                  onClick={() => navigateHomeSection("about-section")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 whitespace-nowrap"
                >
                  <Info className="h-3.5 w-3.5 text-teal-700" />
                  <span>{t.navAbout}</span>
                </button>
                <button
                  onClick={() => navigateHomeSection("guide-section")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 whitespace-nowrap"
                >
                  <BookOpen className="h-3.5 w-3.5 text-teal-700" />
                  <span>{t.navGuide}</span>
                </button>
                <button
                  onClick={() => navigateHomeSection("contact-section")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 whitespace-nowrap"
                >
                  <Phone className="h-3.5 w-3.5 text-teal-700" />
                  <span>{t.navContact}</span>
                </button>
              </div>
            ) : (
              // Authenticated View
              <>
                <button
                  onClick={() => setActiveTab("HOME")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap leading-normal ${
                    activeTab === "HOME"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>{t.tabHome}</span>
                </button>

                <button
                  onClick={() => setActiveTab("DASHBOARD")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap leading-normal ${
                    activeTab === "DASHBOARD"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{session.role === "CITIZEN" ? t.citizenMyPlot : t.tabDashboard}</span>
                </button>

                {(session.role === "OFFICIAL" || session.role === "ADMIN") && (
                  <button
                    onClick={() => setActiveTab("INVESTIGATION")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap leading-normal ${
                      activeTab === "INVESTIGATION"
                        ? "bg-teal-700 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>{t.tabInvestigation}</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab("TRANSFER_CHECK")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap leading-normal ${
                    activeTab === "TRANSFER_CHECK"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FileCheck2 className="h-3.5 w-3.5" />
                  <span>{t.tabTransferCheck}</span>
                </button>

                {(session.role === "OFFICIAL" || session.role === "ADMIN") && (
                  <button
                    onClick={() => setActiveTab("ALERTS")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap leading-normal ${
                      activeTab === "ALERTS"
                        ? "bg-teal-700 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>{t.tabAlerts}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                      {formatNumber(summaryMetrics.flagged, lang)}
                    </span>
                  </button>
                )}

                {session.role === "ADMIN" && (
                  <button
                    onClick={() => setActiveTab("ADMIN")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap leading-normal ${
                      activeTab === "ADMIN"
                        ? "bg-teal-700 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{t.tabAdmin}</span>
                  </button>
                )}
              </>
            )}
          </nav>
        </div>
      </div>

      {/* 3. MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 0: LAYER 1 — PUBLIC HOMEPAGE */}
        {activeTab === "HOME" && (
          <div className="space-y-10 py-2">
            {/* 1. HERO SECTION (2-COLUMN BANGLADESH LAND VISUAL) */}
            <section className="bg-gradient-to-b from-white to-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Text & Primary Actions */}
                <div className="lg:col-span-7 space-y-5 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                    <span>{t.homeHeroBadge}</span>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      {t.homeHeroTitle}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {t.homeHeroSubtitle}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <button
                      onClick={() => {
                        const el = document.getElementById("public-search-section");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-sm transition-all w-full sm:w-auto"
                    >
                      <Search className="h-4 w-4" />
                      <span>{t.homeVerifyCta}</span>
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById("services-section");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-xs transition-all w-full sm:w-auto"
                    >
                      <Layers className="h-4 w-4 text-teal-700" />
                      <span>{t.heroSecondaryCta}</span>
                    </button>
                  </div>

                  {/* Trust micro-badges */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex-wrap">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
                      {lang === "bn" ? "৫টি অ্যালগরিদমিক ডিটেকশন মডেল" : "5 Algorithmic Detection Models"}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {lang === "bn" ? "১০০% নিরাপদ সার্ভার নীতি" : "100% Server Role Validation"}
                    </span>
                  </div>
                </div>

                {/* Right Column: Bangladesh Land / Cadastral Graphic */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden border border-teal-200/80 shadow-md bg-white p-2">
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src="/bangladesh_land_hero.jpg"
                        alt={lang === "bn" ? "বাংলাদেশ ডিজিটাল ক্যাডাস্ট্রাল জরিপ ও ভূমি স্বত্ব চিত্র" : "Bangladesh Digital Cadastral Land Graphic"}
                        fill
                        className="object-cover object-center"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                        <span className="text-xs font-semibold text-white drop-shadow-sm flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-teal-300" />
                          {lang === "bn"
                            ? "ডিজিটাল ক্যাডাস্ট্রাল জরিপ ও ভূমি স্বত্ব ধারাবাহিকতা পর্যবেক্ষণ"
                            : "Cadastral Survey & Ownership Chain Monitoring"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. INSTANT PUBLIC QUICK SEARCH & VERIFICATION */}
            <section id="public-search-section" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
                  <Search className="h-5 w-5 text-teal-700" />
                  <span>{t.homeQuickSearchTitle}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {t.homeQuickSearchSubtitle}
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t.homeQuickSearchPlaceholder}
                      value={homeSearchTerm}
                      onChange={(e) => setHomeSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleHomeSearch();
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    onClick={() => handleHomeSearch()}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-sm transition-all whitespace-nowrap"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{t.homeQuickVerifyBtn}</span>
                  </button>
                </div>

                {/* Sample quick search chips */}
                <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                  <span className="text-slate-400 font-medium">{t.homeSampleQueriesLabel}</span>
                  {[
                    { label: lang === "bn" ? "দাগ ৪০২ (তেজগাঁও — বৈধ)" : "Dag 402 (Clean)", q: "402" },
                    { label: lang === "bn" ? "দাগ ১১০৫ (গুলশান — দ্বৈত বিক্রয়)" : "Dag 1105 (Double Selling)", q: "1105" },
                    { label: lang === "bn" ? "দাগ ৮৮০ (পাঁচলাইশ — চেইন ব্রেক)" : "Dag 880 (Chain Break)", q: "880" },
                    { label: lang === "bn" ? "দাগ ২০১ (সিলেট — পরিমাপ অমিল)" : "Dag 201 (Area Mismatch)", q: "201" },
                    { label: lang === "bn" ? "দাগ ৬১০ (বোয়ালিয়া — নামজারি অমিল)" : "Dag 610 (Mutation Mismatch)", q: "610" },
                    { label: lang === "bn" ? "দাগ ৯০৪ (খুলনা — অস্বাভাবিক সময়)" : "Dag 904 (Timing)", q: "904" },
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setHomeSearchTerm(chip.q);
                        handleHomeSearch(chip.q);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 text-[11px] font-medium transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public verification search result */}
              {homeSearchAttempted && (
                <div className="max-w-2xl mx-auto pt-2">
                  {homeSearchResult ? (
                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-sm space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
                            {t.homePublicResultTitle}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 font-mono mt-0.5">
                            {homeSearchResult.parcelNumber}
                            {homeSearchResult.dagNumber && (
                              <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-slate-200 rounded text-slate-700">
                                {t.dagNumber}: {formatNumber(homeSearchResult.dagNumber, lang)}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {homeSearchResult.mouza}, {homeSearchResult.upazila}, {homeSearchResult.district}
                          </p>
                        </div>

                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                            homeSearchResult.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}
                        >
                          {homeSearchResult.status === "ACTIVE" ? t.cleanStatus : t.flaggedStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">{t.khatian}</span>
                          <span className="font-bold text-slate-800 font-mono">{homeSearchResult.khatianNumber}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">{t.surveyType}</span>
                          <span className="font-bold text-teal-800">{homeSearchResult.surveyType || "RS"}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">{t.totalArea}</span>
                          <span className="font-bold text-slate-800">{formatArea(homeSearchResult.totalArea, lang)}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">{t.currentOwner}</span>
                          <span className="font-medium text-slate-800 truncate block">{homeSearchResult.currentOwner}</span>
                        </div>
                      </div>

                      {/* Prompt to log in to inspect full chain */}
                      <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/90 text-xs text-teal-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-teal-700 mt-0.5 flex-shrink-0" />
                          <span>{t.homePublicResultPrompt}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedParcelId(homeSearchResult.id);
                            if (session) {
                              setActiveTab("INVESTIGATION");
                            } else {
                              fillDemoCredentials("CITIZEN");
                              setActiveTab("LOGIN_CITIZEN");
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all whitespace-nowrap self-end sm:self-auto"
                        >
                          {session ? t.openDossierBtn : t.homeLoginToInspectBtn}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-1">
                      <p className="text-sm font-semibold text-slate-700">{t.emptySearchTitle}</p>
                      <p className="text-xs text-slate-500">{t.emptySearchDesc}</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* 3. SIX CORE PROTOTYPE FEATURES */}
            <section id="services-section" className="space-y-6 pt-2">
              <div className="text-center max-w-2xl mx-auto space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                  <Layers className="h-3.5 w-3.5 text-teal-700" />
                  <span>{t.navServices}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t.featuresSectionTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                  {t.featuresSectionSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. ভূমি রেকর্ড অনুসন্ধান */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.feat1Title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{t.feat1Desc}</p>
                  </div>
                </div>

                {/* 2. মালিকানার ধারাবাহিকতা যাচাই */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.feat2Title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{t.feat2Desc}</p>
                  </div>
                </div>

                {/* 3. দলিল যাচাই */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.feat3Title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{t.feat3Desc}</p>
                  </div>
                </div>

                {/* 4. নামজারি রেকর্ডের সঙ্গে তুলনা */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.feat4Title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{t.feat4Desc}</p>
                  </div>
                </div>

                {/* 5. জমির পরিমাণের অমিল শনাক্তকরণ */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.feat5Title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{t.feat5Desc}</p>
                  </div>
                </div>

                {/* 6. তদন্ত প্রতিবেদন */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.feat6Title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{t.feat6Desc}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. HOW IT WORKS / USER GUIDE SECTION */}
            <section id="guide-section" className="space-y-5 pt-2">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                  <BookOpen className="h-3.5 w-3.5 text-teal-700" />
                  <span>{t.navGuide}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {t.homeHowItWorksTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  {t.homeHowItWorksSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
                  <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm">
                    ১
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{t.guideStep1Title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.guideStep1Desc}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
                  <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm">
                    ২
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{t.guideStep2Title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.guideStep2Desc}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
                  <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm">
                    ৩
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{t.guideStep3Title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.guideStep3Desc}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
                  <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm">
                    ৪
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{t.guideStep4Title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.guideStep4Desc}</p>
                </div>
              </div>
            </section>

            {/* 5. 5 DETECTION CAPABILITIES (P3 PROBLEM STATEMENT) */}
            <section className="space-y-5">
              <div className="text-center max-w-2xl mx-auto space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {t.homeP3CapabilitiesTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  {t.homeP3CapabilitiesSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-teal-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-red-50 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{t.p3Cap1Title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.p3Cap1Desc}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-teal-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <History className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{t.p3Cap2Title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.p3Cap2Desc}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-teal-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <Scale className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{t.p3Cap3Title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.p3Cap3Desc}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-teal-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                      <FileCheck2 className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{t.p3Cap4Title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.p3Cap4Desc}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-teal-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{t.p3Cap5Title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.p3Cap5Desc}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {lang === "bn" ? "১০০% যাচাইযোগ্য টেস্ট ডেটাসেট" : "100% Verifiable Test Suite"}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {lang === "bn"
                        ? "ল্যান্ডটেক ২০২৬ কারিগরি মূল্যায়নের জন্য প্রতিটি নিয়মের জন্য পজিটিভ, নেগেটিভ ও এজ-কেস টেস্ট সমৃদ্ধ।"
                        : "Includes automated unit tests for positive, negative, boundary, and edge cases for all 5 rules."}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-teal-800">
                    {lang === "bn" ? "২৪টি টেস্ট উত্তীর্ণ (100% Pass)" : "24 Tests Passing (100%)"}
                  </span>
                </div>
              </div>
            </section>

            {/* 6. ROLE PORTALS / LOGIN ENTRY POINTS */}
            <section id="portals-section" className="space-y-5">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {t.homePortalsTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  {t.homePortalsSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Citizen Portal */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-300 transition-all">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{t.citizenPortalTitle}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{t.citizenPortalDesc}</p>
                  </div>
                  <button
                    onClick={() => {
                      fillDemoCredentials("CITIZEN");
                      setActiveTab("LOGIN_CITIZEN");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>{t.citizenPortalBtn}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Officer Portal */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-300 transition-all">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{t.officerPortalTitle}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{t.officerPortalDesc}</p>
                  </div>
                  <button
                    onClick={() => {
                      fillDemoCredentials("OFFICIAL");
                      setActiveTab("LOGIN_OFFICIAL");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>{t.officerPortalBtn}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Admin Portal */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-300 transition-all">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{t.adminPortalTitle}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{t.adminPortalDesc}</p>
                  </div>
                  <button
                    onClick={() => {
                      fillDemoCredentials("ADMIN");
                      setActiveTab("LOGIN_ADMIN");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>{t.adminPortalBtn}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* 7. ABOUT PROJECT SECTION */}
            <section id="about-section" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{t.aboutTitle}</h2>
                  <p className="text-xs text-slate-500">{t.aboutSubtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed pt-2">
                <p>{t.aboutDesc1}</p>
                <p>{t.aboutDesc2}</p>
              </div>
              <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-200/80 text-xs text-teal-900">
                {t.aboutPilotNotice}
              </div>
            </section>

            {/* 8. CONTACT & TECHNICAL INFO SECTION */}
            <section id="contact-section" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{t.contactTitle}</h2>
                  <p className="text-xs text-slate-500">{t.contactSubtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">{t.contactDevLabel}</span>
                  <span className="font-bold text-slate-800 text-sm">{t.contactDevValue}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">{t.contactGitLabel}</span>
                  <a
                    href="https://github.com/RafiulKabir0/landtrace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-teal-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>github.com/RafiulKabir0/landtrace</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">{t.contactEventLabel}</span>
                  <span className="font-bold text-slate-800">{t.contactEventValue}</span>
                </div>
              </div>
            </section>

            {/* 9. SYNTHETIC DEMO NOTICE & LEGAL BUFFER */}
            <section className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Info className="h-4 w-4 text-amber-700 flex-shrink-0" />
                <span>{t.homeSyntheticBannerTitle}</span>
              </div>
              <p className="leading-relaxed">
                {t.homeSyntheticBannerDesc}
              </p>
              <p className="text-[11px] text-amber-800 pt-1 border-t border-amber-200/60">
                {t.legalDisclaimer}
              </p>
            </section>
          </div>
        )}

        {/* LAYER 2: THREE DEDICATED ROLE-SPECIFIC LOGIN VIEWS */}
        {(activeTab === "LOGIN_CITIZEN" ||
          activeTab === "LOGIN_OFFICIAL" ||
          activeTab === "LOGIN_ADMIN") && (
          <div className="max-w-md mx-auto py-6 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              {/* Role Switcher Tabs within Login */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    fillDemoCredentials("CITIZEN");
                    setActiveTab("LOGIN_CITIZEN");
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                    activeTab === "LOGIN_CITIZEN"
                      ? "bg-white text-teal-800 shadow-xs border border-slate-200 font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>{lang === "bn" ? "নাগরিক" : "Citizen"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fillDemoCredentials("OFFICIAL");
                    setActiveTab("LOGIN_OFFICIAL");
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                    activeTab === "LOGIN_OFFICIAL"
                      ? "bg-white text-teal-800 shadow-xs border border-slate-200 font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{lang === "bn" ? "কর্মকর্তা" : "Officer"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fillDemoCredentials("ADMIN");
                    setActiveTab("LOGIN_ADMIN");
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                    activeTab === "LOGIN_ADMIN"
                      ? "bg-white text-teal-800 shadow-xs border border-slate-200 font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{lang === "bn" ? "প্রশাসক" : "Admin"}</span>
                </button>
              </div>

              {/* Role Header */}
              <div className="space-y-1.5 text-center">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 mx-auto flex items-center justify-center shadow-xs">
                  {activeTab === "LOGIN_CITIZEN" ? (
                    <UserCheck className="h-6 w-6" />
                  ) : activeTab === "LOGIN_OFFICIAL" ? (
                    <Building2 className="h-6 w-6" />
                  ) : (
                    <ShieldCheck className="h-6 w-6" />
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900 pt-1">
                  {activeTab === "LOGIN_CITIZEN"
                    ? t.loginCitizenTitle
                    : activeTab === "LOGIN_OFFICIAL"
                    ? t.loginOfficialTitle
                    : t.loginAdminTitle}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {activeTab === "LOGIN_CITIZEN"
                    ? t.loginCitizenSub
                    : activeTab === "LOGIN_OFFICIAL"
                    ? t.loginOfficialSub
                    : t.loginAdminSub}
                </p>
              </div>

              {/* Auth Error Banner */}
              {authError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={
                      activeTab === "LOGIN_CITIZEN"
                        ? "citizen@demo.landtrace.gov.bd"
                        : activeTab === "LOGIN_OFFICIAL"
                        ? "officer@demo.landtrace.gov.bd"
                        : "admin@demo.landtrace.gov.bd"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      {t.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const targetRole =
                          activeTab === "LOGIN_CITIZEN"
                            ? "CITIZEN"
                            : activeTab === "LOGIN_OFFICIAL"
                            ? "OFFICIAL"
                            : "ADMIN";
                        fillDemoCredentials(targetRole);
                      }}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-medium hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{t.fillDemoCredentialsBtn}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label={showPassword ? t.hidePasswordLabel : t.showPasswordLabel}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t.submitLogin}</span>
                </button>

                {/* Security & Server Role Guarantee Notice */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                  <Lock className="h-3.5 w-3.5 text-teal-700 mt-0.5 flex-shrink-0" />
                  <span>
                    {lang === "bn"
                      ? "সার্ভার নিরাপত্তা নিশ্চয়তা: নির্বাচিত লগইন পৃষ্ঠা ব্যবহারকারীর ভূমিকা নির্ধারণ করে না। ডেটাবেজ ও সেশন টোকেনের মাধ্যমেই প্রবেশাধিকার ও পদমর্যাদা নিশ্চিত করা হয়।"
                      : "Server Security Policy: The selected login portal does not confer roles. The user's role is strictly authenticated and validated by the backend server."}
                  </span>
                </div>

                {/* Back to Home Link */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab("HOME")}
                    className="text-xs text-slate-500 hover:text-teal-800 font-semibold inline-flex items-center gap-1 hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{t.backToHomeBtn}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 1: THREE SEPARATE ROLE DASHBOARDS */}
        {activeTab === "DASHBOARD" && (
          <div className="space-y-6">
            {/* A. CITIZEN DASHBOARD (FOR CITIZEN ROLE) */}
            {session?.role === "CITIZEN" ? (
              <div className="space-y-6">
                {/* Welcome & Status Card */}
                <div className="bg-white border border-teal-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold shadow-xs">
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {t.citizenWelcomeTitle}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {session.name} ({session.email}) • {session.designation || (lang === "bn" ? "নাগরিক আবেদনকারী" : "Citizen Applicant")}
                        </p>
                      </div>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 w-fit flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{lang === "bn" ? "১০০% বৈধ ও সক্রিয় স্থিতি" : "Active & Clean Status"}</span>
                    </span>
                  </div>

                  {/* Permitted Parcel Summary Card */}
                  {accessibleParcels[0] && (
                    <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
                            {t.citizenMyPlot}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 font-mono mt-0.5">
                            {accessibleParcels[0].parcelNumber}
                            <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-slate-200 rounded text-slate-700 font-sans">
                              {t.dagNumber}: {formatNumber(accessibleParcels[0].dagNumber || "402", lang)}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {accessibleParcels[0].mouza}, {accessibleParcels[0].upazila}, {accessibleParcels[0].district}
                          </p>
                        </div>

                        <button
                          onClick={() => openInvestigationView(accessibleParcels[0].id)}
                          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>{t.openDossierBtn}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">{t.khatian}</span>
                          <span className="font-bold text-slate-800 font-mono">{accessibleParcels[0].khatianNumber}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">{t.surveyType}</span>
                          <span className="font-bold text-teal-800">{accessibleParcels[0].surveyType || "RS"}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">{t.totalArea}</span>
                          <span className="font-bold text-slate-800">{formatArea(accessibleParcels[0].totalArea, lang)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">{t.currentOwner}</span>
                          <span className="font-medium text-slate-800 truncate block">{accessibleParcels[0].currentOwner}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/90 text-xs text-emerald-900 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                        <span>
                          {lang === "bn"
                            ? "আপনার প্লটের মালিকানা চেইন সম্পূর্ণ অক্ষুণ্ণ রয়েছে। সাব-রেজিস্ট্রি দলিল ও সহকারী কমিশনার (ভূমি) অফিসের নামজারি রেকর্ডে কোনো ধরনের স্বত্ব বিরতি বা দ্বৈত বিক্রয়ের অসঙ্গতি পাওয়া যায়নি।"
                            : "Your parcel title chain is fully intact. No double selling, ownership chain breaks, or deed-mutation discrepancies exist."}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Citizen Search within Permitted Plot */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5 text-teal-700" />
                      <span>{lang === "bn" ? "অনুমোদিত রেকর্ড অনুসন্ধান" : "Search Permitted Records"}</span>
                    </h4>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder={lang === "bn" ? "দাগ নম্বর (যেমন: দাগ ৪০২) বা খতিয়ান দিয়ে খুঁজুন..." : "Search by Dag 402 or Khatian..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Pre-registration Simulator for Citizen */}
                  <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FileCheck2 className="h-4 w-4 text-teal-700" />
                        <span>{t.simTitle}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{t.simDesc}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">{t.simSellerLabel}</label>
                        <input
                          type="text"
                          placeholder={t.simSellerPlaceholder}
                          value={simSeller}
                          onChange={(e) => setSimSeller(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">{t.simBuyerLabel}</label>
                        <input
                          type="text"
                          placeholder={t.simBuyerPlaceholder}
                          value={simBuyer}
                          onChange={(e) => setSimBuyer(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">{t.simAreaLabel}</label>
                        <input
                          type="number"
                          step="0.1"
                          value={simArea}
                          onChange={(e) => setSimArea(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">{t.simDateLabel}</label>
                        <input
                          type="date"
                          value={simDate}
                          onChange={(e) => setSimDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={runPreRegistrationCheck}
                      className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      {t.simTestBtn}
                    </button>

                    {simResult && simResult.tested && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                          simResult.pass
                            ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                            : "bg-red-50 text-red-900 border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold">
                          {simResult.pass ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-700 flex-shrink-0" />
                          )}
                          <span>{simResult.pass ? t.simPass : t.simFail}</span>
                        </div>
                        {!simResult.pass && (
                          <ul className="list-disc pl-5 space-y-0.5">
                            {simResult.reasons.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Citizen Security Buffer Notice */}
                  <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{t.citizenAuthorizedNotice}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* B. LAND OFFICIAL & ADMIN REVIEW DASHBOARD */
              <div className="space-y-6">
                {/* Official Dashboard Header */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                      {session?.role === "ADMIN" ? (
                        <ShieldCheck className="h-5 w-5" />
                      ) : (
                        <Building2 className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {session?.role === "ADMIN"
                          ? lang === "bn"
                            ? "ভূমি মন্ত্রণালয় আইসিটি সেল — প্রশাসনিক পর্যালোচনা কন্ট্রোল"
                            : "Ministry ICT Cell — Administrative Review Control"
                          : lang === "bn"
                          ? "সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রার পর্যালোচনা ড্যাশবোর্ড"
                          : "AC (Land) & Sub-Registrar Review Dashboard"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {session?.name || "Official Guest"} • {session?.role === "ADMIN" ? t.roleAdmin : t.roleOfficial} • {session?.email || "officer@demo.landtrace.gov.bd"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
                      {lang === "bn" ? "সম্পূর্ণ রেজিস্ট্রি এক্সেস (ALL)" : "Full Registry Access (ALL)"}
                    </span>
                    {session?.role === "ADMIN" && (
                      <button
                        onClick={() => setActiveTab("ADMIN")}
                        className="px-3 py-1 rounded-md bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors"
                      >
                        {t.tabAdmin} →
                      </button>
                    )}
                  </div>
                </div>

                {/* SEARCH AND PRIMARY ACTION BAR */}
                <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleVerifyRecord();
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Primary Action Button: Verify Land Record */}
                    <button
                      onClick={handleVerifyRecord}
                      disabled={isVerifying}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 whitespace-nowrap leading-normal"
                    >
                      {isVerifying ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span>{t.verifyBtn}</span>
                    </button>
                  </div>

                  {/* Status Filters */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span className="font-medium text-slate-600">{t.filterLabel}</span>
                      <button
                        onClick={() => setStatusFilter("ALL")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors leading-normal ${
                          statusFilter === "ALL"
                            ? "bg-slate-200 text-slate-800 font-bold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {t.allFilter}
                      </button>
                      <button
                        onClick={() => setStatusFilter("FLAGGED")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors leading-normal ${
                          statusFilter === "FLAGGED"
                            ? "bg-red-100 text-red-800 font-bold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {t.flaggedFilter}
                      </button>
                      <button
                        onClick={() => setStatusFilter("ACTIVE")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors leading-normal ${
                          statusFilter === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 font-bold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {t.cleanFilter}
                      </button>
                    </div>

                    <span className="text-slate-400 text-[11px]">
                      {t.showingRecords(filteredParcels.length, accessibleParcels.length)}
                    </span>
                  </div>
                </section>

            {/* Notification alert after verification */}
            {verifyNotice && (
              <div
                className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
                  verifyNotice.includes("অসঙ্গতি") ||
                  verifyNotice.includes("Contradictions")
                    ? "bg-red-50 text-red-900 border-red-200"
                    : "bg-emerald-50 text-emerald-900 border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircleIcon
                    isFlagged={
                      verifyNotice.includes("অসঙ্গতি") ||
                      verifyNotice.includes("Contradictions")
                    }
                  />
                  <span className="font-medium">{verifyNotice}</span>
                </div>
                <button
                  onClick={() => setVerifyNotice(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* SUMMARY METRICS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block leading-normal">
                    {t.recordsChecked}
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block font-mono">
                    {formatNumber(summaryMetrics.total, lang)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {t.recordsCheckedSub}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block leading-normal">
                    {t.cleanRecords}
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-700 mt-0.5 block font-mono">
                    {formatNumber(summaryMetrics.clean, lang)}
                  </span>
                  <span className="text-[11px] text-emerald-600">
                    {t.cleanRecordsSub}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-red-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-700 block leading-normal">
                    {t.flaggedRecords}
                  </span>
                  <span className="text-2xl font-extrabold text-red-700 mt-0.5 block font-mono">
                    {formatNumber(summaryMetrics.flagged, lang)}
                  </span>
                  <span className="text-[11px] text-red-600">
                    {t.flaggedRecordsSub}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </section>

            {/* PARCELS CARDS GRID WITH EXPLICIT NEXT STEPS */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-teal-700" />
                  <span>{t.registryListTitle}</span>
                  <span className="text-xs text-slate-500 font-normal">
                    ({formatNumber(filteredParcels.length, lang)})
                  </span>
                </h2>
              </div>

              {filteredParcels.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                  <AlertOctagon className="h-10 w-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">
                    {t.emptySearchTitle}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {t.emptySearchDesc}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("ALL");
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold shadow-xs"
                  >
                    {t.resetSearchBtn}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredParcels.map((parcel) => {
                    const issue = getIssueLabel(parcel);
                    const isSelected = parcel.id === selectedParcel?.id;
                    const isFlagged = parcel.status === "FLAGGED";

                    return (
                      <div
                        key={parcel.id}
                        className={`bg-white rounded-2xl border p-5 space-y-3 transition-all hover:shadow-md flex flex-col justify-between ${
                          isFlagged
                            ? "border-red-200/90 hover:border-red-300"
                            : "border-slate-200/90 hover:border-teal-300"
                        } ${isSelected ? "ring-2 ring-teal-700/20 shadow-sm" : ""}`}
                      >
                        <div className="space-y-2.5">
                          {/* Card Header: Plot & Status */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-sm font-bold text-slate-900">
                                  {parcel.parcelNumber}
                                </span>
                                {parcel.dagNumber && (
                                  <span className="px-1.5 py-0.2 text-[10px] rounded bg-slate-100 text-slate-600 font-mono">
                                    {t.dagNumber}: {formatNumber(parcel.dagNumber, lang)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-400" />
                                {parcel.mouza}, {parcel.upazila}, {parcel.district}
                              </p>
                            </div>

                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border text-center ${issue.color}`}
                            >
                              {issue.label}
                            </span>
                          </div>

                          {/* Parcel Quick Details */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                            <div>
                              <span className="text-[11px] text-slate-400 block">
                                {t.khatian} ({parcel.surveyType || "RS"})
                              </span>
                              <span className="font-mono font-bold text-slate-800">
                                {parcel.khatianNumber}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-400 block">
                                {t.totalArea}
                              </span>
                              <span className="font-bold text-slate-800">
                                {formatArea(parcel.totalArea, lang)}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-400 block">
                              {t.currentOwner}
                            </span>
                            <span className="text-xs font-medium text-slate-800 truncate block">
                              {parcel.currentOwner}
                            </span>
                          </div>
                        </div>

                        {/* Direct Action Link: Open Dedicated Investigation Dossier */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            {t.deedsCount(parcel.deeds.length)}
                          </span>
                          <button
                            onClick={() => openInvestigationView(parcel.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                          >
                            <span>{t.openDossierBtn}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    )}

        {/* TAB 2: DEDICATED FORENSIC INVESTIGATION VIEW */}
        {activeTab === "INVESTIGATION" && selectedParcel && currentAudit && (
          <div className="space-y-6">
            {/* Navigation back and header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("DASHBOARD")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t.backToDashboard}</span>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 font-mono">
                      {selectedParcel.parcelNumber}
                    </h2>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
                        selectedParcel.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {selectedParcel.status === "ACTIVE"
                        ? t.cleanStatus
                        : t.flaggedStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedParcel.mouza}, {selectedParcel.upazila},{" "}
                    {selectedParcel.district}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Parcel selector switcher */}
                <select
                  value={selectedParcel.id}
                  onChange={(e) => setSelectedParcelId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {accessibleParcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.parcelNumber} ({p.mouza})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowPrintModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 shadow-xs"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-600" />
                  <span>{t.printReport}</span>
                </button>
              </div>
            </div>

            {/* FORENSIC CADASATRAL PARTICULARS CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-teal-700" />
                <span>
                  {lang === "bn"
                    ? "ক্যাডার্সট্রাল রেকর্ড বিবরণী ও ঐতিহাসিক স্বত্ব"
                    : "Cadastral Record Particulars & Title Provenance"}
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">{t.dagNumber}</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatNumber(selectedParcel.dagNumber || "101", lang)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">{t.khatian}</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedParcel.khatianNumber}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">{t.surveyType}</span>
                  <span className="font-bold text-teal-800 text-sm">
                    {selectedParcel.surveyType || "RS"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">{t.totalArea}</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatArea(selectedParcel.totalArea, lang)}
                  </span>
                </div>
              </div>

              {/* Owner and Provenance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">{t.currentOwner}</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedParcel.currentOwner}
                  </span>
                  {selectedParcel.ownershipShares && (
                    <div className="mt-1 text-[11px] text-slate-500 font-mono">
                      {t.ownershipShares}: {selectedParcel.ownershipShares}
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">{t.provenance}</span>
                  <span className="font-medium text-slate-700 text-xs">
                    {selectedParcel.provenance ||
                      "Synthetic Cadastral Title Chain / নমুনা রেজিস্ট্রি"}
                  </span>
                </div>
              </div>
            </div>

            {/* TOPOLOGICAL RISK SCORE CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    {t.riskScoreTitle}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-3xl font-extrabold font-mono ${
                        currentAudit.riskLevel === "CRITICAL_RISK"
                          ? "text-red-600"
                          : currentAudit.riskLevel === "HIGH_RISK"
                          ? "text-red-500"
                          : currentAudit.riskLevel === "MEDIUM_RISK"
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {formatScore(currentAudit.riskScore, lang)}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        currentAudit.riskLevel === "CRITICAL_RISK"
                          ? "bg-red-100 text-red-800"
                          : currentAudit.riskLevel === "HIGH_RISK"
                          ? "bg-red-50 text-red-700"
                          : currentAudit.riskLevel === "MEDIUM_RISK"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {currentAudit.riskLevel === "CRITICAL_RISK"
                        ? t.criticalRisk
                        : currentAudit.riskLevel === "HIGH_RISK"
                        ? t.highRisk
                        : currentAudit.riskLevel === "MEDIUM_RISK"
                        ? t.mediumRisk
                        : t.cleanRisk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xl">{t.riskScoreDesc}</p>
                </div>

                <div className="sm:text-right text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block text-sm">
                    {t.contradictionsCount(currentAudit.anomalies.length)}
                  </span>
                  <span>
                    {currentAudit.chainIsValid
                      ? lang === "bn"
                        ? "১০০% বৈধ ধারাবাহিকতা"
                        : "100% Intact Chain"
                      : lang === "bn"
                      ? "মানবসদৃশ পর্যালোচনা আবশ্যক"
                      : "Human review required"}
                  </span>
                </div>
              </div>
            </div>

            {/* DETECTED CONTRADICTIONS & RECOMMENDED ACTIONS */}
            {currentAudit.anomalies.length > 0 && (
              <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    {t.anomaliesDetected} ({formatNumber(currentAudit.anomalies.length, lang)})
                  </span>
                </h3>

                <div className="space-y-3">
                  {currentAudit.anomalies.map((anom, idx) => {
                    const recAction = getRecommendedAction(anom.anomalyType, lang);
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-red-200/80 bg-red-50/40 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">
                              {lang === "bn" ? anom.titleBn : anom.titleEn}
                            </span>
                            <span className="text-xs text-slate-700 mt-1 block">
                              {lang === "bn" ? anom.descriptionBn : anom.descriptionEn}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 flex-shrink-0">
                            {getSeverityLabel(anom.severity, lang)}
                          </span>
                        </div>

                        {/* Recommended Human Review Action */}
                        <div className="p-2.5 rounded-lg bg-white border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-amber-700 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-bold block">
                              {t.recommendedActionTitle}
                            </span>
                            <span>{recAction}</span>
                          </div>
                        </div>

                        {/* Forensic Evidence Dropdown */}
                        <details className="text-xs">
                          <summary className="cursor-pointer text-slate-500 hover:text-slate-800 font-medium">
                            {t.technicalEvidence}
                          </summary>
                          <pre className="mt-2 p-2.5 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                            {JSON.stringify(anom.evidence, null, 2)}
                          </pre>
                        </details>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AREA COMPARISON (KHATIAN VS DEED) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-teal-700" />
                <span>{t.areaComparisonTitle}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">
                    {t.khatianSurveyArea}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatArea(selectedParcel.totalArea, lang)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">
                    {t.deedTransferredArea}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedParcel.deeds[selectedParcel.deeds.length - 1]
                      ? formatArea(
                          selectedParcel.deeds[selectedParcel.deeds.length - 1]
                            .transferredArea,
                          lang
                        )
                      : formatArea(0, lang)}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    (selectedParcel.deeds[selectedParcel.deeds.length - 1]
                      ?.transferredArea || 0) > selectedParcel.totalArea
                      ? "bg-red-50 text-red-900 border-red-200"
                      : "bg-emerald-50 text-emerald-900 border-emerald-200"
                  }`}
                >
                  <div>
                    <span className="text-[11px] opacity-75 block">
                      {t.areaMatchStatus}
                    </span>
                    <span className="font-bold text-xs">
                      {(selectedParcel.deeds[selectedParcel.deeds.length - 1]
                        ?.transferredArea || 0) > selectedParcel.totalArea
                        ? t.areaExceeded
                        : t.areaConsistent}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. DEDICATED SURVEY RECORD HISTORY (CS, SA, RS, BS/BRS) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-teal-700" />
                    <span>{t.surveyHistoryTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "bn"
                      ? "ঐতিহাসিক সিএস, এসএ, আরএস ও সিটি/বিএস জরিপ রেকর্ড এবং খতিয়ান ভিত্তি"
                      : "Historical CS, SA, RS, and City/BS Cadastral Survey Records & Khatian Provenance"}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 w-fit">
                  {lang === "bn" ? `বর্তমান জরিপ: ${selectedParcel.surveyType || "RS"}` : `Active Survey: ${selectedParcel.surveyType || "RS"}`}
                </span>
              </div>

              {/* Policy Notice Box: Surveys alone do not equal continuous title transfer */}
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  {t.surveyHistoryNotice}
                </span>
              </div>

              {/* 4 Cadastral Surveys Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* CS Survey Card */}
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                  selectedParcel.surveyType === "CS" ? "bg-teal-50/50 border-teal-300 ring-1 ring-teal-600/20" : "bg-slate-50 border-slate-200"
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.surveyCSLabel}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">~1940</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {lang === "bn" ? "ভারত শাসন আমলের মূল ক্যাডাস্ট্রাল ভিত্তি" : "Root Cadastral Baseline Survey"}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-0.5">
                    <span className="text-slate-400 block">{t.khatian}: CS-{formatNumber(selectedParcel.dagNumber || "101", lang)}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {t.surveyStatusRecorded}
                    </span>
                  </div>
                </div>

                {/* SA Survey Card */}
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                  selectedParcel.surveyType === "SA" ? "bg-teal-50/50 border-teal-300 ring-1 ring-teal-600/20" : "bg-slate-50 border-slate-200"
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.surveySALabel}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">~1956</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {lang === "bn" ? "জমিদারি উচ্ছেদ ও রাষ্ট্রীয় অধিগ্রহণ খতিয়ান" : "Zamindari Abolition State Acquisition"}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-0.5">
                    <span className="text-slate-400 block">{t.khatian}: SA-{selectedParcel.khatianNumber.slice(0, 7)}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {t.surveyStatusPredecessor}
                    </span>
                  </div>
                </div>

                {/* RS Survey Card */}
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                  selectedParcel.surveyType === "RS" ? "bg-teal-50/50 border-teal-300 ring-1 ring-teal-600/20" : "bg-slate-50 border-slate-200"
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.surveyRSLabel}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">~1972</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {lang === "bn" ? "সংশোধিত জরিপ ও সরেজমিন সীমানা পুনর্নির্ধারণ" : "Revisional Cadastral Resurvey"}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-0.5">
                    <span className="text-slate-400 block">{t.khatian}: {selectedParcel.khatianNumber}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {t.surveyStatusRevised}
                    </span>
                  </div>
                </div>

                {/* BS Survey Card */}
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                  selectedParcel.surveyType === "BS" || selectedParcel.surveyType === "CITY_SURVEY" ? "bg-teal-50/50 border-teal-300 ring-1 ring-teal-600/20" : "bg-slate-50 border-slate-200"
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.surveyBSLabel}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">~1998+</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {lang === "bn" ? "আধুনিক বাংলাদেশ / সিটি জরিপ ও চূড়ান্ত রেকর্ড" : "Modern BS / City Cadastral Survey"}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-0.5">
                    <span className="text-slate-400 block">{t.dagNumber}: {formatNumber(selectedParcel.dagNumber || "101", lang)}</span>
                    <span className="text-teal-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {t.surveyStatusFinal}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. INTERACTIVE OWNERSHIP CHAIN TIMELINE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <History className="h-4 w-4 text-teal-700" />
                    <span>{t.ownershipChainHeader}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.ownershipChainSub}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {t.deedsCount(selectedParcel.deeds.length)}
                </span>
              </div>

              <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
                {selectedParcel.deeds.map((deed) => (
                  <div key={deed.id} className="relative">

                    <span
                      className={`absolute -left-8 top-1.5 h-4 w-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        deed.isVerified
                          ? "border-emerald-600"
                          : "border-red-600 bg-red-50"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          deed.isVerified ? "bg-emerald-600" : "bg-red-600"
                        }`}
                      />
                    </span>

                    <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">
                            {deed.deedNumber}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            {deed.deedType}
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {formatDate(deed.deedDate, lang, "full")}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-[11px] text-slate-400 block">
                            {t.seller}
                          </span>
                          <span className="font-medium text-slate-800">
                            {deed.sellerName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">
                            {t.buyer}
                          </span>
                          <span className="font-medium text-slate-800">
                            {deed.buyerName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>{deed.registrationOffice}</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {formatArea(deed.transferredArea, lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* APPROVED MUTATION RECORDS */}
            {selectedParcel.mutations.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileCheck2 className="h-4 w-4 text-teal-700" />
                  <span>{t.mutationRecords}</span>
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {selectedParcel.mutations.map((mut) => (
                    <div
                      key={mut.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">
                            {mut.caseNumber}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                            {mut.status}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">
                          {t.applicant}:{" "}
                          <span className="font-medium text-slate-800">
                            {mut.applicantName}
                          </span>{" "}
                          • {t.officer}: {mut.officerName}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="font-bold text-slate-900 font-mono block">
                          {formatArea(mut.mutatedArea, lang)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(mut.approvalDate, lang, "short")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AUTHORIZED OFFICER ACTIONS PANEL */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-teal-700" />
                  <span>{t.officerActionsTitle}</span>
                </h3>
                <span className="text-[11px] text-slate-400 italic">
                  {lang === "bn"
                    ? "সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রার সিদ্ধান্ত বাফার"
                    : "AC Land & Sub-Registrar Decision Buffer"}
                </span>
              </div>

              {session?.role === "CITIZEN" ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <p>{t.citizenRestrictedMsg}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      onClick={() => handleOfficerAction(t.actionMarkReview)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
                    >
                      {t.actionMarkReview}
                    </button>
                    <button
                      onClick={() => handleOfficerAction(t.actionFieldInquiry)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
                    >
                      {t.actionFieldInquiry}
                    </button>
                    <button
                      onClick={() => setShowNoteModal(true)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
                    >
                      {t.actionAddNote}
                    </button>
                    <button
                      onClick={() => handleOfficerAction(t.actionForward)}
                      className="px-3 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      {t.actionForward}
                    </button>
                  </div>

                  {/* Audit Trail */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      {t.recentActions}
                    </span>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {auditNotes.map((note, idx) => (
                        <p
                          key={idx}
                          className="text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200"
                        >
                          {note}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRE-REGISTRATION TRANSFER RISK CHECK SIMULATOR */}
        {activeTab === "TRANSFER_CHECK" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-teal-700" />
                <span>{t.simTitle}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">{t.simDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  {t.simSelectPlot}
                </label>
                <select
                  value={simPlotId}
                  onChange={(e) => setSimPlotId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {accessibleParcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.parcelNumber} — {p.mouza} ({p.currentOwner})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  {t.simSellerLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.simSellerPlaceholder}
                  value={simSeller}
                  onChange={(e) => setSimSeller(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  {t.simBuyerLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.simBuyerPlaceholder}
                  value={simBuyer}
                  onChange={(e) => setSimBuyer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  {t.simAreaLabel}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={simArea}
                  onChange={(e) => setSimArea(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  {t.simDateLabel}
                </label>
                <input
                  type="date"
                  value={simDate}
                  onChange={(e) => setSimDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <button
              onClick={runPreRegistrationCheck}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              {t.simTestBtn}
            </button>

            {simResult && simResult.tested && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  simResult.pass
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                    : "bg-red-50 text-red-900 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {simResult.pass ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-700 flex-shrink-0" />
                  )}
                  <span className="font-bold text-sm">
                    {simResult.pass ? t.simPass : t.simFail}
                  </span>
                </div>

                {!simResult.pass && (
                  <ul className="list-disc pl-5 space-y-1">
                    {simResult.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ALL DETECTED CONTRADICTIONS */}
        {activeTab === "ALERTS" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                <span>{t.tabAlertsTitle}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">{t.tabAlertsSubtitle}</p>
            </div>

            <div className="space-y-3">
              {accessibleParcels
                .filter((p) => p.status === "FLAGGED")
                .map((parcel) => (
                  <div
                    key={parcel.id}
                    className="p-4 rounded-xl border border-red-200 bg-red-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {parcel.parcelNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          {getAnomalyTypeLabel(
                            parcel.anomalies?.[0]?.anomalyType || "DOUBLE_SELLING",
                            lang
                          )}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        {parcel.anomalies?.[0]?.description ||
                          "Fraud contradiction detected in title chain."}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {parcel.mouza}, {parcel.district} • {parcel.currentOwner}
                      </p>
                    </div>

                    <button
                      onClick={() => openInvestigationView(parcel.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-teal-700 hover:text-teal-900 hover:bg-slate-50 font-semibold text-xs whitespace-nowrap shadow-xs"
                    >
                      {t.viewDossierLink} →
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN USER MANAGEMENT (ADMIN ONLY) */}
        {activeTab === "ADMIN" && session?.role === "ADMIN" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-700" />
                <span>{t.adminTitle}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">{t.adminSubtitle}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">{t.userColName}</th>
                    <th className="py-2.5 px-3">{t.userColEmail}</th>
                    <th className="py-2.5 px-3">{t.userColRole}</th>
                    <th className="py-2.5 px-3">{t.userColStatus}</th>
                    <th className="py-2.5 px-3 text-right">{t.userColActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {u.name}
                        {u.designation && (
                          <span className="block text-[11px] text-slate-400">
                            {u.designation}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{u.email}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "OFFICIAL"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {u.isActive ? t.statusActive : t.statusInactive}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        <button
                          onClick={() =>
                            handleAdminUpdateUser(u.id, {
                              role:
                                u.role === "CITIZEN"
                                  ? "OFFICIAL"
                                  : u.role === "OFFICIAL"
                                  ? "ADMIN"
                                  : "CITIZEN",
                            })
                          }
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                        >
                          {u.role === "CITIZEN"
                            ? t.makeOfficialBtn
                            : u.role === "OFFICIAL"
                            ? t.makeAdminBtn
                            : t.makeCitizenBtn}
                        </button>
                        <button
                          onClick={() =>
                            handleAdminUpdateUser(u.id, { isActive: !u.isActive })
                          }
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                        >
                          {t.toggleStatusBtn}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 5-LAYER FOOTER: GOVERNMENT-SERVICE STYLE ACCESSIBLE FOOTER */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Project Identity & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-teal-700 flex items-center justify-center text-white">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  {t.homeFooterTitle}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.homeFooterDesc}
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-medium text-teal-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LandTech 2026 • Problem P3
                </span>
              </div>
            </div>

            {/* Col 2: Mission & Verification Rules */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t.homeFooterAboutLabel}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.homeFooterAboutText}
              </p>
              <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                  <span>{t.p3Cap1Title}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                  <span>{t.p3Cap2Title}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                  <span>{t.p3Cap3Title}</span>
                </li>
              </ul>
            </div>

            {/* Col 3: Privacy, Data Policy & Safety */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t.homeFooterPrivacyLabel}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.homeFooterPrivacyText}
              </p>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">
                {t.homeFooterLimitsLabel}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.homeFooterLimitsText}
              </p>
            </div>

            {/* Col 4: Verified Developer & Deployment */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t.homeFooterTeamLabel}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.homeFooterTeamText}
              </p>
              <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">GitHub:</span>
                  <a
                    href="https://github.com/RafiulKabir0/landtrace"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-teal-700 hover:underline"
                  >
                    RafiulKabir0/landtrace
                  </a>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Deployment:</span>
                  <a
                    href="https://landtrace.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-teal-700 hover:underline"
                  >
                    landtrace.vercel.app
                  </a>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Database:</span>
                  <span className="font-mono text-[11px] text-slate-700">
                    Neon PostgreSQL (Active)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              © {new Date().getFullYear()} LandTrace. LandTech 2026 Prototype. Built by{" "}
              <span className="font-semibold text-slate-700">Rafiul Kabir</span>.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => setLang(lang === "bn" ? "en" : "bn")}
                className="hover:text-slate-800 transition-colors"
              >
                {lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
              </button>
              <span>•</span>
              <span className="text-slate-400">
                {t.syntheticNotice}
              </span>
            </div>
          </div>
        </div>
      </footer>
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {t.noteModalTitle}
              </h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              rows={4}
              placeholder={t.notePlaceholder}
              value={customNoteText}
              onChange={(e) => setCustomNoteText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={handleSaveCustomNote}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold"
              >
                {t.saveNoteBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: OFFICIAL DOSSIER PRINT VIEW */}
      {showPrintModal && selectedParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.printModalTitle}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedParcel.parcelNumber} • {new Date().toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border">
              <div>
                <span className="text-slate-400 block">{t.printHeaderPlot}</span>
                <span className="font-bold font-mono">
                  {selectedParcel.parcelNumber} (দাগ: {selectedParcel.dagNumber || "101"})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{t.printHeaderKhatian}</span>
                <span className="font-bold font-mono">
                  {selectedParcel.khatianNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{t.printHeaderMouza}</span>
                <span className="font-bold">
                  {selectedParcel.mouza}, {selectedParcel.district}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{t.printHeaderArea}</span>
                <span className="font-bold">
                  {formatArea(selectedParcel.totalArea, lang)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                {t.printAnomaliesHeader}
              </span>
              {currentAudit && currentAudit.anomalies.length > 0 ? (
                currentAudit.anomalies.map((a, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-red-200 bg-red-50/50 text-xs text-red-900 space-y-1"
                  >
                    <span className="font-bold block">
                      {lang === "bn" ? a.titleBn : a.titleEn}
                    </span>
                    <span className="block">
                      {lang === "bn" ? a.descriptionBn : a.descriptionEn}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-700">{t.printCleanMessage}</p>
              )}
            </div>

            <div className="space-y-1.5 pt-2 border-t">
              <span className="text-xs font-bold text-slate-700 block">
                {t.printActionTrailHeader}
              </span>
              {auditNotes.map((note, i) => (
                <p
                  key={i}
                  className="text-[11px] font-mono text-slate-600 bg-slate-50 p-1.5 rounded"
                >
                  {note}
                </p>
              ))}
            </div>

            <div className="flex justify-end gap-2 text-xs pt-3 border-t">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                {t.closeBtn}
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-teal-700 text-white font-bold shadow-xs hover:bg-teal-800"
              >
                {t.printBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LOGIN & REGISTRATION */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {showAuthModal === "LOGIN"
                    ? t.loginModalTitle
                    : t.registerModalTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {showAuthModal === "LOGIN"
                    ? t.loginSubtitle
                    : t.registerSubtitle}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAuthModal(null);
                  setAuthError(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
                {authError}
              </div>
            )}

            {showAuthModal === "LOGIN" ? (
              <div className="space-y-4">
                {/* Role Tabs for Evaluation & Direct Login Entry */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("CITIZEN")}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all text-center ${
                      authRoleTab === "CITIZEN"
                        ? "bg-white text-teal-800 shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    👤 {t.authTabCitizen}
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("OFFICIAL")}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all text-center ${
                      authRoleTab === "OFFICIAL"
                        ? "bg-white text-teal-800 shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🏛️ {t.authTabOfficial}
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("ADMIN")}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all text-center ${
                      authRoleTab === "ADMIN"
                        ? "bg-white text-teal-800 shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🛡️ {t.authTabAdmin}
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="officer@demo.landtrace.gov.bd"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-600 block">
                        {t.passwordLabel}
                      </label>
                      <button
                        type="button"
                        onClick={() => fillDemoCredentials(authRoleTab)}
                        className="text-[11px] text-teal-700 hover:text-teal-900 font-medium hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        {t.fillDemoCredentialsBtn}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        aria-label={showPassword ? t.hidePasswordLabel : t.showPasswordLabel}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    {t.submitLogin}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAuthModal("REGISTER");
                        setAuthError(null);
                      }}
                      className="text-xs text-teal-700 hover:underline"
                    >
                      {t.needAccount}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* Citizen Registration Policy Notice */}
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                  <span>{t.citizenRegOnlyNotice}</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="আপনার নাম / Your name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="01700-000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="ন্যূনতম ৮ অক্ষর / Minimum 8 characters"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label={showPassword ? t.hidePasswordLabel : t.showPasswordLabel}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  {t.submitRegister}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAuthModal("LOGIN");
                      setAuthError(null);
                    }}
                    className="text-xs text-teal-700 hover:underline"
                  >
                    {t.alreadyHaveAccount}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AlertCircleIcon({ isFlagged }: { isFlagged: boolean }) {
  if (isFlagged) {
    return <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />;
  }
  return <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />;
}
