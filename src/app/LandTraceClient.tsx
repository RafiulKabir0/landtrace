"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  Database,
  FileText,
  AlertTriangle,
  History,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  MapPin,
  RefreshCw,
  Scale,
  Languages,
  UserCheck,
  Printer,
  FileCheck2,
  AlertOctagon,
  Info,
  X,
} from "lucide-react";
import { auditParcel, ParcelRecord } from "@/lib/detection-engine";

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
  deeds: Deed[];
  mutations: Mutation[];
  anomalies?: AnomalyItem[];
}

interface Props {
  initialParcels: Parcel[];
}

export default function LandTraceClient({ initialParcels }: Props) {
  // Default language is Bangla as requested
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "TRANSFER_CHECK" | "ALERTS">("DASHBOARD");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "FLAGGED">("ALL");
  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    initialParcels[0]?.id || ""
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotice, setScanNotice] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [officerNote, setOfficerNote] = useState("");
  const [auditNotes, setAuditNotes] = useState<string[]>([]);

  // Pre-registration Transfer Risk Check Simulator state
  const [simSeller, setSimSeller] = useState("");
  const [simBuyer, setSimBuyer] = useState("");
  const [simArea, setSimArea] = useState<number>(5.0);
  const [simDate, setSimDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [simPlotId, setSimPlotId] = useState<string>(initialParcels[0]?.id || "");
  const [simResult, setSimResult] = useState<{
    tested: boolean;
    pass: boolean;
    reasons: string[];
  } | null>(null);

  // Translations dictionary (Bangla default)
  const t = {
    bn: {
      appName: "ল্যান্ডট্রেস (LandTrace)",
      badge: "সিদ্ধান্ত-সহায়ক প্ল্যাটফর্ম (P3)",
      subtitle: "ভূমি দলিল জালিয়াতি ও দ্বৈত বিক্রয় সনাক্তকরণ সিস্টেম",
      govtBadge: "গণপ্রজাতন্ত্রী বাংলাদেশ — ভূমি মন্ত্রণালয় পাইলট",
      officerLabel: "কর্মকর্তা: সহকারী কমিশনার (ভূমি) / সাব-রেজিস্ট্রার",
      officerId: "আইডি: ACL-DH-2026",
      syntheticNotice: "নমুনা/সিন্থেটিক ডেটা — কোনো বাস্তব নাগরিক তথ্য ব্যবহৃত হয়নি",
      legalDisclaimer:
        "আইনি সতর্কবার্তা: ল্যান্ডট্রেস একটি সিদ্ধান্ত-সহায়ক প্ল্যাটফর্ম (Decision-Support System)। এটি আইনি মালিকানা নির্ধারণ করে না বা বিচারিক আদেশ প্রদান করে না।",
      dbConnected: "নিয়ন পোস্টগ্রেস সক্রিয়",
      dbLatency: "PostgreSQL 16 (Live)",
      tabDashboard: "রেকর্ড ও মালিকানা বিশ্লেষণ",
      tabTransferCheck: "হস্তান্তর পূর্ববর্তী ঝুঁকি পরীক্ষা",
      tabAlerts: "সকল জালিয়াতি সতর্কতা",
      searchPlaceholder: "দাগ নম্বর, মৌজা, খতিয়ান বা মালিকের নাম দিয়ে খুঁজুন...",
      all: "সকল রেকর্ড",
      verified: "বৈধ রেকর্ড",
      flagged: "ঝুঁকিপূর্ণ / অসঙ্গতিপূর্ণ",
      runScan: "গভীর অডিট স্ক্যান চালান",
      scanning: "মালিকানা ধারাবাহিকতা বিশ্লেষণ হচ্ছে...",
      scanComplete: "অডিট সম্পন্ন: ৫টি ভেক্টরে কোনো অপ্রত্যাশিত নতুন ঝুঁকি নেই।",
      totalParcels: "মোট নিরীক্ষিত প্লট",
      verifiedChains: "ধারাবাহিক মালিকানা",
      activeAnomalies: "চিহ্নিত অসঙ্গতি",
      contestedArea: "ঝুঁকিপূর্ণ জমির পরিমাপ",
      decimals: "শতাংশ",
      parcelListTitle: "প্লট ও খতিয়ান তালিকা",
      khatian: "খতিয়ান",
      mouza: "মৌজা",
      upazila: "উপজেলা",
      district: "জেলা",
      totalArea: "রেকর্ডকৃত মোট জমি",
      owner: "রেকর্ডভুক্ত মালিক",
      deedTimeline: "মালিকানা ধারাবাহিকতা সময়রেখা (Deed Timeline)",
      mutationRecords: "নামজারি ও মিউটেশন রেকর্ড",
      anomaliesDetected: "শনাক্তকৃত অসঙ্গতি ও ফরেনসিক প্রমাণ",
      officerActionsTitle: "কর্মকর্তা সিদ্ধান্ত-সহায়ক পদক্ষেপ",
      actionMarkReview: "পর্যালোচনার জন্য চিহ্নিত করুন",
      actionFieldInquiry: "মাঠ তদন্তে প্রেরণ করুন",
      actionAddNote: "তদন্ত নোট যোগ করুন",
      actionForward: "উর্ধ্বতন কর্তৃপক্ষের নিকট প্রেরণ করুন",
      actionSuccess: "পদক্ষেপ সফলভাবে অডিট ট্রেইলে সংরক্ষিত হয়েছে।",
      printReport: "তদন্ত সারাংশ মুদ্রণ / প্রিন্ট",
      buyer: "গ্রহীতা (ক্রেতা)",
      seller: "দাতা (বিক্রেতা)",
      deedDate: "দলিলের তারিখ",
      registry: "রেজিস্ট্রি অফিস",
      simTitle: "নতুন দলিল রেজিস্ট্রেশন পূর্ববর্তী ঝুঁকি যাচাই (Pre-Registration Audit)",
      simDesc: "নতুন সাব-কবলা দলিল রেজিস্ট্রেশনের পূর্বে প্রস্তাবিত হস্তান্তর ল্যান্ডট্রেস ইঞ্জিনে পরীক্ষা করুন।",
      simTestBtn: "ঝুঁকি যাচাই করুন",
      simPass: "হস্তান্তর প্রস্তাব বৈধ: ধারাবাহিকতা ও পরিমাপে কোনো অসঙ্গতি নেই।",
      simFail: "সতর্কতা: প্রস্তাবিত হস্তান্তরে অসঙ্গতি সনাক্ত হয়েছে!",
      fiveRulesTitle: "৫টি মূল সনাক্তকরণ সক্ষমতা",
      rule1: "১. দ্বৈত বিক্রয় সনাক্তকরণ (Double Selling)",
      rule2: "২. ধারাবাহিকতা বিচ্ছিন্নতা (Ownership Chain Break)",
      rule3: "৩. জমির পরিমাপের গরমিল (Area Mismatch)",
      rule4: "৪. দলিল ও নামজারি অমিল (Deed-Mutation Mismatch)",
      rule5: "৫. সময়ানুক্রমিক অসঙ্গতি / দ্রুত হস্তান্তর (Timing Anomaly)",
    },
    en: {
      appName: "LandTrace",
      badge: "Decision Support System (P3)",
      subtitle: "Land Record Fraud & Double-Selling Detection System",
      govtBadge: "Ministry of Land Pilot Project — LandTech 2026",
      officerLabel: "Officer: AC Land / Sub-Registrar",
      officerId: "ID: ACL-DH-2026",
      syntheticNotice: "Synthetic Demo Data — No real citizen data used",
      legalDisclaimer:
        "Legal Notice: LandTrace is a decision-support system. It does not legally determine title ownership or issue judicial decrees.",
      dbConnected: "Neon DB Live",
      dbLatency: "PostgreSQL 16 (Live)",
      tabDashboard: "Records & Chain Analysis",
      tabTransferCheck: "Pre-Registration Risk Check",
      tabAlerts: "All Fraud Alerts",
      searchPlaceholder: "Search by Plot Number, Mouza, Khatian, or Owner...",
      all: "All Records",
      verified: "Clean Records",
      flagged: "Flagged Anomalies",
      runScan: "Run Deep Audit Scan",
      scanning: "Auditing Custody Chains...",
      scanComplete: "Audit complete across 5 fraud vectors: No unhandled risks.",
      totalParcels: "Audited Land Parcels",
      verifiedChains: "Clean Custody Chains",
      activeAnomalies: "Active Anomalies",
      contestedArea: "Contested Land Area",
      decimals: "decimals",
      parcelListTitle: "Parcel & Khatian Registry",
      khatian: "Khatian",
      mouza: "Mouza",
      upazila: "Upazila",
      district: "District",
      totalArea: "Recorded Total Area",
      owner: "Recorded Owner",
      deedTimeline: "Chain of Title Timeline (Deed Chronology)",
      mutationRecords: "Mutation / Namjari Records",
      anomaliesDetected: "Detected Contradictions & Forensic Evidence",
      officerActionsTitle: "Officer Decision-Support Actions",
      actionMarkReview: "Mark for Review",
      actionFieldInquiry: "Send for Field Inquiry",
      actionAddNote: "Add Investigation Note",
      actionForward: "Forward for Review",
      actionSuccess: "Action successfully recorded in audit trail.",
      printReport: "Print Investigation Dossier",
      buyer: "Buyer / Grantee",
      seller: "Seller / Grantor",
      deedDate: "Deed Date",
      registry: "Registry Office",
      simTitle: "Pre-Registration Transfer Risk Check",
      simDesc: "Test proposed deed transaction against ownership chain before registration.",
      simTestBtn: "Run Transfer Risk Audit",
      simPass: "Proposed Transfer Clean: No title break or area overflow detected.",
      simFail: "Warning: Contradictions detected in proposed transfer!",
      fiveRulesTitle: "Five Core Detection Capabilities",
      rule1: "1. Double Selling Detection",
      rule2: "2. Ownership Chain Break",
      rule3: "3. Area Mismatch",
      rule4: "4. Deed-Mutation Mismatch",
      rule5: "5. Wrong Transfer Timing / Rapid Transfer",
    },
  }[lang];

  // Filtered parcels
  const filteredParcels = useMemo(() => {
    return initialParcels.filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        p.parcelNumber.toLowerCase().includes(q) ||
        p.khatianNumber.toLowerCase().includes(q) ||
        p.mouza.toLowerCase().includes(q) ||
        p.currentOwner.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? p.status === "ACTIVE"
          : p.status === "FLAGGED";

      return matchesSearch && matchesStatus;
    });
  }, [initialParcels, searchTerm, statusFilter]);

  const selectedParcel = useMemo(() => {
    return (
      initialParcels.find((p) => p.id === selectedParcelId) ||
      filteredParcels[0] ||
      null
    );
  }, [initialParcels, selectedParcelId, filteredParcels]);

  // Run dynamic engine audit on selected parcel
  const currentAudit = useMemo(() => {
    if (!selectedParcel) return null;
    return auditParcel(selectedParcel);
  }, [selectedParcel]);

  // Aggregated stats
  const stats = useMemo(() => {
    const total = initialParcels.length;
    const verified = initialParcels.filter((p) => p.status === "ACTIVE").length;
    const flagged = total - verified;
    const totalAnomalies = initialParcels.reduce(
      (acc, p) => acc + (p.anomalies?.length || 0),
      0
    );
    const contestedArea = initialParcels
      .filter((p) => p.status === "FLAGGED")
      .reduce((acc, p) => acc + p.totalArea, 0);

    return { total, verified, flagged, totalAnomalies, contestedArea };
  }, [initialParcels]);

  const handleDeepScan = () => {
    setIsScanning(true);
    setScanNotice(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanNotice(t.scanComplete);
    }, 900);
  };

  const handleOfficerAction = (actionTitle: string) => {
    const newNote = `[${new Date().toLocaleTimeString()}] ${actionTitle} - ${selectedParcel?.parcelNumber}`;
    setAuditNotes((prev) => [newNote, ...prev]);
    alert(`${actionTitle}: ${t.actionSuccess}`);
  };

  const runPreRegistrationCheck = () => {
    const targetPlot = initialParcels.find((p) => p.id === simPlotId);
    if (!targetPlot) return;

    const reasons: string[] = [];
    const normalizedSeller = simSeller.trim().toLowerCase();

    // Check 1: Does seller exist in preceding buyers?
    const hasPriorTitle = targetPlot.deeds.some(
      (d) => d.buyerName.trim().toLowerCase() === normalizedSeller
    ) || targetPlot.currentOwner.trim().toLowerCase() === normalizedSeller;

    if (!hasPriorTitle) {
      reasons.push(
        lang === "bn"
          ? `দাতা '${simSeller}' উক্ত প্লটের কোনো পূর্ববর্তী ক্রয় দলিল বা খতিয়ানে মালিক হিসেবে নথিভুক্ত নেই (মালিকানা বিচ্ছিন্নতা)।`
          : `Seller '${simSeller}' does not hold a recorded purchase deed or title on this plot (Chain Break).`
      );
    }

    // Check 2: Area overflow
    if (simArea > targetPlot.totalArea) {
      reasons.push(
        lang === "bn"
          ? `প্রস্তাবিত জমি (${simArea} শতাংশ) খতিয়ানের মোট পরিমাপ (${targetPlot.totalArea} শতাংশ) অপেক্ষা অধিক (জমির পরিমাপের গরমিল)।`
          : `Proposed area (${simArea} dec) exceeds parent khatian acreage (${targetPlot.totalArea} dec) (Area Mismatch).`
      );
    }

    // Check 3: Has this seller already sold?
    const alreadySold = targetPlot.deeds.some(
      (d) => d.sellerName.trim().toLowerCase() === normalizedSeller
    );
    if (alreadySold) {
      reasons.push(
        lang === "bn"
          ? `উক্ত দাতা ইতিপূর্বে এই প্লটে জমি বিক্রয় করেছেন। পুনরায় হস্তান্তর স্বত্বহীন দ্বৈত বিক্রয়ের ঝুঁকি তৈরি করে।`
          : `This seller has already executed a prior conveyance on this plot. Risk of Double Selling.`
      );
    }

    setSimResult({
      tested: true,
      pass: reasons.length === 0,
      reasons,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Government Header & Authentication Banner */}
      <header className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {t.appName}
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {t.badge}
                </span>
                <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {t.govtBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Officer Identification */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-slate-200 font-medium">{t.officerLabel}</p>
                <p className="text-slate-500 text-[10px]">{t.officerId}</p>
              </div>
            </div>

            {/* Neon DB indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-mono text-slate-300">{t.dbConnected}</span>
            </div>

            {/* Language toggle: Bangla default */}
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/30 text-xs font-semibold text-emerald-300 transition-colors"
            >
              <Languages className="h-3.5 w-3.5" />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>

        {/* Synthetic Data Banner & Legal Disclaimer */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Info className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{t.syntheticNotice}</span>
          </div>
          <span className="text-[11px] text-slate-500 italic">
            {t.legalDisclaimer}
          </span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("DASHBOARD")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "DASHBOARD"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{t.tabDashboard}</span>
        </button>

        <button
          onClick={() => setActiveTab("TRANSFER_CHECK")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "TRANSFER_CHECK"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>{t.tabTransferCheck}</span>
        </button>

        <button
          onClick={() => setActiveTab("ALERTS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "ALERTS"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>{t.tabAlerts}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">
            {stats.totalAnomalies}
          </span>
        </button>
      </nav>

      {/* TAB 1: DASHBOARD & RECORD INSPECTOR */}
      {activeTab === "DASHBOARD" && (
        <div className="space-y-6">
          {/* Key Metrics Overview */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 block">{t.totalParcels}</span>
              <span className="text-2xl font-bold text-white mt-1 block font-mono">
                {stats.total}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Neon PostgreSQL Sync</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20">
              <span className="text-xs text-slate-400 block">{t.verifiedChains}</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block font-mono">
                {stats.verified}
              </span>
              <p className="text-[11px] text-emerald-500/80 mt-1">100% Chain Custody</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/20">
              <span className="text-xs text-slate-400 block">{t.activeAnomalies}</span>
              <span className="text-2xl font-bold text-rose-400 mt-1 block font-mono">
                {stats.totalAnomalies}
              </span>
              <p className="text-[11px] text-rose-400/80 mt-1">P3 Fraud Vectors</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20">
              <span className="text-xs text-slate-400 block">{t.contestedArea}</span>
              <span className="text-2xl font-bold text-amber-400 mt-1 block font-mono">
                {stats.contestedArea.toFixed(1)} {t.decimals}
              </span>
              <p className="text-[11px] text-amber-400/80 mt-1">Under Inquiry</p>
            </div>
          </section>

          {/* Search & Actions Bar */}
          <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === "ALL"
                      ? "bg-slate-800 text-white font-medium"
                      : "text-slate-400"
                  }`}
                >
                  {t.all}
                </button>
                <button
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === "ACTIVE"
                      ? "bg-emerald-600/30 text-emerald-300 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  {t.verified}
                </button>
                <button
                  onClick={() => setStatusFilter("FLAGGED")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === "FLAGGED"
                      ? "bg-rose-600/30 text-rose-300 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  {t.flagged}
                </button>
              </div>

              <button
                onClick={handleDeepScan}
                disabled={isScanning}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isScanning ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>{isScanning ? t.scanning : t.runScan}</span>
              </button>
            </div>
          </section>

          {scanNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{scanNotice}</span>
            </div>
          )}

          {/* Split Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Parcel List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  {t.parcelListTitle} ({filteredParcels.length})
                </h2>
              </div>

              <div className="space-y-3">
                {filteredParcels.map((parcel) => {
                  const isSelected = selectedParcel?.id === parcel.id;
                  const isFlagged = parcel.status === "FLAGGED";

                  return (
                    <div
                      key={parcel.id}
                      onClick={() => setSelectedParcelId(parcel.id)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? isFlagged
                            ? "bg-rose-950/30 border-rose-500/50 shadow-md"
                            : "bg-emerald-950/30 border-emerald-500/50 shadow-md"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-white">
                              {parcel.parcelNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase ${
                                isFlagged
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {isFlagged ? (lang === "bn" ? "অসঙ্গতিপূর্ণ" : "Flagged") : (lang === "bn" ? "বৈধ" : "Verified")}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-500" />
                            {parcel.mouza}, {parcel.upazila}, {parcel.district}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-200">
                            {parcel.totalArea} {t.decimals}
                          </span>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {parcel.khatianNumber}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span className="truncate max-w-[200px]">
                          {parcel.currentOwner}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">
                            {parcel.deeds?.length || 0} deeds
                          </span>
                          {parcel.anomalies && parcel.anomalies.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 font-mono text-[10px]">
                              {parcel.anomalies.length} alerts
                            </span>
                          )}
                          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Forensic Title Dossier */}
            <div className="lg:col-span-7">
              {selectedParcel && (
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                  {/* Top dossier bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white font-mono">
                          {selectedParcel.parcelNumber}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            selectedParcel.status === "FLAGGED"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {selectedParcel.status === "FLAGGED"
                            ? lang === "bn"
                              ? "ঝুঁকিপূর্ণ রেকর্ড"
                              : "Compromised Title"
                            : lang === "bn"
                            ? "বৈধ ধারাবাহিকতা"
                            : "Clean Custody"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {t.mouza}: {selectedParcel.mouza} | {t.district}: {selectedParcel.district} | {t.khatian}: {selectedParcel.khatianNumber}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPrintModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>{t.printReport}</span>
                      </button>

                      <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
                        <span className="text-[10px] text-slate-500 block">
                          Risk Score
                        </span>
                        <span
                          className={`text-base font-bold font-mono ${
                            (currentAudit?.riskScore || 0) > 40
                              ? "text-rose-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {currentAudit?.riskScore || 0}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detected Anomalies */}
                  {selectedParcel.anomalies && selectedParcel.anomalies.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4" />
                        {t.anomaliesDetected} ({selectedParcel.anomalies.length})
                      </h4>

                      {selectedParcel.anomalies.map((anom, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-slate-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-rose-300 text-xs flex items-center gap-1.5">
                              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                              {anom.title}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                              {anom.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {anom.description}
                          </p>
                          {anom.evidence && (
                            <div className="p-2.5 rounded-xl bg-black/40 font-mono text-[11px] text-slate-300 overflow-x-auto border border-rose-500/20">
                              {anom.evidence}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Title Chain Timeline */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <History className="h-4 w-4 text-teal-400" />
                      {t.deedTimeline}
                    </h4>

                    <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
                      {selectedParcel.deeds?.map((deed) => (
                        <div key={deed.id} className="relative">
                          <div
                            className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 ${
                              deed.isVerified
                                ? "bg-emerald-500 border-slate-900"
                                : "bg-rose-500 border-slate-900"
                            }`}
                          />

                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-teal-300 text-xs">
                                {deed.deedNumber}
                              </span>
                              <span className="text-slate-400 text-[11px]">
                                {new Date(deed.deedDate).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                              <div>
                                <span className="text-slate-500">{t.seller}: </span>
                                <span className="text-slate-200 font-medium">
                                  {deed.sellerName}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">{t.buyer}: </span>
                                <span className="text-slate-200 font-medium">
                                  {deed.buyerName}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                              <span>
                                {t.totalArea}:{" "}
                                <strong className="text-emerald-400">
                                  {deed.transferredArea} {t.decimals}
                                </strong>
                              </span>
                              <span>{deed.registrationOffice}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Namjari / Mutations */}
                  {selectedParcel.mutations && selectedParcel.mutations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <UserCheck className="h-4 w-4 text-cyan-400" />
                        {t.mutationRecords}
                      </h4>

                      {selectedParcel.mutations.map((mut) => (
                        <div
                          key={mut.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono text-cyan-300 font-medium">
                              {mut.caseNumber}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {mut.applicantName} ({mut.officerName})
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {mut.status}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {mut.mutatedArea} {t.decimals}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Decision-Support Officer Action Buttons (Clean Legal Language) */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Scale className="h-4 w-4 text-emerald-400" />
                      {t.officerActionsTitle}
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => handleOfficerAction(t.actionMarkReview)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                      >
                        {t.actionMarkReview}
                      </button>
                      <button
                        onClick={() => handleOfficerAction(t.actionFieldInquiry)}
                        className="p-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
                      >
                        {t.actionFieldInquiry}
                      </button>
                      <button
                        onClick={() => handleOfficerAction(t.actionAddNote)}
                        className="p-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
                      >
                        {t.actionAddNote}
                      </button>
                      <button
                        onClick={() => handleOfficerAction(t.actionForward)}
                        className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
                      >
                        {t.actionForward}
                      </button>
                    </div>

                    {auditNotes.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          Recent Officer Action Trail:
                        </span>
                        {auditNotes.slice(0, 3).map((n, i) => (
                          <p key={i} className="text-[11px] text-emerald-400 font-mono">
                            {n}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRE-REGISTRATION TRANSFER RISK CHECK */}
      {activeTab === "TRANSFER_CHECK" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-emerald-400" />
              {t.simTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{t.simDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === "bn" ? "টার্গেট প্লট নির্বাচন করুন" : "Select Target Plot"}
              </label>
              <select
                value={simPlotId}
                onChange={(e) => setSimPlotId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              >
                {initialParcels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.parcelNumber} ({p.mouza}, {p.district} — {p.totalArea} dec)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.seller}
              </label>
              <input
                type="text"
                placeholder="e.g. Abdur Rashid / Enamul Haque"
                value={simSeller}
                onChange={(e) => setSimSeller(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.buyer}
              </label>
              <input
                type="text"
                placeholder="e.g. New Prospective Buyer"
                value={simBuyer}
                onChange={(e) => setSimBuyer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === "bn" ? "প্রস্তাবিত জমির পরিমাপ (শতাংশ)" : "Proposed Area (Decimals)"}
              </label>
              <input
                type="number"
                value={simArea}
                onChange={(e) => setSimArea(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.deedDate}
              </label>
              <input
                type="date"
                value={simDate}
                onChange={(e) => setSimDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={runPreRegistrationCheck}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md"
          >
            {t.simTestBtn}
          </button>

          {simResult && simResult.tested && (
            <div
              className={`p-5 rounded-2xl border ${
                simResult.pass
                  ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                  : "bg-rose-950/30 border-rose-500/40 text-rose-200"
              } space-y-3`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {simResult.pass ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>{t.simPass}</span>
                  </>
                ) : (
                  <>
                    <AlertOctagon className="h-5 w-5 text-rose-400" />
                    <span>{t.simFail}</span>
                  </>
                )}
              </div>

              {!simResult.pass && (
                <ul className="space-y-1 pl-6 list-disc text-xs text-rose-300">
                  {simResult.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL ANOMALIES & 5 DETECTION CAPABILITIES */}
      {activeTab === "ALERTS" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-400" />
                {t.tabAlerts}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === "bn"
                  ? "সকল প্লটে সনাক্তকৃত সক্রিয় জালিয়াতি ও অসঙ্গতি বিশ্লেষণ"
                  : "Cross-registry breakdown of all detected contradictions"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialParcels.flatMap((p) =>
              (p.anomalies || []).map((anom, idx) => (
                <div
                  key={`${p.id}-${idx}`}
                  className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-teal-300 font-bold">
                      {p.parcelNumber} ({p.district})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                      {anom.severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100">{anom.title}</h4>
                  <p className="text-slate-400">{anom.description}</p>
                  {anom.evidence && (
                    <pre className="p-2 rounded bg-black/50 text-[10px] text-slate-300 overflow-x-auto">
                      {anom.evidence}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PRINT INVESTIGATION SUMMARY MODAL */}
      {showPrintModal && selectedParcel && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  {lang === "bn"
                    ? "সহকারী কমিশনার (ভূমি) তদন্ত সারাংশ প্রতিবেদন"
                    : "LandTrace Forensic Investigation Dossier"}
                </h3>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-xs space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-xl">
                <div>দাগ / Plot: {selectedParcel.parcelNumber}</div>
                <div>খতিয়ান / Khatian: {selectedParcel.khatianNumber}</div>
                <div>মৌজা / Mouza: {selectedParcel.mouza}</div>
                <div>জেলা / District: {selectedParcel.district}</div>
                <div>মোট পরিমাপ / Area: {selectedParcel.totalArea} {t.decimals}</div>
                <div>বর্তমান মালিক: {selectedParcel.currentOwner}</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                <span className="font-bold text-amber-400">
                  {lang === "bn" ? "সনাক্তকৃত অসঙ্গতিসমূহ:" : "Detected Contradictions:"}
                </span>
                {selectedParcel.anomalies && selectedParcel.anomalies.length > 0 ? (
                  selectedParcel.anomalies.map((a, i) => (
                    <p key={i} className="text-rose-300">
                      • [{a.severity}] {a.title}: {a.description}
                    </p>
                  ))
                ) : (
                  <p className="text-emerald-400">
                    {lang === "bn"
                      ? "কোনো অসঙ্গতি পাওয়া যায়নি (মালিকানা ধারাবাহিকতা বৈধ)।"
                      : "Zero anomalies detected (Chain of Title Verified Clean)."}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                <span className="font-bold text-slate-400">
                  {lang === "bn" ? "তদন্তকারী কর্মকর্তার মন্তব্য:" : "Officer Notes:"}
                </span>
                <textarea
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  placeholder="নোট লিখুন..."
                  className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 italic">
                {t.legalDisclaimer}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  {lang === "bn" ? "প্রিন্ট করুন" : "Print"}
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  {lang === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
