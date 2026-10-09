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
  ChevronDown,
  ArrowRight,
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [customNoteText, setCustomNoteText] = useState("");
  const [auditNotes, setAuditNotes] = useState<string[]>([
    "[10:30 AM] Initial custody chain loaded into decision-support buffer — ACL-DH-2026"
  ]);

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
      tagline: "ভূমি রেকর্ড জালিয়াতি ও দ্বৈত বিক্রয় সনাক্তকরণ সিস্টেম",
      badge: "সিদ্ধান্ত-সহায়ক প্ল্যাটফর্ম (P3)",
      govtBadge: "ভূমি মন্ত্রণালয় পাইলট — ল্যান্ডটেক ২০২৬",
      officerLabel: "কর্মকর্তা: সহকারী কমিশনার (ভূমি) / সাব-রেজিস্ট্রার",
      officerId: "আইডি: ACL-DH-2026",
      syntheticNotice: "নমুনা/সিন্থেটিক ডেটা — কোনো বাস্তব নাগরিক তথ্য ব্যবহৃত হয়নি",
      legalDisclaimer:
        "আইনি সতর্কবার্তা: ল্যান্ডট্রেস একটি বিশ্লেষণমূলক সিদ্ধান্ত-সহায়ক প্ল্যাটফর্ম। এটি আইনি মালিকানা নির্ধারণ করে না বা বিচারিক আদেশ প্রদান করে না।",
      dbConnected: "নিয়ন পোস্টগ্রেস সক্রিয়",
      tabDashboard: "রেকর্ড ও তদন্ত বিশ্লেষণ",
      tabTransferCheck: "রেজিস্ট্রেশন পূর্ববর্তী ঝুঁকি যাচাই",
      tabAlerts: "সকল সনাক্তকৃত অসঙ্গতি",
      searchPlaceholder: "দাগ নম্বর (যেমন: PLOT-DH-2045), খতিয়ান, মৌজা বা দলিল দিয়ে খুঁজুন...",
      verifyBtn: "ভূমি রেকর্ড যাচাই করুন",
      recordsChecked: "নিরীক্ষিত রেকর্ড",
      cleanRecords: "বৈধ রেকর্ড",
      flaggedRecords: "অসঙ্গতিপূর্ণ রেকর্ড",
      allFilter: "সকল রেকর্ড",
      cleanFilter: "বৈধ",
      flaggedFilter: "অসঙ্গতিপূর্ণ",
      registryListTitle: "প্লট ও খতিয়ান তালিকা",
      khatian: "খতিয়ান",
      mouza: "মৌজা",
      upazila: "উপজেলা",
      district: "জেলা",
      totalArea: "রেকর্ডকৃত মোট জমি",
      owner: "রেকর্ডভুক্ত মালিক",
      areaComparisonTitle: "পরিমাপের তুলনা (খতিয়ান বনাম দলিল)",
      khatianSurveyArea: "খতিয়ান সার্ভে পরিমাপ",
      deedTransferredArea: "সর্বশেষ দলিল পরিমাপ",
      areaMatchStatus: "পরিমাপ স্থিতি",
      areaConsistent: "পরিমাপ সঙ্গতিপূর্ণ (খতিয়ান সীমার মধ্যে)",
      areaExceeded: "পরিমাপ অসঙ্গতিপূর্ণ (খতিয়ানের চেয়ে বেশি)",
      deedTimeline: "মালিকানা ধারাবাহিকতা ও দলিলের সময়রেখা",
      mutationRecords: "অনুমোদিত নামজারি ও খারিজ রেকর্ড",
      anomaliesDetected: "শনাক্তকৃত অসঙ্গতিসমূহ",
      technicalEvidence: "প্রযুক্তিগত প্রমাণ ও প্যারামিটার (প্রসারণযোগ্য)",
      riskScoreTitle: "সিদ্ধান্ত-সহায়ক ঝুঁকি স্কোর",
      riskScoreDesc: "৫টি ভেক্টরে ধারাবাহিকতার গাণিতিক অসঙ্গতি বিশ্লেষণ করে নির্ধারিত।",
      officerActionsTitle: "কর্মকর্তার সিদ্ধান্ত-সহায়ক পদক্ষেপ",
      actionMarkReview: "পর্যালোচনার জন্য চিহ্নিত",
      actionFieldInquiry: "মাঠ তদন্তে প্রেরণ",
      actionAddNote: "তদন্ত নোট যোগ করুন",
      actionForward: "উর্ধ্বতন কর্তৃপক্ষের নিকট প্রেরণ",
      printReport: "তদন্ত সারাংশ মুদ্রণ",
      buyer: "গ্রহীতা (ক্রেতা)",
      seller: "দাতা (বিক্রেতা)",
      deedDate: "দলিলের তারিখ",
      registry: "রেজিস্ট্রি অফিস",
      simTitle: "নতুন দলিল রেজিস্ট্রেশন পূর্ববর্তী ঝুঁকি যাচাই (Pre-Registration Audit)",
      simDesc: "সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধনের পূর্বে প্রস্তাবিত হস্তান্তরটি ল্যান্ডট্রেস ইঞ্জিনে পরীক্ষা করুন।",
      simTestBtn: "হস্তান্তর ঝুঁকি নিরীক্ষা করুন",
      simPass: "প্রস্তাবিত হস্তান্তর বৈধ: কোনো স্বত্বহীন হস্তান্তর বা পরিমাপের গরমিল নেই।",
      simFail: "সতর্কতা: প্রস্তাবিত হস্তান্তরে অসঙ্গতি সনাক্ত হয়েছে!",
      saveNoteBtn: "নোট সংরক্ষণ করুন",
      cancelBtn: "বাতিল",
      noteModalTitle: "তদন্তকারী কর্মকর্তার নোট অন্তর্ভুক্তি",
      notePlaceholder: "রেকর্ড বা সরেজমিন তদন্ত সম্পর্কিত মন্তব্য লিখুন...",
      decimals: "শতাংশ",
      cleanStatus: "বৈধ ধারাবাহিকতা",
      flaggedStatus: "ঝুঁকিপূর্ণ / অসঙ্গতিপূর্ণ",
      criticalRisk: "মারাত্মক ঝুঁকি (Critical Risk)",
      highRisk: "উচ্চ ঝুঁকি (High Risk)",
      mediumRisk: "মাঝারি ঝুঁকি (Medium Risk)",
      cleanRisk: "ঝুঁকিমুক্ত (Clean)",
      recentActions: "সাম্প্রতিক কর্মকর্তা পদক্ষেপ ট্রেইল:",
    },
    en: {
      appName: "LandTrace",
      tagline: "Automated Land Record Fraud & Double-Selling Detection System",
      badge: "Decision Support System (P3)",
      govtBadge: "Ministry of Land Pilot Project — LandTech 2026",
      officerLabel: "Officer: AC Land / Sub-Registrar",
      officerId: "ID: ACL-DH-2026",
      syntheticNotice: "Synthetic Demo Data — No real citizen data used",
      legalDisclaimer:
        "Legal Notice: LandTrace is an analytical decision-support system. It does not legally determine title ownership or issue judicial decrees.",
      dbConnected: "Neon PostgreSQL Live",
      tabDashboard: "Records & Investigation",
      tabTransferCheck: "Pre-Registration Risk Check",
      tabAlerts: "All Detected Contradictions",
      searchPlaceholder: "Search by plot number (e.g. PLOT-DH-2045), khatian, mouza, or deed...",
      verifyBtn: "Verify Land Record",
      recordsChecked: "Records Checked",
      cleanRecords: "Clean Records",
      flaggedRecords: "Flagged Records",
      allFilter: "All Records",
      cleanFilter: "Clean",
      flaggedFilter: "Flagged",
      registryListTitle: "Parcel & Khatian Registry",
      khatian: "Khatian",
      mouza: "Mouza",
      upazila: "Upazila",
      district: "District",
      totalArea: "Recorded Total Area",
      owner: "Recorded Owner",
      areaComparisonTitle: "Area Comparison (Khatian vs. Deed)",
      khatianSurveyArea: "Khatian Survey Area",
      deedTransferredArea: "Deed Transferred Area",
      areaMatchStatus: "Area Boundary Status",
      areaConsistent: "Consistent (Within Khatian Boundary)",
      areaExceeded: "Discrepancy (Exceeds Khatian Boundary)",
      deedTimeline: "Chain of Title & Deed Chronology",
      mutationRecords: "Approved Mutation / Namjari Records",
      anomaliesDetected: "Detected Contradictions",
      technicalEvidence: "Technical Evidence & Parameters (Expandable)",
      riskScoreTitle: "Decision-Support Risk Score",
      riskScoreDesc: "Calculated on-demand based on topological contradictions across 5 rules.",
      officerActionsTitle: "Officer Review Actions",
      actionMarkReview: "Mark for Review",
      actionFieldInquiry: "Send for Field Inquiry",
      actionAddNote: "Add Investigation Note",
      actionForward: "Forward for Review",
      printReport: "Print Dossier",
      buyer: "Buyer / Grantee",
      seller: "Seller / Grantor",
      deedDate: "Deed Date",
      registry: "Registry Office",
      simTitle: "Pre-Registration Transfer Risk Check",
      simDesc: "Audit a proposed transfer against the title custody graph prior to deed execution.",
      simTestBtn: "Run Transfer Risk Audit",
      simPass: "Proposed Transfer Clean: No title break or boundary excess detected.",
      simFail: "Warning: Contradictions detected in proposed transfer!",
      saveNoteBtn: "Save Note",
      cancelBtn: "Cancel",
      noteModalTitle: "Add Officer Investigation Note",
      notePlaceholder: "Enter inspection details or field findings...",
      decimals: "decimals",
      cleanStatus: "Clean Custody",
      flaggedStatus: "Flagged Anomaly",
      criticalRisk: "Critical Risk",
      highRisk: "High Risk",
      mediumRisk: "Medium Risk",
      cleanRisk: "Clean",
      recentActions: "Officer Action Trail:",
    },
  }[lang];

  // Filtered parcels based on search and status
  const filteredParcels = useMemo(() => {
    return initialParcels.filter((p) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        p.parcelNumber.toLowerCase().includes(q) ||
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

  // The 3 Core Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = initialParcels.length;
    const clean = initialParcels.filter((p) => p.status === "ACTIVE").length;
    const flagged = total - clean;
    return { total, clean, flagged };
  }, [initialParcels]);

  // Primary action: Verify Land Record
  const handleVerifyRecord = () => {
    setIsVerifying(true);
    setVerifyNotice(null);

    // If search term matches a parcel, select it
    if (searchTerm.trim() !== "") {
      const match = initialParcels.find((p) => {
        const q = searchTerm.toLowerCase().trim();
        return (
          p.parcelNumber.toLowerCase().includes(q) ||
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
          lang === "bn"
            ? `যাচাই সম্পন্ন (${target.parcelNumber}): ${
                isFlagged
                  ? "সতর্কতা! ৫টি ভেক্টরে সম্ভাব্য অসঙ্গতি চিহ্নিত হয়েছে।"
                  : "মালিকানা ধারাবাহিকতা বৈধ ও অক্ষুণ্ণ।"
              }`
            : `Verification complete (${target.parcelNumber}): ${
                isFlagged
                  ? "Warning: Contradictions flagged across analytical vectors."
                  : "Chain of custody verified clean."
              }`
        );
      }
    }, 400);
  };

  const handleOfficerAction = (actionTitle: string) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNote = `[${timeString}] ${actionTitle} — ${selectedParcel?.parcelNumber || "Plot"}`;
    setAuditNotes((prev) => [newNote, ...prev]);
  };

  const handleSaveCustomNote = () => {
    if (!customNoteText.trim()) return;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNote = `[${timeString}] Note on ${selectedParcel?.parcelNumber}: "${customNoteText.trim()}"`;
    setAuditNotes((prev) => [newNote, ...prev]);
    setCustomNoteText("");
    setShowNoteModal(false);
  };

  const runPreRegistrationCheck = () => {
    const targetPlot = initialParcels.find((p) => p.id === simPlotId);
    if (!targetPlot) return;

    const reasons: string[] = [];
    const normalizedSeller = simSeller.trim().toLowerCase();

    // Check 1: Does seller exist in preceding buyers or initial survey owner?
    const hasPriorTitle =
      targetPlot.deeds.some(
        (d) => d.buyerName.trim().toLowerCase() === normalizedSeller
      ) ||
      targetPlot.deeds.some(
        (d) => d.sellerName.trim().toLowerCase() === normalizedSeller && d.serialOrder === 1
      ) ||
      targetPlot.currentOwner.trim().toLowerCase() === normalizedSeller;

    if (!hasPriorTitle) {
      reasons.push(
        lang === "bn"
          ? `দাতা '${simSeller}' উক্ত প্লটের কোনো পূর্ববর্তী ক্রয় দলিল বা খতিয়ানে মালিক হিসেবে নথিভুক্ত নেই (মালিকানা ধারাবাহিকতা বিচ্ছিন্ন)।`
          : `Seller '${simSeller}' has no preceding recorded deed or khatian title in the chain of custody (Chain Break).`
      );
    }

    // Check 2: Area overflow
    if (simArea > targetPlot.totalArea) {
      reasons.push(
        lang === "bn"
          ? `প্রস্তাবিত জমি (${simArea} শতাংশ) খতিয়ানের মোট পরিমাপ (${targetPlot.totalArea} শতাংশ) অপেক্ষা অধিক (জমির পরিমাপের গরমিল)।`
          : `Proposed area (${simArea} dec) exceeds parent survey khatian boundary (${targetPlot.totalArea} dec) (Area Mismatch).`
      );
    }

    // Check 3: Has this seller already sold?
    const alreadySold = targetPlot.deeds.some(
      (d) => d.sellerName.trim().toLowerCase() === normalizedSeller
    );
    if (alreadySold) {
      reasons.push(
        lang === "bn"
          ? `উক্ত দাতা ইতিপূর্বে এই প্লটে জমি হস্তান্তর করেছেন। পুনরায় হস্তান্তর দ্বৈত বিক্রয়ের ঝুঁকি তৈরি করে।`
          : `This grantor has previously alienated title on this plot. Potential Double Selling contradiction.`
      );
    }

    setSimResult({
      tested: true,
      pass: reasons.length === 0,
      reasons,
    });
  };

  // Helper for issue tag
  const getIssueLabel = (parcel: Parcel) => {
    if (parcel.status === "ACTIVE") {
      return {
        label: lang === "bn" ? "বৈধ ধারাবাহিকতা" : "Clean Custody",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }
    const firstAnomaly = parcel.anomalies?.[0];
    if (firstAnomaly) {
      if (firstAnomaly.anomalyType === "DOUBLE_SELLING") {
        return {
          label: lang === "bn" ? "দ্বৈত বিক্রয়" : "Double Selling",
          color: "bg-red-50 text-red-700 border-red-200",
        };
      }
      if (firstAnomaly.anomalyType === "CHAIN_BREAK") {
        return {
          label: lang === "bn" ? "ধারাবাহিকতা বিচ্ছিন্ন" : "Chain Break",
          color: "bg-red-50 text-red-700 border-red-200",
        };
      }
      if (firstAnomaly.anomalyType === "AREA_MISMATCH") {
        return {
          label: lang === "bn" ? "পরিমাপ অসঙ্গতি" : "Area Mismatch",
          color: "bg-amber-50 text-amber-800 border-amber-200",
        };
      }
      if (firstAnomaly.anomalyType === "DEED_MUTATION_MISMATCH") {
        return {
          label: lang === "bn" ? "দলিল-নামজারি অমিল" : "Deed-Mutation Mismatch",
          color: "bg-amber-50 text-amber-800 border-amber-200",
        };
      }
      if (firstAnomaly.anomalyType === "TIMING_ANOMALY") {
        return {
          label: lang === "bn" ? "সময়ানুক্রমিক অসঙ্গতি" : "Timing Anomaly",
          color: "bg-orange-50 text-orange-700 border-orange-200",
        };
      }
    }
    return {
      label: lang === "bn" ? "বহুবিধ অসঙ্গতি" : "Multiple Contradictions",
      color: "bg-red-50 text-red-700 border-red-200",
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. TOP HEADER & OFFICIAL BRANDING */}
      <header className="bg-white border-b border-slate-200/90 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    {t.appName}
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                    {t.badge}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {t.govtBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{t.tagline}</p>
              </div>
            </div>

            {/* Officer & Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <UserCheck className="h-3.5 w-3.5 text-teal-700" />
                <span className="font-medium text-slate-700">{t.officerId}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
                <Database className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-mono text-slate-700">{t.dbConnected}</span>
              </div>

              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === "bn" ? "en" : "bn")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
                title="Toggle Language / ভাষা পরিবর্তন করুন"
              >
                <Languages className="h-3.5 w-3.5 text-teal-700" />
                <span>{lang === "bn" ? "English" : "বাংলা"}</span>
              </button>
            </div>
          </div>

          {/* Synthetic Data & Legal Notice */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1.5">
            <div className="flex items-center gap-1.5 text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 w-fit">
              <Info className="h-3.5 w-3.5 text-amber-700 flex-shrink-0" />
              <span>{t.syntheticNotice}</span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              {t.legalDisclaimer}
            </p>
          </div>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 py-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("DASHBOARD")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "DASHBOARD"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{t.tabDashboard}</span>
            </button>

            <button
              onClick={() => setActiveTab("TRANSFER_CHECK")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "TRANSFER_CHECK"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>{t.tabTransferCheck}</span>
            </button>

            <button
              onClick={() => setActiveTab("ALERTS")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "ALERTS"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{t.tabAlerts}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                {summaryMetrics.flagged}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* 3. MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: DASHBOARD & INVESTIGATION */}
        {activeTab === "DASHBOARD" && (
          <div className="space-y-6">
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
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 whitespace-nowrap"
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
                  <span>ফিল্টার / Filters:</span>
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      statusFilter === "ALL"
                        ? "bg-slate-200 text-slate-800"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {t.allFilter}
                  </button>
                  <button
                    onClick={() => setStatusFilter("FLAGGED")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      statusFilter === "FLAGGED"
                        ? "bg-red-100 text-red-800"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {t.flaggedFilter}
                  </button>
                  <button
                    onClick={() => setStatusFilter("ACTIVE")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      statusFilter === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {t.cleanFilter}
                  </button>
                </div>

                <span className="text-slate-400 text-[11px]">
                  Showing {filteredParcels.length} of {initialParcels.length} demo records
                </span>
              </div>
            </section>

            {/* VERIFY NOTICE BANNER */}
            {verifyNotice && (
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-700 flex-shrink-0" />
                  <span className="font-medium">{verifyNotice}</span>
                </div>
                <button
                  onClick={() => setVerifyNotice(null)}
                  className="text-teal-700 hover:text-teal-900"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* THREE CORE SUMMARY METRICS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 1. Records Checked */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                    {t.recordsChecked}
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block font-mono">
                    {summaryMetrics.total}
                  </span>
                  <span className="text-[11px] text-slate-400">Total Seed Parcels</span>
                </div>
                <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
              </div>

              {/* 2. Clean Records */}
              <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block">
                    {t.cleanRecords}
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-700 mt-0.5 block font-mono">
                    {summaryMetrics.clean}
                  </span>
                  <span className="text-[11px] text-emerald-600">100% Valid Chain</span>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              {/* 3. Flagged Records */}
              <div className="p-4 rounded-xl bg-white border border-red-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-700 block">
                    {t.flaggedRecords}
                  </span>
                  <span className="text-2xl font-extrabold text-red-700 mt-0.5 block font-mono">
                    {summaryMetrics.flagged}
                  </span>
                  <span className="text-[11px] text-red-600">Requiring Review</span>
                </div>
                <div className="h-10 w-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </section>

            {/* SPLIT LAYOUT: LEFT = COMPACT LIST, RIGHT = INVESTIGATION DETAILS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT: COMPACT LIST OF RECORDS */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-teal-700" />
                    {t.registryListTitle} ({filteredParcels.length})
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {filteredParcels.map((parcel) => {
                    const isSelected = selectedParcel?.id === parcel.id;
                    const issue = getIssueLabel(parcel);

                    return (
                      <div
                        key={parcel.id}
                        onClick={() => setSelectedParcelId(parcel.id)}
                        className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-white border-teal-700 ring-2 ring-teal-700/20 shadow-md"
                            : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-slate-900">
                                {parcel.parcelNumber}
                              </span>
                              <span
                                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${issue.color}`}
                              >
                                {issue.label}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {parcel.mouza}, {parcel.district}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-800 font-mono">
                              {parcel.totalArea} {t.decimals}
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {parcel.khatianNumber}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <span className="truncate max-w-[180px] font-medium text-slate-700">
                            {parcel.currentOwner}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500">
                              {parcel.deeds?.length || 0} deeds
                            </span>
                            <ChevronRight
                              className={`h-3.5 w-3.5 ${
                                isSelected ? "text-teal-700" : "text-slate-400"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: INVESTIGATION DETAILS PANEL */}
              <div className="lg:col-span-7">
                {selectedParcel && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6">
                    {/* DOSSIER HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-extrabold text-slate-900 font-mono">
                            {selectedParcel.parcelNumber}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${
                              selectedParcel.status === "FLAGGED"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {selectedParcel.status === "FLAGGED"
                              ? t.flaggedStatus
                              : t.cleanStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {t.mouza}: <strong>{selectedParcel.mouza}</strong> | {t.upazila}: <strong>{selectedParcel.upazila}</strong> | {t.district}: <strong>{selectedParcel.district}</strong> | {t.khatian}: <strong>{selectedParcel.khatianNumber}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => setShowPrintModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>{t.printReport}</span>
                        </button>

                        {/* Risk Score Pill */}
                        <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-right">
                          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                            Risk Score
                          </span>
                          <span
                            className={`text-lg font-black font-mono leading-none ${
                              (currentAudit?.riskScore || 0) >= 60
                                ? "text-red-700"
                                : (currentAudit?.riskScore || 0) > 0
                                ? "text-amber-700"
                                : "text-emerald-700"
                            }`}
                          >
                            {currentAudit?.riskScore || 0}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RISK EXPLANATION BOX */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          {t.riskScoreTitle}:{" "}
                          <span
                            className={
                              (currentAudit?.riskScore || 0) >= 60
                                ? "text-red-700 font-bold"
                                : (currentAudit?.riskScore || 0) > 0
                                ? "text-amber-700 font-bold"
                                : "text-emerald-700 font-bold"
                            }
                          >
                            {(currentAudit?.riskScore || 0) >= 60
                              ? t.criticalRisk
                              : (currentAudit?.riskScore || 0) >= 30
                              ? t.highRisk
                              : (currentAudit?.riskScore || 0) > 0
                              ? t.mediumRisk
                              : t.cleanRisk}
                          </span>
                        </span>
                        <span className="text-slate-400 text-[11px] font-mono">
                          {currentAudit?.anomalies.length || 0} contradictions flagged
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {t.riskScoreDesc}
                      </p>
                    </div>

                    {/* RECORDED AREA VS DEED-CLAIMED AREA */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <Scale className="h-4 w-4 text-teal-700" />
                        {t.areaComparisonTitle}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                          <span className="text-[11px] text-slate-500 block">
                            {t.khatianSurveyArea}
                          </span>
                          <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                            {selectedParcel.totalArea} {t.decimals}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                          <span className="text-[11px] text-slate-500 block">
                            {t.deedTransferredArea}
                          </span>
                          <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                            {selectedParcel.deeds?.[selectedParcel.deeds.length - 1]?.transferredArea || selectedParcel.totalArea} {t.decimals}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                          <span className="text-[11px] text-slate-500 block">
                            {t.areaMatchStatus}
                          </span>
                          {selectedParcel.deeds.some((d) => d.transferredArea > selectedParcel.totalArea) ? (
                            <span className="text-xs font-bold text-red-700 mt-1 block">
                              {t.areaExceeded}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-emerald-700 mt-1 block">
                              {t.areaConsistent}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* DETECTED CONTRADICTIONS */}
                    {selectedParcel.anomalies && selectedParcel.anomalies.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" />
                          {t.anomaliesDetected} ({selectedParcel.anomalies.length})
                        </h4>

                        {selectedParcel.anomalies.map((anom, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-red-50/60 border border-red-200 text-slate-900 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                {anom.title}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-300">
                                {anom.severity}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed">
                              {anom.description}
                            </p>

                            {/* Expandable Technical Parameters */}
                            {anom.evidence && (
                              <details className="text-xs border-t border-red-200/60 pt-2 text-slate-600 group">
                                <summary className="cursor-pointer font-medium text-red-800 hover:text-red-950 flex items-center gap-1 select-none">
                                  <span>{t.technicalEvidence}</span>
                                  <ChevronDown className="h-3 w-3 group-open:rotate-180 transition-transform" />
                                </summary>
                                <pre className="mt-2 p-2.5 rounded-lg bg-white border border-red-200 font-mono text-[11px] text-slate-800 overflow-x-auto whitespace-pre-wrap">
                                  {anom.evidence}
                                </pre>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TITLE CHAIN & DEED CHRONOLOGY */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <History className="h-4 w-4 text-teal-700" />
                        {t.deedTimeline}
                      </h4>

                      <div className="relative pl-6 border-l-2 border-slate-200 space-y-3.5">
                        {selectedParcel.deeds?.map((deed) => (
                          <div key={deed.id} className="relative">
                            <div
                              className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-white ${
                                deed.isVerified
                                  ? "border-emerald-600 ring-2 ring-emerald-100"
                                  : "border-red-600 ring-2 ring-red-100"
                              }`}
                            />

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-teal-800 text-xs">
                                  {deed.deedNumber}
                                </span>
                                <span className="text-slate-500 text-[11px] font-mono">
                                  {new Date(deed.deedDate).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-slate-700 pt-0.5">
                                <div>
                                  <span className="text-slate-400">{t.seller}: </span>
                                  <span className="font-semibold text-slate-900">
                                    {deed.sellerName}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400">{t.buyer}: </span>
                                  <span className="font-semibold text-slate-900">
                                    {deed.buyerName}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200">
                                <span>
                                  {t.totalArea}:{" "}
                                  <strong className="text-slate-800 font-mono">
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

                    {/* MUTATIONS / NAMJARI */}
                    {selectedParcel.mutations && selectedParcel.mutations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                          <UserCheck className="h-4 w-4 text-teal-700" />
                          {t.mutationRecords}
                        </h4>

                        {selectedParcel.mutations.map((mut) => (
                          <div
                            key={mut.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                          >
                            <div>
                              <span className="font-mono text-slate-800 font-bold">
                                {mut.caseNumber}
                              </span>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {mut.applicantName} ({mut.officerName})
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                                {mut.status}
                              </span>
                              <p className="text-[11px] text-slate-600 font-mono mt-0.5 font-bold">
                                {mut.mutatedArea} {t.decimals}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* OFFICER REVIEW ACTIONS */}
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Scale className="h-4 w-4 text-teal-700" />
                        {t.officerActionsTitle}
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => handleOfficerAction(t.actionMarkReview)}
                          className="p-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold shadow-xs transition-colors"
                        >
                          {t.actionMarkReview}
                        </button>
                        <button
                          onClick={() => handleOfficerAction(t.actionFieldInquiry)}
                          className="p-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold shadow-xs transition-colors"
                        >
                          {t.actionFieldInquiry}
                        </button>
                        <button
                          onClick={() => setShowNoteModal(true)}
                          className="p-2.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-xs font-semibold shadow-xs transition-colors"
                        >
                          {t.actionAddNote}
                        </button>
                        <button
                          onClick={() => handleOfficerAction(t.actionForward)}
                          className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold shadow-xs transition-colors"
                        >
                          {t.actionForward}
                        </button>
                      </div>

                      {/* Action Trail */}
                      {auditNotes.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 mt-2">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                            {t.recentActions}
                          </span>
                          {auditNotes.slice(0, 3).map((n, i) => (
                            <p key={i} className="text-[11px] text-slate-700 font-mono">
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-teal-700" />
                {t.simTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{t.simDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === "bn" ? "টার্গেট প্লট নির্বাচন করুন" : "Select Target Plot"}
                </label>
                <select
                  value={simPlotId}
                  onChange={(e) => setSimPlotId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {initialParcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.parcelNumber} ({p.mouza}, {p.district} — {p.totalArea} dec)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.seller}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Abdur Rashid / Enamul Haque"
                  value={simSeller}
                  onChange={(e) => setSimSeller(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.buyer}
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Prospective Buyer"
                  value={simBuyer}
                  onChange={(e) => setSimBuyer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === "bn" ? "প্রস্তাবিত জমির পরিমাপ (শতাংশ)" : "Proposed Area (Decimals)"}
                </label>
                <input
                  type="number"
                  value={simArea}
                  onChange={(e) => setSimArea(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.deedDate}
                </label>
                <input
                  type="date"
                  value={simDate}
                  onChange={(e) => setSimDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <button
              onClick={runPreRegistrationCheck}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              {t.simTestBtn}
            </button>

            {simResult && simResult.tested && (
              <div
                className={`p-4 rounded-xl border ${
                  simResult.pass
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-red-50 border-red-300 text-red-900"
                } space-y-2`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {simResult.pass ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                      <span>{t.simPass}</span>
                    </>
                  ) : (
                    <>
                      <AlertOctagon className="h-5 w-5 text-red-700" />
                      <span>{t.simFail}</span>
                    </>
                  )}
                </div>

                {!simResult.pass && (
                  <ul className="space-y-1 pl-6 list-disc text-xs text-red-800">
                    {simResult.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALL CONTRADICTIONS & FRAUD ALERTS */}
        {activeTab === "ALERTS" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-700" />
                {t.tabAlerts}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === "bn"
                  ? "৭টি সিন্থেটিক প্লটের মধ্যে সনাক্তকৃত সকল অসঙ্গতির বিস্তারিত তালিকা"
                  : "Comprehensive breakdown of contradictions flagged across the 7 synthetic test parcels"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialParcels.flatMap((p) =>
                (p.anomalies || []).map((anom, idx) => (
                  <div
                    key={`${p.id}-${idx}`}
                    onClick={() => {
                      setSelectedParcelId(p.id);
                      setActiveTab("DASHBOARD");
                    }}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer space-y-2 text-xs transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-teal-800 font-bold">
                        {p.parcelNumber} ({p.district})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-200">
                        {anom.severity}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{anom.title}</h4>
                    <p className="text-slate-600">{anom.description}</p>
                    <div className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
                      <span>ইনভেস্টিগেশন দেখুন / View Dossier</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD INVESTIGATION NOTE */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-700" />
                {t.noteModalTitle}
              </h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                Plot: <strong>{selectedParcel?.parcelNumber}</strong> ({selectedParcel?.mouza})
              </p>
              <textarea
                value={customNoteText}
                onChange={(e) => setCustomNoteText(e.target.value)}
                placeholder={t.notePlaceholder}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={handleSaveCustomNote}
                className="px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs"
              >
                {t.saveNoteBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINT DOSSIER MODAL */}
      {showPrintModal && selectedParcel && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-slate-900 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  {lang === "bn"
                    ? "সহকারী কমিশনার (ভূমি) তদন্ত সারাংশ প্রতিবেদন"
                    : "LandTrace Forensic Investigation Dossier"}
                </h3>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>দাগ / Plot: <strong>{selectedParcel.parcelNumber}</strong></div>
                <div>খতিয়ান / Khatian: <strong>{selectedParcel.khatianNumber}</strong></div>
                <div>মৌজা / Mouza: <strong>{selectedParcel.mouza}</strong></div>
                <div>জেলা / District: <strong>{selectedParcel.district}</strong></div>
                <div>মোট পরিমাপ / Area: <strong>{selectedParcel.totalArea} {t.decimals}</strong></div>
                <div>বর্তমান মালিক: <strong>{selectedParcel.currentOwner}</strong></div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">
                  {lang === "bn" ? "সনাক্তকৃত অসঙ্গতিসমূহ:" : "Detected Contradictions:"}
                </span>
                {selectedParcel.anomalies && selectedParcel.anomalies.length > 0 ? (
                  selectedParcel.anomalies.map((a, i) => (
                    <p key={i} className="text-red-800">
                      • [{a.severity}] {a.title}: {a.description}
                    </p>
                  ))
                ) : (
                  <p className="text-emerald-800 font-medium">
                    {lang === "bn"
                      ? "কোনো অসঙ্গতি পাওয়া যায়নি (মালিকানা ধারাবাহিকতা বৈধ)।"
                      : "Zero anomalies detected (Chain of Title Verified Clean)."}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">
                  {lang === "bn" ? "অফিসার অ্যাকশন ট্রেইল:" : "Recorded Officer Action Trail:"}
                </span>
                {auditNotes.map((n, i) => (
                  <p key={i} className="text-[11px] text-slate-600 font-mono">
                    {n}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 italic">
                {t.legalDisclaimer}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs"
                >
                  {lang === "bn" ? "প্রিন্ট করুন" : "Print"}
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300"
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
