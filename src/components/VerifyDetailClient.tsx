"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  FileText,
  Printer,
  Calendar,
  Scale,
  Split,
  Layers,
  Clock,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { Parcel } from "@/lib/parcels";
import { AuditResult } from "@/lib/detection-engine";

interface Props {
  parcel: Parcel;
  audit: AuditResult;
}

export default function VerifyDetailClient({ parcel, audit }: Props) {
  const {
    isBangla,
    formatNum,
    formatLandArea,
    formatRiskScore,
    formatDt,
    getSeverityText,
    getRecommendedStep,
  } = useLanguage();

  const isClean = audit.riskLevel === "CLEAN" && audit.anomalies.length === 0;

  // The 5 canonical P3 rules
  const ruleKeys = [
    {
      key: "DOUBLE_SELLING",
      titleBn: "দ্বৈত বিক্রয় (Double Selling)",
      titleEn: "Double Selling Detection",
      icon: Split,
    },
    {
      key: "CHAIN_BREAK",
      titleBn: "স্বত্ব ধারাবাহিকতা বিচ্ছিন্ন (Chain Break)",
      titleEn: "Chain-of-Title Provenance",
      icon: Layers,
    },
    {
      key: "AREA_MISMATCH",
      titleBn: "খতিয়ান পরিমাপ অসঙ্গতি (Area Mismatch)",
      titleEn: "Cadastral Area Boundary",
      icon: Scale,
    },
    {
      key: "DEED_MUTATION_MISMATCH",
      titleBn: "দলিল ও নামজারি অমিল (Mutation Mismatch)",
      titleEn: "Deed vs. Mutation Inconsistency",
      icon: FileSpreadsheet,
    },
    {
      key: "TIMING_ANOMALY",
      titleBn: "সময়ানুক্রমিক অসঙ্গতি (Timing Anomaly)",
      titleEn: "Transfer Timing & Velocity",
      icon: Clock,
    },
  ];

  // Cadastral Surveys Mockup Data derived from parcel
  const surveyHistory = [
    {
      survey: "CS (Cadastral Survey)",
      year: "1956",
      khatian: parcel.khatianNumber.includes("CS") ? parcel.khatianNumber : `KH-4029-CS`,
      dag: parcel.dagNumber || "402",
      area: parcel.totalArea,
      statusBn: "স্টেট একুইজিশন মূল রেকর্ড",
      statusEn: "State Acquisition Root Record",
    },
    {
      survey: "SA (State Acquisition)",
      year: "1962",
      khatian: `SA-${parcel.khatianNumber.replace(/[^0-9]/g, "") || "4029"}`,
      dag: parcel.dagNumber || "402",
      area: parcel.totalArea,
      statusBn: "প্রজাস্বত্ব জরিপ খতিয়ান",
      statusEn: "Tenancy Record of Rights",
    },
    {
      survey: "RS (Revisional Survey)",
      year: "1988",
      khatian: `RS-${parcel.khatianNumber.replace(/[^0-9]/g, "") || "4029"}`,
      dag: parcel.dagNumber || "402",
      area: parcel.totalArea,
      statusBn: "সংশোধিত জরিপ বালাম",
      statusEn: "Revisional Field Book",
    },
    {
      survey: "BS / City Survey",
      year: "2012",
      khatian: `BS-${parcel.khatianNumber.replace(/[^0-9]/g, "") || "4029"}`,
      dag: parcel.dagNumber || "402",
      area: parcel.totalArea,
      statusBn: "ডিজিটাল নামজারি রেফারেন্স",
      statusEn: "Digital Mutation Reference",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Back button and quick actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/verify"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBangla ? "রেকর্ড অনুসন্ধানে ফিরে যান" : "Back to Record Search"}</span>
        </Link>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href={`/investigations/${parcel.id}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>{isBangla ? "পূর্ণাঙ্গ তদন্ত ফাইল" : "Investigation Dossier"}</span>
          </Link>

          <Link
            href={`/reports/${parcel.id}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{isBangla ? "রিপোর্ট মুদ্রণ" : "Print Report"}</span>
          </Link>
        </div>
      </div>

      {/* Main Parcel Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                {parcel.parcelNumber}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                {parcel.surveyType || "CS"} {isBangla ? "জরিপ" : "Survey"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {parcel.mouza}, {parcel.upazila}, {parcel.district} • {parcel.provenance || "State Acquisition Record"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">
                {isBangla ? "স্বত্ব নিরাপত্তা স্কোর" : "Integrity Score"}
              </span>
              <span
                className={`text-xl sm:text-2xl font-black font-mono ${
                  audit.riskScore >= 80
                    ? "text-emerald-600"
                    : audit.riskScore >= 50
                    ? "text-amber-600"
                    : "text-rose-600"
                }`}
              >
                {formatRiskScore(audit.riskScore)}
              </span>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                audit.riskScore >= 80 ? "bg-emerald-600" : audit.riskScore >= 50 ? "bg-amber-600" : "bg-rose-600"
              }`}
            >
              {audit.riskScore >= 80 ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>

        {/* Particulars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px] mb-1">
              {isBangla ? "দাগ নম্বর" : "Dag Number"}
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {isBangla ? formatNum(parcel.dagNumber || "৪০২") : parcel.dagNumber || "402"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px] mb-1">
              {isBangla ? "খতিয়ান নম্বর" : "Khatian Number"}
            </span>
            <span className="font-bold text-slate-800 text-sm font-mono">
              {parcel.khatianNumber}
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

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px] mb-1">
              {isBangla ? "বর্তমান রেকর্ডীয় মালিক" : "Current Owner"}
            </span>
            <span className="font-bold text-slate-800 text-sm truncate block">
              {parcel.currentOwner}
            </span>
          </div>
        </div>

        {/* Integrity Notice Banner */}
        <div
          className={`p-4 rounded-xl text-xs space-y-1 border ${
            isClean
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
              : "bg-rose-50/80 border-rose-200 text-rose-950"
          }`}
        >
          <div className="font-bold flex items-center gap-2">
            {isClean ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>
              {isClean
                ? isBangla
                  ? "স্বত্ব বিশ্লেষণ: সকল দলিল ও খতিয়ান সামঞ্জস্যপূর্ণ (Clean Title)"
                  : "Audit Result: Title is clean and unencumbered"
                : isBangla
                ? `স্বত্ব বিশ্লেষণ: ${formatNum(audit.anomalies.length)} টি আইনি অসঙ্গতি শনাক্ত হয়েছে (Flagged)`
                : `Audit Result: ${audit.anomalies.length} contradiction(s) flagged`}
            </span>
          </div>
          <p className="text-[11px] opacity-90 leading-relaxed">
            {isBangla
              ? "আইনি তথ্য: এই ফলাফলটি ল্যান্ডট্রেসের সিদ্ধান্ত-সহায়ক ইঞ্জিন দ্বারা স্বয়ংক্রিয়ভাবে তৈরি। এটি সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের জন্য প্রাথমিক সতর্কবার্তা এবং আদালতের বিচারিক রায় হিসেবে গণ্য নয়।"
              : "Decision Support Notice: This automated analysis assists AC (Land) and Sub-Registrars. It does not constitute a judicial court verdict."}
          </p>
        </div>
      </div>

      {/* 5 Detection Rules Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {isBangla ? "৫টি পি৩ স্বয়ংক্রিয় সনাক্তকরণ ফলাফল" : "Five P3 Fraud Detection Engine Results"}
          </h2>
          <p className="text-xs text-slate-500">
            {isBangla
              ? "এই নির্দিষ্ট প্লটটিতে প্রতিটি অ্যালগরিদমের কার্যকারিতা ও ফলাফল"
              : "Individual rule compliance and detection findings on this parcel"}
          </p>
        </div>

        <div className="space-y-3">
          {ruleKeys.map((rule) => {
            const Icon = rule.icon;
            const anomaly = audit.anomalies.find((a) => a.anomalyType === rule.key);
            const passed = !anomaly;

            return (
              <div
                key={rule.key}
                className={`p-4 rounded-xl border transition-all ${
                  passed
                    ? "bg-slate-50/70 border-slate-200"
                    : "bg-rose-50/50 border-rose-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        passed ? "bg-slate-200 text-slate-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                        {isBangla ? rule.titleBn : rule.titleEn}
                      </h3>
                      {anomaly && (
                        <p className="text-xs text-rose-800 mt-0.5">
                          {isBangla ? anomaly.descriptionBn : anomaly.descriptionEn}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    {passed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isBangla ? "পাস (কোনো অমিল নেই)" : "Passed (Clean)"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>
                          {isBangla
                            ? `${getSeverityText(anomaly.severity)} ঝুঁকি`
                            : `${anomaly.severity} Risk`}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {anomaly && (
                  <div className="mt-3 pt-3 border-t border-rose-100 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="text-rose-900 font-medium">
                      <strong>{isBangla ? "সুপারিশ:" : "Recommendation:"}</strong>{" "}
                      {getRecommendedStep(anomaly.anomalyType)}
                    </span>
                    <Link
                      href={`/investigations/${parcel.id}`}
                      className="text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1 shrink-0"
                    >
                      <span>{isBangla ? "তথ্যপ্রমাণ দেখুন" : "View Evidence"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cadastral Survey Chronology Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {isBangla ? "ক্যাডাস্ট্রাল জরিপ ইতিহাস (CS / SA / RS / BS)" : "Cadastral Survey Chronology"}
          </h2>
          <p className="text-xs text-slate-500">
            {isBangla
              ? "১৯৫৬ সালের সিএস মূল জরিপ হতে শুরু করে আধুনিক সিটি সার্ভে পর্যন্ত রেকর্ড সমন্বয়"
              : "Reconciled survey records from 1956 CS Cadastral Survey to modern City Survey"}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">{isBangla ? "জরিপের নাম" : "Survey Name"}</th>
                <th className="px-4 py-3">{isBangla ? "সম্পাদন বছর" : "Survey Year"}</th>
                <th className="px-4 py-3">{isBangla ? "খতিয়ান নম্বর" : "Khatian No."}</th>
                <th className="px-4 py-3">{isBangla ? "দাগ নম্বর" : "Dag No."}</th>
                <th className="px-4 py-3">{isBangla ? "নথিভুক্ত জমি" : "Acreage"}</th>
                <th className="px-4 py-3">{isBangla ? "নথির ধরন" : "Survey Designation"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {surveyHistory.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="px-4 py-2.5 font-bold text-slate-900">{s.survey}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-600">
                    {isBangla ? formatNum(s.year) : s.year}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-700">{s.khatian}</td>
                  <td className="px-4 py-2.5 font-bold text-slate-800">
                    {isBangla ? formatNum(s.dag) : s.dag}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-teal-700">
                    {formatLandArea(s.area)}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {isBangla ? s.statusBn : s.statusEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chronological Deed and Mutation Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {isBangla ? "দলিল ও নামজারি হস্তান্তরের সময়রেখা" : "Deed & Mutation Ownership-Chain Timeline"}
          </h2>
          <p className="text-xs text-slate-500">
            {isBangla
              ? "সাব-রেজিস্ট্রি দলিলের সাথে সহকারী কমিশনার (ভূমি) খারিজ খতিয়ানের সময়ানুক্রমিক যোগসূত্র"
              : "Chronological sequence linking registered Sub-Registry deeds with AC (Land) mutation orders"}
          </p>
        </div>

        <div className="space-y-4">
          {parcel.deeds && parcel.deeds.length > 0 ? (
            parcel.deeds.map((deed, idx) => {
              const matchedMutation = parcel.mutations?.find(
                (m) => m.applicantName === deed.buyerName || m.dagNumber === deed.dagNumber
              );

              return (
                <div
                  key={deed.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center font-mono">
                        {isBangla ? formatNum(idx + 1) : idx + 1}
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                        {deed.deedNumber}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {deed.deedType}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDt(deed.deedDate)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        {isBangla ? "বিক্রেতা (Grantor)" : "Seller"}
                      </span>
                      <span className="font-bold text-slate-800">{deed.sellerName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        {isBangla ? "ক্রেতা (Grantee)" : "Buyer"}
                      </span>
                      <span className="font-bold text-slate-800">{deed.buyerName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        {isBangla ? "হস্তান্তরিত জমি ও অফিস" : "Transferred Area & Registry"}
                      </span>
                      <span className="font-semibold text-teal-700">
                        {formatLandArea(deed.transferredArea)}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {deed.registrationOffice}
                      </span>
                    </div>
                  </div>

                  {/* Matched AC Land Mutation status */}
                  {matchedMutation ? (
                    <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="font-bold text-teal-800">
                          {isBangla ? "অনুমোদিত নামজারি কেস:" : "Mutation Case:"}{" "}
                        </span>
                        <span className="font-mono font-semibold">{matchedMutation.caseNumber}</span> •{" "}
                        {formatLandArea(matchedMutation.mutatedArea)} • {matchedMutation.officerName}
                      </div>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isBangla ? "এসি ল্যান্ড অনুমোদিত" : "Sanctioned"}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-amber-800 bg-amber-50/50 p-2 rounded-lg">
                      {isBangla
                        ? "এই দলিলের বিপরীতে এখনো কোনো স্বতন্ত্র নামজারি নথিভুক্ত হয়নি।"
                        : "No corresponding mutation case sanctioned yet for this deed."}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">
              {isBangla ? "কোনো দলিলের রেকর্ড পাওয়া যায়নি।" : "No registered deed records."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
