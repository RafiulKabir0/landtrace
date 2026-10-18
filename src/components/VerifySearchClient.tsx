"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { Parcel } from "@/lib/parcels";
import { AuditResult } from "@/lib/detection-engine";

interface Props {
  parcels: Parcel[];
  audits: Record<string, AuditResult>;
}

export default function VerifySearchClient({ parcels, audits }: Props) {
  const { isBangla, formatNum, formatLandArea, formatRiskScore, getAnomalyLabel } = useLanguage();

  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [anomalyFilter, setAnomalyFilter] = useState("ALL");

  const districts = useMemo(() => {
    const set = new Set<string>();
    parcels.forEach((p) => {
      if (p.district) set.add(p.district);
    });
    return Array.from(set);
  }, [parcels]);

  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      const audit = audits[p.parcelNumber] || audits[p.id];

      if (districtFilter !== "ALL" && p.district !== districtFilter) return false;

      if (anomalyFilter !== "ALL") {
        if (anomalyFilter === "CLEAN" && audit && audit.anomalies.length > 0) return false;
        if (
          anomalyFilter !== "CLEAN" &&
          (!audit || !audit.anomalies.some((a) => a.anomalyType === anomalyFilter))
        ) {
          return false;
        }
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match =
          p.parcelNumber.toLowerCase().includes(q) ||
          (p.dagNumber && p.dagNumber.toLowerCase().includes(q)) ||
          p.khatianNumber.toLowerCase().includes(q) ||
          p.mouza.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.currentOwner.toLowerCase().includes(q) ||
          p.deeds.some((d) => d.deedNumber.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [parcels, audits, districtFilter, anomalyFilter, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          {isBangla ? "রেকর্ড অনুসন্ধান ও যাচাইকরণ" : "Record Search & Verification Workspace"}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isBangla ? "জমির রেকর্ড ও স্বত্ব-শৃঙ্খল যাচাইকরণ" : "Verify Land Title & Cadastral Lineage"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isBangla
            ? "প্লট নম্বর, দাগ, খতিয়ান, মৌজা অথবা রেজিস্ট্রিকৃত দলিল নম্বর দিয়ে অনুসন্ধান করুন অথবা নমুনা রেকর্ড নির্বাচন করে ৫-স্তরের অডিট ফলাফল প্রত্যক্ষ করুন।"
            : "Search by parcel identifier, dag, khatian, mouza, or registered deed number to inspect the 5-rule P3 fraud audit."}
        </p>
      </div>

      {/* Quick Demonstration Chips */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-700 block">
          {isBangla ? "নমুনা ক্যাডাস্ট্রাল টেস্ট কেসসমূহ (১-ক্লিক নির্বাচন):" : "Sample Cadastral Test Cases (1-Click Select):"}
        </span>

        <div className="flex flex-wrap gap-2.5">
          {parcels.map((p) => {
            const audit = audits[p.parcelNumber] || audits[p.id];
            const isClean = audit && audit.riskLevel === "CLEAN" && audit.anomalies.length === 0;

            return (
              <Link
                key={p.id}
                href={`/verify/${p.parcelNumber}`}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all hover:scale-102 ${
                  isClean
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                    : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                }`}
              >
                <span className="font-mono font-bold">{p.parcelNumber}</span>
                <span className="text-[11px] text-slate-600">({p.mouza})</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isClean ? "bg-emerald-200/80 text-emerald-900" : "bg-rose-200/80 text-rose-900"
                  }`}
                >
                  {isClean ? (isBangla ? "বৈধ" : "Clean") : isBangla ? "ফ্ল্যাগড" : "Flagged"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isBangla
                  ? "প্লট নম্বর, দাগ, খতিয়ান, মৌজা, দলিল নম্বর..."
                  : "Search plot, dag, khatian, mouza, deed number..."
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="ALL">{isBangla ? "সকল জেলা" : "All Districts"}</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={anomalyFilter}
              onChange={(e) => setAnomalyFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="ALL">{isBangla ? "সকল ক্যাটাগরি" : "All Anomaly Types"}</option>
              <option value="CLEAN">{isBangla ? "শুধুমাত্র বৈধ (ক্লিন)" : "Clean Records Only"}</option>
              <option value="DOUBLE_SELLING">{isBangla ? "দ্বৈত বিক্রয়" : "Double Selling"}</option>
              <option value="CHAIN_BREAK">{isBangla ? "ধারাবাহিকতা বিচ্ছিন্ন" : "Chain Break"}</option>
              <option value="AREA_MISMATCH">{isBangla ? "পরিমাপ অসঙ্গতি" : "Area Mismatch"}</option>
              <option value="DEED_MUTATION_MISMATCH">{isBangla ? "দলিল-নামজারি অমিল" : "Deed-Mutation Mismatch"}</option>
              <option value="TIMING_ANOMALY">{isBangla ? "সময় অসঙ্গতি" : "Timing Anomaly"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            {isBangla
              ? `মোট ${formatNum(filteredParcels.length)} টি রেকর্ড পাওয়া গেছে`
              : `Found ${filteredParcels.length} matching parcels`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParcels.map((parcel) => {
            const audit = audits[parcel.parcelNumber] || audits[parcel.id];
            const score = audit ? audit.riskScore : 100;
            const hasAnomalies = audit && audit.anomalies.length > 0;

            return (
              <div
                key={parcel.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono font-bold text-base text-slate-900">
                      {parcel.parcelNumber}
                    </div>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-xs border ${
                        score >= 80
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : score >= 50
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {formatRiskScore(score)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isBangla ? "মৌজা ও জেলা:" : "Location:"}</span>
                      <span className="font-medium text-slate-800">
                        {parcel.mouza}, {parcel.district}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isBangla ? "দাগ ও খতিয়ান:" : "Dag & Khatian:"}</span>
                      <span className="font-medium text-slate-800">
                        {isBangla ? `দাগ: ${formatNum(parcel.dagNumber || "")}` : `Dag: ${parcel.dagNumber}`} • {parcel.khatianNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isBangla ? "বর্তমান মালিক:" : "Owner:"}</span>
                      <span className="font-medium text-slate-800 truncate max-w-[150px]">
                        {parcel.currentOwner}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isBangla ? "জমির পরিমাণ:" : "Area:"}</span>
                      <span className="font-semibold text-teal-700">
                        {formatLandArea(parcel.totalArea)}
                      </span>
                    </div>
                  </div>

                  {/* Anomalies Preview */}
                  <div className="pt-3 border-t border-slate-100 min-h-[50px]">
                    {hasAnomalies ? (
                      <div className="flex flex-wrap gap-1">
                        {audit.anomalies.map((a, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200"
                          >
                            {getAnomalyLabel(a.anomalyType)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isBangla ? "কোনো স্বত্ব অসংগতি নেই (ক্লিন)" : "Zero Contradictions (Clean)"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Link
                    href={`/verify/${parcel.parcelNumber}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <span>{isBangla ? "পূর্ণাঙ্গ স্বত্ব-শৃঙ্খল দেখুন" : "Analyze Chain of Title"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
