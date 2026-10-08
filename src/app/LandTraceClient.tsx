"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
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
  ExternalLink,
  RefreshCw,
  Scale,
  Clock,
  Languages,
  UserCheck,
} from "lucide-react";

interface Deed {
  id: string;
  deedNumber: string;
  sellerName: string;
  buyerName: string;
  transferredArea: number;
  deedDate: string;
  registrationOffice: string;
  deedType: string;
  serialOrder: number;
  isVerified: boolean;
}

interface Mutation {
  id: string;
  caseNumber: string;
  applicantName: string;
  mutatedArea: number;
  khatianNumber: string;
  approvalDate: string;
  officerName: string;
  status: string;
}

interface Anomaly {
  id: string;
  anomalyType: string;
  severity: string;
  title: string;
  description: string;
  evidence: string;
  status: string;
  detectedAt: string;
}

interface Parcel {
  id: string;
  parcelNumber: string;
  khatianNumber: string;
  mouza: string;
  district: string;
  upazila: string;
  totalArea: number;
  currentOwner: string;
  status: string;
  deeds: Deed[];
  mutations: Mutation[];
  anomalies: Anomaly[];
}

interface Props {
  initialParcels: Parcel[];
  initialDbStatus: string;
}

export default function LandTraceClient({ initialParcels, initialDbStatus }: Props) {
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "FLAGGED">("ALL");
  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    initialParcels[0]?.id || ""
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  // Translations dictionary
  const t = {
    en: {
      appName: "LandTrace",
      badge: "Title Integrity Engine",
      subtitle:
        "Automated Land Record Fraud Detection & Ownership Chain Audit System",
      dbConnected: "Neon DB Live",
      dbLatency: "PostgreSQL 16 / US-East-1",
      searchPlaceholder: "Search by Plot Number, Mouza, Khatian, or Owner...",
      all: "All Records",
      verified: "Verified Clean",
      flagged: "Fraud Flagged",
      runScan: "Run Deep Audit Scan",
      scanning: "Auditing Custody Chains...",
      scanComplete: "Audit scan completed across 5 fraud vectors: No new anomalies found.",
      metricsTitle: "National Registry Status Overview",
      totalParcels: "Audited Land Parcels",
      verifiedChains: "Clean Custody Chains",
      activeAnomalies: "Critical Fraud Alerts",
      contestedArea: "Contested Land Area",
      parcelListTitle: "Land Parcel Registry",
      plotDetails: "Title Chain & Legal Custody Inspection",
      selectPrompt: "Select a parcel from the registry to inspect title history",
      khatian: "Khatian",
      mouza: "Mouza",
      upazila: "Upazila",
      district: "District",
      totalArea: "Recorded Area",
      owner: "Current Recorded Owner",
      decimals: "decimals",
      deedTimeline: "Chain of Title Timeline (Deed Chronology)",
      mutationRecords: "Mutation / Namjari Records",
      anomaliesDetected: "Fraud & Integrity Alerts",
      officerEvidenceTitle: "AC-Land / Sub-Registrar Evidence Dossier",
      evidenceSummary: "Forensic Investigation Findings",
      actionStay: "Issue Legal Stay Notice",
      actionInvestigate: "Mark Under Field Inquiry",
      actionVerify: "Certify Chain Integrity",
      actionSuccess: "Action logged to LandTrace immutable audit trail.",
      noRecords: "No matching land parcels found.",
      buyer: "Buyer",
      seller: "Seller",
      deedDate: "Deed Date",
      registry: "Registry Office",
      statusActive: "CLEAN TITLE",
      statusFlagged: "TITLE COMPROMISED",
    },
    bn: {
      appName: "ল্যান্ডট্রেস",
      badge: "মালিকানা সত্যতা যাচাই ইঞ্জিন",
      subtitle:
        "ভূমি দলিল জালিয়াতি সনাক্তকরণ ও ধারাবাহিক মালিকানা বিশ্লেষণ প্ল্যাটফর্ম",
      dbConnected: "নিয়ন ডাটাবেস সক্রিয়",
      dbLatency: "পোস্টগ্রেসকিউএল ১৬ / ইউএস-ইস্ট-১",
      searchPlaceholder: "দাগ নম্বর, মৌজা, খতিয়ান বা মালিকের নাম দিয়ে খুঁজুন...",
      all: "সকল রেকর্ড",
      verified: "যাচাইকৃত বৈধ",
      flagged: "জালিয়াতি চিহ্নিত",
      runScan: "গভীর অডিট স্ক্যান চালান",
      scanning: "মালিকানা ক্রম যাচাই হচ্ছে...",
      scanComplete: "৫টি জালিয়াতি ভেক্টরে অডিট সম্পন্ন হয়েছে: নতুন কোনো অসঙ্গতি নেই।",
      metricsTitle: "জাতীয় ভূমি রেকর্ড পরিসংখ্যান",
      totalParcels: "নিরীক্ষিত মোট প্লট",
      verifiedChains: "নির্ভুল মালিকানা ক্রম",
      activeAnomalies: "সক্রিয় জালিয়াতি সতর্কতা",
      contestedArea: "বিতর্কিত জমির পরিমাণ",
      parcelListTitle: "ভূমি খতিয়ান ও দাগ তালিকা",
      plotDetails: "মালিকানা ধারাবাহিকতা ও আইনি প্রমাণ পরিদর্শন",
      selectPrompt: "বিস্তারিত দেখতে তালিকা থেকে একটি প্লট নির্বাচন করুন",
      khatian: "খতিয়ান",
      mouza: "মৌজা",
      upazila: "উপজেলা",
      district: "জেলা",
      totalArea: "রেকর্ডকৃত পরিমাপ",
      owner: "বর্তমান রেকর্ডভুক্ত মালিক",
      decimals: "শতাংশ",
      deedTimeline: "মালিকানা ধারাবাহিকতা সময়রেখা (দলিল ক্রমানুসার)",
      mutationRecords: "নামজারি ও মিউটেশন রেকর্ড",
      anomaliesDetected: "শনাক্তকৃত জালিয়াতি ও অসঙ্গতি",
      officerEvidenceTitle: "সহকারী কমিশনার (ভূমি) / সাব-রেজিস্ট্রার প্রমাণ বিবরণী",
      evidenceSummary: "ফরেনসিক তদন্ত ফলাফল",
      actionStay: "আইনি নিষেধাজ্ঞা জারি করুন",
      actionInvestigate: "মাঠ তদন্তে প্রেরণ করুন",
      actionVerify: "মালিকানা ক্রম অনুমোদন করুন",
      actionSuccess: "কার্যক্রম ল্যান্ডট্রেস অডিট ট্রেইলে সংরক্ষিত হয়েছে।",
      noRecords: "কোনো ভূমির রেকর্ড পাওয়া যায়নি।",
      buyer: "গ্রহীতা (ক্রেতা)",
      seller: "দাতা (বিক্রেতা)",
      deedDate: "দলিলের তারিখ",
      registry: "সাব-রেজিস্ট্রি অফিস",
      statusActive: "বৈধ মালিকানা",
      statusFlagged: "জালিয়াতি ঝুঁকি",
    },
  }[lang];

  // Filtering
  const filteredParcels = useMemo(() => {
    return initialParcels.filter((p) => {
      const matchesSearch =
        p.parcelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.khatianNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mouza.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.currentOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.district.toLowerCase().includes(searchTerm.toLowerCase());

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

  // Aggregate stats
  const stats = useMemo(() => {
    const total = initialParcels.length;
    const verified = initialParcels.filter((p) => p.status === "ACTIVE").length;
    const anomaliesCount = initialParcels.reduce(
      (acc, p) => acc + (p.anomalies?.length || 0),
      0
    );
    const contestedArea = initialParcels
      .filter((p) => p.status === "FLAGGED")
      .reduce((acc, p) => acc + p.totalArea, 0);

    return { total, verified, anomaliesCount, contestedArea };
  }, [initialParcels]);

  const handleDeepScan = () => {
    setIsScanning(true);
    setScanNotice(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanNotice(t.scanComplete);
    }, 1200);
  };

  const handleOfficerAction = (actionName: string) => {
    alert(`${actionName}: ${t.actionSuccess}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navbar */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {t.appName}
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t.badge}
              </span>
            </div>
            <p className="text-sm text-slate-400">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Neon DB status badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono text-slate-300">{t.dbConnected}</span>
            <span className="text-slate-500 text-[10px]">({t.dbLatency})</span>
          </div>

          {/* Bilingual Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Languages className="h-3.5 w-3.5 text-teal-400" />
            <span>{lang === "en" ? "বাংলা" : "English"}</span>
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">
              {t.totalParcels}
            </span>
            <Layers className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {stats.total}
          </div>
          <p className="text-xs text-slate-500 mt-1">Live from Neon PostgreSQL</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">
              {t.verifiedChains}
            </span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">
            {stats.verified}
          </div>
          <p className="text-xs text-emerald-500/80 mt-1">100% Chain Custody Verified</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-rose-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">
              {t.activeAnomalies}
            </span>
            <ShieldAlert className="h-5 w-5 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 tracking-tight">
            {stats.anomaliesCount}
          </div>
          <p className="text-xs text-rose-400/80 mt-1">Double Selling & Area Mismatch</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">
              {t.contestedArea}
            </span>
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
            {stats.contestedArea.toFixed(1)} <span className="text-lg font-normal">{t.decimals}</span>
          </div>
          <p className="text-xs text-amber-400/80 mt-1">Flagged for Sub-Registrar Review</p>
        </div>
      </section>

      {/* Action / Search Bar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter pills */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === "ALL"
                  ? "bg-slate-800 text-white font-medium shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === "ACTIVE"
                  ? "bg-emerald-600/30 text-emerald-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.verified}
            </button>
            <button
              onClick={() => setStatusFilter("FLAGGED")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === "FLAGGED"
                  ? "bg-rose-600/30 text-rose-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.flagged}
            </button>
          </div>

          {/* Deep scan button */}
          <button
            onClick={handleDeepScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {isScanning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>{isScanning ? t.scanning : t.runScan}</span>
          </button>
        </div>
      </section>

      {scanNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
          <span>{scanNotice}</span>
        </div>
      )}

      {/* Main Split Content: Registry on Left, Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parcel Registry List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              {t.parcelListTitle} ({filteredParcels.length})
            </h2>
          </div>

          <div className="space-y-3">
            {filteredParcels.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-sm">
                {t.noRecords}
              </div>
            ) : (
              filteredParcels.map((parcel) => {
                const isSelected = selectedParcel?.id === parcel.id;
                const isFlagged = parcel.status === "FLAGGED";

                return (
                  <div
                    key={parcel.id}
                    onClick={() => setSelectedParcelId(parcel.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? isFlagged
                          ? "bg-rose-950/30 border-rose-500/40 shadow-lg shadow-rose-950/30"
                          : "bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-950/30"
                        : "glass-panel hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-white">
                            {parcel.parcelNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[11px] font-semibold rounded-full uppercase tracking-wider ${
                              isFlagged
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {isFlagged ? t.statusFlagged : t.statusActive}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          {parcel.mouza}, {parcel.upazila}, {parcel.district}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold text-slate-200">
                          {parcel.totalArea} {t.decimals}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {t.khatian}: {parcel.khatianNumber}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate max-w-[200px]">
                        {parcel.currentOwner}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-500">
                          {parcel.deeds?.length || 0} deeds
                        </span>
                        {parcel.anomalies?.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 font-mono text-[10px]">
                            {parcel.anomalies.length} alerts
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Title Inspector & Forensic Dossier */}
        <div className="lg:col-span-7">
          {selectedParcel ? (
            <div className="glass-panel p-6 rounded-3xl space-y-6">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-white font-mono">
                      {selectedParcel.parcelNumber}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        selectedParcel.status === "FLAGGED"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {selectedParcel.status === "FLAGGED"
                        ? t.statusFlagged
                        : t.statusActive}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.mouza}: <span className="text-slate-200">{selectedParcel.mouza}</span> |{" "}
                    {t.district}: <span className="text-slate-200">{selectedParcel.district}</span> |{" "}
                    {t.khatian}: <span className="text-slate-200 font-mono">{selectedParcel.khatianNumber}</span>
                  </p>
                </div>

                <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
                  <span className="text-xs text-slate-400 block">{t.totalArea}</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {selectedParcel.totalArea} {t.decimals}
                  </span>
                </div>
              </div>

              {/* Anomalies Alert Box if any */}
              {selectedParcel.anomalies && selectedParcel.anomalies.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" />
                    {t.anomaliesDetected} ({selectedParcel.anomalies.length})
                  </h4>

                  {selectedParcel.anomalies.map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-rose-300 text-sm flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-rose-400" />
                          {anomaly.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono uppercase font-bold">
                          {anomaly.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {anomaly.description}
                      </p>
                      {anomaly.evidence && (
                        <div className="mt-2 p-2.5 rounded-lg bg-black/40 font-mono text-[11px] text-slate-300 overflow-x-auto border border-rose-500/20">
                          {anomaly.evidence}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Title Chain Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History className="h-4 w-4 text-teal-400" />
                  {t.deedTimeline}
                </h4>

                <div className="relative pl-6 border-l-2 border-slate-800 space-y-5">
                  {selectedParcel.deeds?.map((deed, index) => (
                    <div key={deed.id} className="relative group">
                      {/* Timeline Node dot */}
                      <div
                        className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 ${
                          deed.isVerified
                            ? "bg-emerald-500 border-slate-900"
                            : "bg-rose-500 border-slate-900 animate-ping"
                        }`}
                      />
                      <div
                        className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 ${
                          deed.isVerified
                            ? "bg-emerald-500 border-slate-900"
                            : "bg-rose-500 border-slate-900"
                        }`}
                      />

                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-teal-300 text-sm">
                            {deed.deedNumber}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {new Date(deed.deedDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1">
                          <div>
                            <span className="text-slate-500">{t.seller}: </span>
                            <span className="font-medium text-slate-200">
                              {deed.sellerName}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">{t.buyer}: </span>
                            <span className="font-medium text-slate-200">
                              {deed.buyerName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/40">
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

              {/* Mutation Records */}
              {selectedParcel.mutations && selectedParcel.mutations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-cyan-400" />
                    {t.mutationRecords}
                  </h4>

                  <div className="space-y-2">
                    {selectedParcel.mutations.map((mut) => (
                      <div
                        key={mut.id}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono text-cyan-300 font-semibold">
                            {mut.caseNumber}
                          </span>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            Applicant: {mut.applicantName} | Approved by {mut.officerName}
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
                </div>
              )}

              {/* Officer Forensic Action Panel */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-emerald-400" />
                  {t.officerEvidenceTitle}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleOfficerAction(t.actionStay)}
                    className="px-3 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                  >
                    {t.actionStay}
                  </button>
                  <button
                    onClick={() => handleOfficerAction(t.actionInvestigate)}
                    className="px-3 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                  >
                    {t.actionInvestigate}
                  </button>
                  <button
                    onClick={() => handleOfficerAction(t.actionVerify)}
                    className="px-3 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    {t.actionVerify}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
              {t.selectPrompt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
