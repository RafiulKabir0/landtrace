"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Building2,
  Send,
  Code,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { Parcel } from "@/lib/parcels";
import { AuditResult } from "@/lib/detection-engine";

interface Props {
  parcel: Parcel;
  audit: AuditResult;
  currentUser?: {
    id: string;
    name: string;
    role: string;
    designation?: string;
  } | null;
}

export default function InvestigationClient({ parcel, audit, currentUser }: Props) {
  const {
    isBangla,
    formatNum,
    formatLandArea,
    formatRiskScore,
    getSeverityText,
    getRecommendedStep,
  } = useLanguage();

  const isOfficerOrAdmin =
    currentUser && (currentUser.role === "OFFICIAL" || currentUser.role === "ADMIN");

  // Officer action form state
  const [actionType, setActionType] = useState("NOTICE_HEARING");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setIsSubmitting(true);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch("/api/officer/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: parcel.id,
          parcelNumber: parcel.parcelNumber,
          actionType,
          details,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setActionError(data.error || (isBangla ? "পদক্ষেপ সংরক্ষণ ব্যর্থ হয়েছে।" : "Failed to record action."));
      } else {
        setActionSuccess(
          isBangla
            ? data.messageBn || "পদক্ষেপটি সফলভাবে সিস্টেমে রেকর্ড করা হয়েছে।"
            : data.messageEn || "Action recorded successfully."
        );
        setDetails("");
      }
    } catch {
      setActionError(isBangla ? "সার্ভার সংযোগ ত্রুটি।" : "Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href={`/verify/${parcel.parcelNumber}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBangla ? "রেকর্ড বিশ্লেষণে ফিরে যান" : "Back to Title Analysis"}</span>
        </Link>

        <Link
          href={`/reports/${parcel.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>{isBangla ? "অডিট রিপোর্ট প্রিন্ট করুন" : "Print Official Report"}</span>
        </Link>
      </div>

      {/* Case Header Dossier Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                {isBangla ? "তদন্ত কেস ফাইল" : "Investigation Case File"}
              </span>
              <span className="font-mono text-xs text-slate-400">
                REF: INV-{parcel.parcelNumber}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {parcel.parcelNumber} — {isBangla ? "স্বত্ব বিরোধ ও তথ্যপ্রমাণ ফাইল" : "Forensic Evidence Dossier"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {parcel.mouza}, {parcel.upazila}, {parcel.district} • {parcel.currentOwner}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">
              {isBangla ? "ঝুঁকি স্কোর" : "Integrity Metric"}
            </span>
            <span
              className={`text-2xl font-black font-mono ${
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] mb-0.5">{isBangla ? "দাগ" : "Dag"}</span>
            <span className="font-bold text-slate-800">
              {isBangla ? formatNum(parcel.dagNumber || "৪০২") : parcel.dagNumber || "402"}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] mb-0.5">{isBangla ? "খতিয়ান" : "Khatian"}</span>
            <span className="font-bold text-slate-800 font-mono">{parcel.khatianNumber}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] mb-0.5">{isBangla ? "পরিমাপ" : "Area"}</span>
            <span className="font-bold text-teal-700">{formatLandArea(parcel.totalArea)}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] mb-0.5">{isBangla ? "মোট দলিল" : "Total Deeds"}</span>
            <span className="font-bold text-slate-800">{formatNum(parcel.deeds?.length || 0)}</span>
          </div>
        </div>
      </div>

      {/* Contradictions & Evidence Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>
              {isBangla
                ? `শনাক্তকৃত অসঙ্গতি ও তথ্যপ্রমাণ (${formatNum(audit.anomalies.length)} টি)`
                : `Detected Contradictions & Evidence (${audit.anomalies.length})`}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBangla
              ? "সাব-রেজিস্ট্রি দলিল ও নামজারি রেকর্ডের মধ্যকার সুস্পষ্ট গাণিতিক ও আইনি অমিল"
              : "Definite legal and arithmetic contradictions between conveyance deeds and mutation orders"}
          </p>
        </div>

        {audit.anomalies.length > 0 ? (
          <div className="space-y-6">
            {audit.anomalies.map((anomaly, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-200/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-rose-700 text-white text-xs font-bold flex items-center justify-center font-mono">
                      {isBangla ? formatNum(idx + 1) : idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-rose-950">
                      {isBangla ? anomaly.titleBn : anomaly.titleEn}
                    </h3>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 w-fit">
                    {isBangla ? `${getSeverityText(anomaly.severity)} তীব্রতা` : `${anomaly.severity} Severity`}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {isBangla ? anomaly.descriptionBn : anomaly.descriptionEn}
                </p>

                {/* Evidence JSON inspector */}
                {anomaly.evidence && Object.keys(anomaly.evidence).length > 0 && (
                  <div className="rounded-xl bg-slate-900 p-4 text-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-teal-400" />
                        <span>{isBangla ? "ফরেনসিক তথ্যপ্রমাণ (Structured Evidence):" : "Forensic Evidence Data:"}</span>
                      </span>
                      <span>JSON Record</span>
                    </div>
                    <pre className="text-[11px] font-mono overflow-x-auto text-teal-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      {JSON.stringify(anomaly.evidence, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Statutory Recommendation */}
                <div className="p-3 rounded-lg bg-white border border-rose-200 text-xs text-slate-800 space-y-1">
                  <span className="font-bold text-rose-900 block">
                    {isBangla ? "সহকারী কমিশনার (ভূমি)-এর করণীয় সুপারিশ:" : "Administrative Recommendation for AC (Land):"}
                  </span>
                  <p className="text-slate-600">
                    {getRecommendedStep(anomaly.anomalyType)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm">
              {isBangla ? "কোনো বিরোধ বা অসঙ্গতি পাওয়া যায়নি" : "Zero Legal Contradictions Detected"}
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              {isBangla
                ? "এই প্লটের সকল হস্তান্তরিত দলিল ও অনুমোদিত নামজারি সম্পূর্ণ সামঞ্জস্যপূর্ণ। কোনো প্রশাসনিক স্থগিতাদেশের প্রয়োজন নেই।"
                : "All conveyance deeds and mutation orders on this parcel are completely reconciled. No administrative hold required."}
            </p>
          </div>
        )}
      </div>

      {/* Supported Review Actions Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            <span>{isBangla ? "প্রশাসনিক পর্যালোচনা ও সিদ্ধান্ত পদক্ষেপ" : "Administrative Review & Action Panel"}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBangla
              ? "সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের জন্য তদন্ত সিদ্ধান্ত রেকর্ডিং ব্যবস্থা"
              : "Official decision-support recording mechanism for AC (Land) & Sub-Registrars"}
          </p>
        </div>

        {isOfficerOrAdmin ? (
          <form onSubmit={handleActionSubmit} className="space-y-4">
            {actionSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isBangla ? "পদক্ষেপের ধরন নির্বাচন করুন" : "Select Review Action Type"}
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                <option value="NOTICE_HEARING">
                  {isBangla ? "১. উভয় পক্ষকে শুনানির নোটিশ জারি করুন (Issue Hearing Notice)" : "Issue Hearing Notice to Both Parties"}
                </option>
                <option value="FREEZE_MUTATION">
                  {isBangla ? "২. নামজারি কার্যক্রম সাময়িক স্থগিত রাখুন (Freeze Land Mutation)" : "Freeze Land Mutation Proceedings"}
                </option>
                <option value="REQUEST_ADDITIONAL_PROOF">
                  {isBangla ? "৩. মূল বালাম ও পিঠদলিল তলব করুন (Request Additional Proof)" : "Request Volume Register & Link Deeds"}
                </option>
                <option value="APPROVE_RECORD">
                  {isBangla ? "৪. রেকর্ড নিষ্কন্টক ঘোষণা ও অনুমোদন (Approve and Clear Title)" : "Approve and Clear Title Record"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isBangla ? "কর্মকর্তার পর্যবেক্ষণ ও তদন্ত নোট" : "Officer Observation & Docket Notes"}
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  isBangla
                    ? "কেস নথিতে অন্তর্ভুক্তির জন্য সিদ্ধান্তের কারণ ও পরবর্তী পদক্ষেপ লিখুন..."
                    : "Enter administrative notes and rationale for case docket..."
                }
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? isBangla
                      ? "রেকর্ড হচ্ছে..."
                      : "Recording..."
                    : isBangla
                    ? "পদক্ষেপ সংরক্ষণ করুন"
                    : "Record Official Action"}
                </span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" />
              <span>{isBangla ? "সংরক্ষিত প্রাতিষ্ঠানিক কার্যক্রম" : "Restricted Administrative Function"}</span>
            </div>
            <p>
              {isBangla
                ? "শুনানির নোটিশ জারি বা নামজারি স্থগিতকরণের মতো প্রশাসনিক পদক্ষেপ শুধুমাত্র অনুমোদিত সহকারী কমিশনার (ভূমি) এবং সাব-রেজিস্ট্রারগণ লগইন করার পর গ্রহণ করতে পারবেন।"
                : "Official review actions such as issuing hearing notices or freezing mutations are restricted to authenticated Assistant Commissioners (Land) and Sub-Registrars."}
            </p>
            <div className="pt-2">
              <Link
                href="/login/official"
                className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-semibold"
              >
                <span>{isBangla ? "ভূমি কর্মকর্তা হিসেবে লগইন করুন" : "Sign in as Land Official"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
