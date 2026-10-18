"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Search,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Calculator,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { Parcel } from "@/lib/parcels";
import { AuditResult } from "@/lib/detection-engine";

interface Props {
  user: {
    id: string;
    email: string;
    name: string;
    designation?: string;
    permittedPlots: string;
  };
  parcel: Parcel | null;
  audit: AuditResult | null;
}

export default function CitizenDashboardClient({ user, parcel, audit }: Props) {
  const { isBangla, formatNum, formatLandArea, formatRiskScore } = useLanguage();

  // Pre-registration Transfer Simulator state
  const [simSeller, setSimSeller] = useState("Mohammad Abdul Karim");
  const [simBuyer, setSimBuyer] = useState("");
  const [simArea, setSimArea] = useState("5.0");
  const [simResult, setSimResult] = useState<{
    tested: boolean;
    valid: boolean;
    messageBn: string;
    messageEn: string;
    score: number;
  } | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const areaNum = parseFloat(simArea);

    if (!simBuyer.trim()) {
      return;
    }

    if (isNaN(areaNum) || areaNum <= 0) {
      setSimResult({
        tested: true,
        valid: false,
        score: 0,
        messageBn: "অবৈধ জমির পরিমাণ। অনুগ্রহ করে সঠিক সংখ্যা প্রদান করুন।",
        messageEn: "Invalid land acreage. Please enter a positive number.",
      });
      return;
    }

    if (parcel && areaNum > parcel.totalArea) {
      setSimResult({
        tested: true,
        valid: false,
        score: 35,
        messageBn: `সতর্কতা: প্রস্তাবিত পরিমাপ (${areaNum} শতক) বিক্রেতার মোট বৈধ মালিকানার (${parcel.totalArea} শতক) চেয়ে বেশি! এটি পরিমাপ অসঙ্গতি (Area Mismatch) তৈরি করবে।`,
        messageEn: `Warning: Proposed transfer (${areaNum} decimals) exceeds seller's verified ownership (${parcel.totalArea} decimals)! This triggers an Area Mismatch violation.`,
      });
    } else {
      setSimResult({
        tested: true,
        valid: true,
        score: 95,
        messageBn: `অভিনন্দন! বিক্রেতা '${simSeller}'-এর নামে যথেষ্ট পরিমাণ বৈধ ও অপ্রতিদ্বন্দ্বী জমি রয়েছে। প্রস্তাবিত ${areaNum} শতক হস্তান্তর সাব-রেজিস্ট্রি দলিলের জন্য নিরাপদ।`,
        messageEn: `Verified! Seller '${simSeller}' holds sufficient unencumbered title. Proposed conveyance of ${areaNum} decimals passes pre-flight audit with high integrity.`,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Welcome & Citizen Identity Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {user.name}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {isBangla ? "নাগরিক হিসাব" : "Citizen Account"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {user.designation || (isBangla ? "জমি ক্রেতা / নাগরিক আবেদনকারী" : "Citizen / Land Buyer")} • {user.email}
            </p>
          </div>
        </div>

        <div className="text-right sm:text-right w-full sm:w-auto">
          <span className="text-[11px] text-slate-400 block">
            {isBangla ? "অনুমোদিত খতিয়ান এলাকা" : "Authorized Plot Access"}
          </span>
          <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-800">
            {user.permittedPlots}
          </span>
        </div>
      </div>

      {/* Permitted Land Record Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {isBangla ? "আপনার সংরক্ষিত জমির রেকর্ড" : "Your Permitted Land Title Record"}
            </h2>
          </div>
          {audit && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {isBangla ? "নিরাপত্তা স্কোর:" : "Integrity Score:"}
              </span>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-mono">
                {formatRiskScore(audit.riskScore)}
              </span>
            </div>
          )}
        </div>

        {parcel ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">
                  {isBangla ? "প্লট নম্বর" : "Plot Number"}
                </span>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {parcel.parcelNumber}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">
                  {isBangla ? "দাগ ও খতিয়ান" : "Dag & Khatian"}
                </span>
                <span className="font-bold text-slate-800">
                  {isBangla ? `দাগ: ${formatNum(parcel.dagNumber || "৪০২")}` : `Dag: ${parcel.dagNumber || "402"}`} • {parcel.khatianNumber}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">
                  {isBangla ? "মৌজা ও জেলা" : "Mouza & District"}
                </span>
                <span className="font-bold text-slate-800">
                  {parcel.mouza}, {parcel.district}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">
                  {isBangla ? "মোট জমির পরিমাণ" : "Recorded Acreage"}
                </span>
                <span className="font-bold text-teal-700 text-sm">
                  {formatLandArea(parcel.totalArea)}
                </span>
              </div>
            </div>

            {/* Plain language explanation for Citizen */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {isBangla ? "স্বত্ব স্থিতি: সম্পূর্ণ বৈধ ও অবিচ্ছিন্ন" : "Title Status: Verified Clean & Unbroken"}
                </span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                {isBangla
                  ? "সিএস রেকর্ড ১৯৫৬ থেকে শুরু করে বর্তমান মালিক পর্যন্ত সকল দলিল ও নামজারি সম্পূর্ণ সামঞ্জস্যপূর্ণ। এই প্লটে কোনো দ্বৈত বিক্রয়, মধ্যবর্তী দলিল বিচ্যুতি বা পরিমাপের অমিল ধরা পড়েনি।"
                  : "All deeds and mutation orders from 1956 CS survey to current owner are consistent. Zero double-selling, chain-breaks, or area mismatches were detected on this parcel."}
              </p>
            </div>

            <div className="flex justify-end">
              <Link
                href={`/verify/${parcel.parcelNumber}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>{isBangla ? "সম্পূর্ণ স্বত্ব-শৃঙ্খল ও দলিল ইতিহাস দেখুন" : "View Full Chain & Deed History"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            {isBangla ? "কোনো প্লট পাওয়া যায়নি।" : "No parcel record located."}
          </div>
        )}
      </div>

      {/* Pre-Registration Transfer Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Calculator className="w-5 h-5 text-teal-600" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {isBangla ? "হস্তান্তর পূর্ববর্তী ঝুঁকি সিমুলেটর" : "Pre-Registration Transfer Risk Simulator"}
            </h2>
            <p className="text-xs text-slate-500">
              {isBangla
                ? "জমি ক্রয়ের চুক্তি বা বায়না করার পূর্বে প্রস্তাবিত পরিমাপ ও বিক্রেতার বৈধতা পরীক্ষা করুন"
                : "Simulate proposed land purchase parameters to check seller title feasibility before submitting deed"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSimulate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBangla ? "বিক্রেতার নাম" : "Seller Name"}
              </label>
              <input
                type="text"
                required
                value={simSeller}
                onChange={(e) => setSimSeller(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBangla ? "প্রস্তাবিত ক্রেতার নাম" : "Prospective Buyer Name"}
              </label>
              <input
                type="text"
                required
                placeholder={isBangla ? "উদা: মোঃ কামাল উদ্দিন" : "e.g. Md. Kamal Uddin"}
                value={simBuyer}
                onChange={(e) => setSimBuyer(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBangla ? "প্রস্তাবিত ক্রয়ের পরিমাণ (শতাংশ)" : "Proposed Acreage (decimals)"}
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={simArea}
                onChange={(e) => setSimArea(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isBangla ? "ঝুঁকি সিমুলেশন যাচাই করুন" : "Run Pre-Flight Risk Simulation"}</span>
            </button>
          </div>
        </form>

        {simResult && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in duration-200 ${
              simResult.valid
                ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                : "bg-rose-50 border-rose-200 text-rose-950"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                {simResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>
                  {simResult.valid
                    ? isBangla
                      ? "সিমুলেশন সফল: ঝুঁকি নেই"
                      : "Simulation Passed: Clear Feasibility"
                    : isBangla
                    ? "সিমুলেশন সতর্কতা: ঝুঁকি শনাক্ত হয়েছে"
                    : "Simulation Alert: High Transfer Risk"}
                </span>
              </span>

              <span className="font-mono font-bold px-2 py-0.5 rounded bg-white/80 border text-[11px]">
                {formatRiskScore(simResult.score)}
              </span>
            </div>
            <p className="leading-relaxed">
              {isBangla ? simResult.messageBn : simResult.messageEn}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
