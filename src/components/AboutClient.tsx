"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function AboutClient() {
  const { isBangla } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          {isBangla ? "প্রকল্প পরিচিতি ও উদ্দেশ্য" : "About LandTrace & LandTech 2026"}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isBangla ? "ল্যান্ডট্রেস প্ল্যাটফর্মের লক্ষ্য ও পটভূমি" : "LandTrace Mission, Architecture & Scope"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isBangla
            ? "বাংলাদেশ ভূমি প্রশাসন ব্যবস্থার সংস্কার ও নাগরিক আস্থা বৃদ্ধির লক্ষ্যে একটি উদ্ভাবনী সিদ্ধান্ত-সহায়ক প্রোটোটাইপ।"
            : "An innovative decision-support prototype engineered to enhance integrity and transparency in Bangladesh land administration."}
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>{isBangla ? "ল্যান্ডটেক ২০২৬ ও সমস্যা ৩ (P3)" : "LandTech 2026 & Problem Statement P3"}</span>
            </h2>
            <span className="text-xs bg-teal-50 text-teal-800 font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
              Team ID: LA-73
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {isBangla
              ? "ল্যান্ডটেক ২০২৬ (LandTech 2026) জাতীয় উদ্ভাবনী প্রতিযোগিতার সমস্যা ৩ (Fraud & Double-Selling Detection)-এর অধীনে এই সফটওয়্যারটির স্থাপত্য প্রণয়ন করা হয়েছে। বাংলাদেশে সাব-রেজিস্ট্রেশন এবং সহকারী কমিশনার (ভূমি) অফিসের রেকর্ড পৃথকভাবে পরিচালিত হওয়ার কারণে অসাধু ব্যক্তিরা দ্বৈত বিক্রয়, মধ্যবর্তী দলিলবিহীন হস্তান্তর বা ভুয়া নামজারি করার সুযোগ গ্রহণ করত। ল্যান্ডট্রেস এই দুই দপ্তর ও ঐতিহাসিক জরিপ নথির মাঝে একটি বুদ্ধিবৃত্তিক সেতুবন্ধন তৈরি করে।"
              : "LandTrace was engineered for LandTech 2026 Problem Statement P3: Fraud & Double-Selling Detection. In Bangladesh, historical separation between the Directorate of Registration and Assistant Commissioner (Land) field offices created systemic vulnerabilities for double-selling and forged link deeds. LandTrace provides an intelligent reconciliation engine bridging these silos."}
          </p>
        </div>

        {/* Technical Architecture */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-600" />
            <span>{isBangla ? "প্রযুক্তিগত স্থাপত্য ও ভিত্তি" : "Technical Architecture"}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Frontend & Fullstack</span>
              <p className="text-slate-600">Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Turbopack.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Database & ORM</span>
              <p className="text-slate-600">Prisma 6 ORM, Neon Serverless PostgreSQL with deterministic synthetic seeding.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Security & Detection</span>
              <p className="text-slate-600">HMAC-SHA256 session tokens, bcrypt passwords, deterministic 5-rule audit engine.</p>
            </div>
          </div>
        </div>

        {/* Scope and Strict Limitations */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{isBangla ? "প্রকল্পের স্পষ্ট সীমাবদ্ধতা ও অস্বীকৃতি" : "Project Scope & Clear Disclaimers"}</span>
          </h3>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
            <p className="leading-relaxed">
              <strong>১. প্রোটোটাইপ ঘোষণা:</strong> ল্যান্ডট্রেস একটি গবেষণা ও প্রতিযোগিতা প্রোটোটাইপ। এটি বাংলাদেশ সরকারের ভূমি মন্ত্রণালয় কর্তৃক সরাসরি অনুমোদিত বা সরকারি উৎপাদনশীল ডাটাবেজের সাথে সরাসরি সংযুক্ত কোনো সিস্টেম নয়।
            </p>
            <p className="leading-relaxed">
              <strong>২. সিন্থেটিক উপাত্ত:</strong> সিস্টেমে সংরক্ষিত সকল দলিল, খতিয়ান, মালিকদের নাম এবং ফোন নম্বর কাল্পনিক/সিন্থেটিক ডেটা। বাস্তব কোনো ব্যক্তির ব্যক্তিগত উপাত্ত বা সরকারি সংবেদনশীল নথি এতে অন্তর্ভুক্ত নয়।
            </p>
            <p className="leading-relaxed">
              <strong>৩. বিচারিক বাধ্যবাধকতা নয়:</strong> এই সিস্টেমের প্রদত্ত স্কোর এবং অসংগতি সতর্কবার্তা শুধুমাত্র প্রশাসনিক সিদ্ধান্ত ও প্রাথমিক নিরীক্ষায় সহায়তা করে। এটি দেওয়ানি বা রাজস্ব আদালতের বিচারিক রায়ের সমতুল্য নয়।
            </p>
          </div>
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-teal-50 border border-teal-200">
        <div>
          <h3 className="text-sm font-bold text-teal-950">
            {isBangla ? "পরীক্ষামূলক যাচাইকরণ শুরু করতে চান?" : "Ready to Explore the Verification Engine?"}
          </h3>
          <p className="text-xs text-teal-800 mt-0.5">
            {isBangla
              ? "সরাসরি যাচাইকরণ পোর্টালে গিয়ে ৭টি ডেমো রেকর্ড বিশ্লেষণ করুন।"
              : "Inspect the 7 synthetic test parcels in the live verification portal."}
          </p>
        </div>
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <span>{isBangla ? "রেকর্ড যাচাই করুন" : "Open Verification"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
