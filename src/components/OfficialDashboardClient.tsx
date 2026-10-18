"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { Parcel } from "@/lib/parcels";
import { AuditResult } from "@/lib/detection-engine";

interface Props {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    designation?: string;
  };
  parcels: Parcel[];
  audits: Record<string, AuditResult>;
}

export default function OfficialDashboardClient({ user, parcels, audits }: Props) {
  const { isBangla, formatNum, formatLandArea, formatRiskScore, getAnomalyLabel } =
    useLanguage();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "FLAGGED" | "ACTIVE">("ALL");
  const [districtFilter, setDistrictFilter] = useState("ALL");

  // Calculate live database-backed metrics
  const metrics = useMemo(() => {
    const total = parcels.length;
    let clean = 0;
    let flagged = 0;
    let totalScore = 0;

    parcels.forEach((p) => {
      const audit = audits[p.parcelNumber] || audits[p.id];
      if (audit && audit.riskLevel === "CLEAN" && audit.anomalies.length === 0) {
        clean++;
      } else {
        flagged++;
      }
      totalScore += audit ? audit.riskScore : 100;
    });

    const avgScore = total > 0 ? Math.round(totalScore / total) : 0;
    return { total, clean, flagged, avgScore };
  }, [parcels, audits]);

  // Unique districts for filter
  const districts = useMemo(() => {
    const set = new Set<string>();
    parcels.forEach((p) => {
      if (p.district) set.add(p.district);
    });
    return Array.from(set);
  }, [parcels]);

  // Filtered parcels
  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      const audit = audits[p.parcelNumber] || audits[p.id];
      const isFlagged = audit && audit.anomalies.length > 0;

      if (statusFilter === "FLAGGED" && !isFlagged) return false;
      if (statusFilter === "ACTIVE" && isFlagged) return false;
      if (districtFilter !== "ALL" && p.district !== districtFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match =
          p.parcelNumber.toLowerCase().includes(q) ||
          (p.dagNumber && p.dagNumber.toLowerCase().includes(q)) ||
          p.khatianNumber.toLowerCase().includes(q) ||
          p.mouza.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.currentOwner.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [parcels, audits, statusFilter, districtFilter, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Official Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {user.name}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                {isBangla ? "ভূমি কর্মকর্তা ড্যাশবোর্ড" : "Land Official Workspace"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {user.designation || (isBangla ? "সহকারী কমিশনার (ভূমি) / সাব-রেজিস্ট্রার" : "AC Land / Sub-Registrar")} • {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{isBangla ? "রেকর্ড যাচাই পোর্টাল" : "Verify Any Record"}</span>
          </Link>
        </div>
      </div>

      {/* Database-Backed Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">
            {isBangla ? "মোট রেজিস্ট্রি রেকর্ড" : "Total Registry Parcels"}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {formatNum(metrics.total)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isBangla ? "সার্ভার ডাটাবেজ হতে নিরীক্ষিত" : "Live Neon DB Records"}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-emerald-700 font-medium block mb-1">
            {isBangla ? "বৈধ ও অপ্রতিদ্বন্দ্বী রেকর্ড" : "Clean Verified Titles"}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
            {formatNum(metrics.clean)}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">
            {isBangla ? "০টি অসঙ্গতি নিশ্চিত" : "Zero Contradictions"}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-rose-700 font-medium block mb-1">
            {isBangla ? "ফ্ল্যাগড / অমিল সনাক্তকৃত" : "Flagged Contradictions"}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
            {formatNum(metrics.flagged)}
          </div>
          <span className="text-[11px] text-rose-600/80 mt-1 block">
            {isBangla ? "শুনানি ও তদন্ত প্রয়োজন" : "Requires Administrative Review"}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-teal-700 font-medium block mb-1">
            {isBangla ? "গড় নিরাপত্তা স্কোর" : "Avg Registry Integrity"}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono">
            {formatRiskScore(metrics.avgScore)}
          </div>
          <span className="text-[11px] text-teal-600/80 mt-1 block">
            {isBangla ? "পি৩ অ্যালগরিদম দ্বারা গণনাকৃত" : "P3 Algorithmic Metric"}
          </span>
        </div>
      </div>

      {/* Registry Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isBangla
                  ? "প্লট, দাগ, খতিয়ান, মৌজা, জেলা বা মালিকের নামে খুঁজুন..."
                  : "Search plot, dag, khatian, mouza, district or owner..."
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | "FLAGGED" | "ACTIVE")
              }
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="ALL">{isBangla ? "সকল স্থিতি" : "All Status"}</option>
              <option value="FLAGGED">{isBangla ? "শুধুমাত্র ফ্ল্যাগড (অমিল)" : "Flagged Only"}</option>
              <option value="ACTIVE">{isBangla ? "শুধুমাত্র বৈধ (ক্লিন)" : "Clean Only"}</option>
            </select>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="ALL">{isBangla ? "সকল জেলা" : "All Districts"}</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parcels Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">{isBangla ? "প্লট নম্বর ও জরিপ" : "Plot & Survey"}</th>
                <th className="px-4 py-3">{isBangla ? "দাগ ও খতিয়ান" : "Dag & Khatian"}</th>
                <th className="px-4 py-3">{isBangla ? "মৌজা ও জেলা" : "Location"}</th>
                <th className="px-4 py-3">{isBangla ? "বর্তমান মালিক ও পরিমাপ" : "Owner & Area"}</th>
                <th className="px-4 py-3">{isBangla ? "ঝুঁকি স্থিতি ও স্কোর" : "Risk & Score"}</th>
                <th className="px-4 py-3">{isBangla ? "অসঙ্গতিসমূহ" : "Detected Anomalies"}</th>
                <th className="px-4 py-3 text-right">{isBangla ? "পদক্ষেপ" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map((parcel) => {
                const audit = audits[parcel.parcelNumber] || audits[parcel.id];
                const score = audit ? audit.riskScore : 100;
                const hasAnomalies = audit && audit.anomalies.length > 0;

                return (
                  <tr key={parcel.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-slate-900">
                        {parcel.parcelNumber}
                      </div>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                        {parcel.surveyType || "CS"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">
                        {isBangla ? `দাগ: ${formatNum(parcel.dagNumber || "")}` : `Dag: ${parcel.dagNumber}`}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {parcel.khatianNumber}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{parcel.mouza}</div>
                      <div className="text-[11px] text-slate-500">{parcel.district}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{parcel.currentOwner}</div>
                      <div className="text-[11px] text-teal-700 font-semibold">
                        {formatLandArea(parcel.totalArea)}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] border ${
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
                    </td>

                    <td className="px-4 py-3">
                      {hasAnomalies ? (
                        <div className="space-y-1">
                          {audit.anomalies.slice(0, 2).map((a, i) => (
                            <span
                              key={i}
                              className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 mr-1"
                            >
                              {getAnomalyLabel(a.anomalyType)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isBangla ? "কোনো অসঙ্গতি নেই" : "Clear Title"}</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/verify/${parcel.parcelNumber}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                        >
                          {isBangla ? "যাচাই" : "Verify"}
                        </Link>
                        <Link
                          href={`/investigations/${parcel.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-[11px] transition-colors"
                        >
                          {isBangla ? "তদন্ত ফাইল" : "Investigation"}
                        </Link>
                        <Link
                          href={`/reports/${parcel.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] transition-colors"
                        >
                          {isBangla ? "রিপোর্ট" : "Report"}
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
