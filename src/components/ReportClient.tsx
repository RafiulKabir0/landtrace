"use client";

import React from "react";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  Scale,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { Parcel } from "@/lib/parcels";
import { AuditResult } from "@/lib/detection-engine";

interface Props {
  parcel: Parcel;
  audit: AuditResult;
}

export default function ReportClient({ parcel, audit }: Props) {
  const {
    isBangla,
    formatNum,
    formatLandArea,
    formatRiskScore,
    formatDt,
    formatTm,
    getRecommendedStep,
  } = useLanguage();

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const currentDate = new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Top Controls Bar (Hidden during printing) */}
      <div className="no-print flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <Link
          href={`/investigations/${parcel.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBangla ? "তদন্ত ফাইলে ফিরে যান" : "Back to Investigation File"}</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{isBangla ? "প্রতিবেদন প্রিন্ট / পিডিএফ সংরক্ষণ" : "Print / Save PDF"}</span>
        </button>
      </div>

      {/* Printable Report Document (A4 Styling) */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm space-y-8 text-slate-900 print:border-none print:shadow-none print:p-0">
        {/* Government Style Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1.5">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg mb-2">
            <Scale className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
            {isBangla
              ? "ল্যান্ডটেক ২০২৬ পাইলট প্রকল্প • ল্যান্ডট্রেস (টিম: LA-73)"
              : "LandTech 2026 Pilot Prototype • LandTrace (Team: LA-73)"}
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isBangla
              ? "ভূমি রেকর্ড অডিট ও ফরেনসিক সিদ্ধান্ত সহায়তা প্রতিবেদন"
              : "Land Record Forensic Audit & Decision-Support Report"}
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            DOCKET NO: LT-2026-{parcel.parcelNumber} • {formatDt(currentDate)} {formatTm(currentDate)}
          </p>
        </div>

        {/* Parcel Cadastral Particulars */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1.5 rounded">
            {isBangla ? "১. জমির সাধারণ পরিচিতি ও খতিয়ান বিবরণ" : "1. Cadastral Particulars & Identifiers"}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border border-slate-200 p-4 rounded-xl">
            <div>
              <span className="text-slate-400 block text-[10px]">{isBangla ? "প্লট নম্বর" : "Plot No."}</span>
              <span className="font-mono font-bold text-slate-900">{parcel.parcelNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">{isBangla ? "দাগ ও খতিয়ান" : "Dag & Khatian"}</span>
              <span className="font-bold text-slate-800">
                {isBangla ? `দাগ: ${formatNum(parcel.dagNumber || "")}` : `Dag: ${parcel.dagNumber}`} • {parcel.khatianNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">{isBangla ? "মৌজা ও জেলা" : "Mouza & District"}</span>
              <span className="font-bold text-slate-800">{parcel.mouza}, {parcel.district}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">{isBangla ? "রেকর্ডীয় পরিমাপ" : "Recorded Area"}</span>
              <span className="font-bold text-teal-800">{formatLandArea(parcel.totalArea)}</span>
            </div>
          </div>
        </div>

        {/* Title Chain Timeline */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1.5 rounded">
            {isBangla ? "২. হস্তান্তরিত দলিলের সময়ানুক্রমিক তালিকা" : "2. Registered Conveyance Deed History"}
          </h2>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                <tr>
                  <th className="px-3 py-2">{isBangla ? "ক্রম" : "Sl"}</th>
                  <th className="px-3 py-2">{isBangla ? "দলিল নম্বর ও তারিখ" : "Deed & Date"}</th>
                  <th className="px-3 py-2">{isBangla ? "বিক্রেতা" : "Seller"}</th>
                  <th className="px-3 py-2">{isBangla ? "ক্রেতা" : "Buyer"}</th>
                  <th className="px-3 py-2">{isBangla ? "পরিমাণ" : "Area"}</th>
                  <th className="px-3 py-2">{isBangla ? "রেজিস্ট্রি অফিস" : "Office"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {parcel.deeds?.map((d, i) => (
                  <tr key={d.id} className="text-[11px]">
                    <td className="px-3 py-2 font-mono">{formatNum(i + 1)}</td>
                    <td className="px-3 py-2 font-mono font-bold">
                      {d.deedNumber}
                      <span className="block text-[10px] text-slate-500 font-normal">{formatDt(d.deedDate)}</span>
                    </td>
                    <td className="px-3 py-2">{d.sellerName}</td>
                    <td className="px-3 py-2">{d.buyerName}</td>
                    <td className="px-3 py-2 font-semibold text-teal-900">{formatLandArea(d.transferredArea)}</td>
                    <td className="px-3 py-2 text-slate-500">{d.registrationOffice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detection Engine Results */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1.5 rounded flex items-center justify-between">
            <span>{isBangla ? "৩. পি৩ ইঞ্জিন শনাক্তকৃত অসংগতি ও ঝুঁকি মূল্যায়ন" : "3. P3 Detection Findings & Contradictions"}</span>
            <span className="font-mono">
              {isBangla ? "স্কোর:" : "Score:"} {formatRiskScore(audit.riskScore)}
            </span>
          </h2>

          {audit.anomalies.length > 0 ? (
            <div className="space-y-3">
              {audit.anomalies.map((a, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-rose-300 bg-rose-50/50 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-rose-950">
                    <span>{formatNum(i + 1)}. {isBangla ? a.titleBn : a.titleEn}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-slate-700">{isBangla ? a.descriptionBn : a.descriptionEn}</p>
                  <p className="text-slate-600 text-[11px] pt-1">
                    <strong>{isBangla ? "আইনি পদক্ষেপ সুপারিশ:" : "Recommended Step:"}</strong> {getRecommendedStep(a.anomalyType)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-xs text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {isBangla
                  ? "স্বত্ব নিরীক্ষায় কোনো দ্বৈত বিক্রয়, পরিমাপ অসঙ্গতি বা ধারাবাহিকতা বিচ্যুতি ধরা পড়েনি।"
                  : "Audit confirmed zero contradictions. Title provenance and registered deeds are reconciled."}
              </span>
            </div>
          )}
        </div>

        {/* Official Certification & Signature Block */}
        <div className="pt-8 border-t-2 border-slate-200 space-y-8">
          <div className="text-[11px] text-slate-500 italic leading-relaxed">
            {isBangla
              ? "ঘোষণা: এই প্রতিবেদনটি ল্যান্ডট্রেস সিদ্ধান্ত-সহায়ক সফটওয়্যার দ্বারা সংকলিত হয়েছে। এটি কোনো আনুষ্ঠানিক বিচারিক রায় নয়। বালাম বই ও সংশ্লিষ্ট নথির সাথে যাচাই করে প্রশাসনিক ব্যবস্থা গ্রহণের সুপারিশ করা হলো।"
              : "Declaration: This dossier was compiled by LandTrace Decision-Support Engine. It does not constitute a judicial court decree. Administrative action must be corroborated with original volume registers."}
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8 text-xs text-slate-700 text-center">
            <div className="border-t border-slate-400 pt-2">
              <span className="font-bold block">{isBangla ? "সহকারী কমিশনার (ভূমি)" : "Assistant Commissioner (Land)"}</span>
              <span className="text-[10px] text-slate-500">{isBangla ? "স্বাক্ষর ও অফিশিয়াল সিল" : "Signature & Seal"}</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <span className="font-bold block">{isBangla ? "সাব-রেজিস্ট্রার" : "Sub-Registrar"}</span>
              <span className="text-[10px] text-slate-500">{isBangla ? "স্বাক্ষর ও অফিশিয়াল সিল" : "Signature & Seal"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
