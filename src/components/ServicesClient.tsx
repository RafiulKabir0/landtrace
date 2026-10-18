"use client";

import React from "react";
import Link from "next/link";
import {
  Split,
  Layers,
  Scale,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
  ArrowRight,
  Search,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function ServicesClient() {
  const { isBangla } = useLanguage();

  const services = [
    {
      slug: "double-selling",
      titleBn: "দ্বৈত বিক্রয় ও অবৈধ হস্তান্তর শনাক্তকরণ",
      titleEn: "Double-Selling & Fraudulent Alienation Detection",
      ruleTag: "Rule 1 (নিয়ম ১)",
      legalRefBn: "রেজিস্ট্রেশন আইন ১৯০৮ এবং দ্য স্পেসিফিক রিলিফ অ্যাক্ট ১৮৭৭",
      legalRefEn: "The Registration Act 1908 & The Specific Relief Act 1877",
      descBn:
        "একই বিক্রেতা বৈধ মালিকানা স্বত্ব পুনঃঅধিগ্রহণ না করে একাধিক ক্রেতার নিকট বিক্রয় দলিল সম্পাদন করলে তা তৎক্ষণাৎ লাল সতর্কবার্তাসহ নথিভুক্ত করে।",
      descEn:
        "Immediately flags subsequent unlawful conveyances by the same vendor without registered reconveyance or title re-acquisition.",
      icon: Split,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      slug: "chain-of-title",
      titleBn: "সিএস/এসএ হতে স্বত্ব ধারাবাহিকতা ট্র্যাকিং",
      titleEn: "Chain-of-Title & Lineage Tracking",
      ruleTag: "Rule 2 (নিয়ম ২)",
      legalRefBn: "স্টেট একুইজিশন অ্যান্ড প্রজাস্বত্ব আইন ১৯৫০, ধারা ১৪৩",
      legalRefEn: "State Acquisition & Tenancy Act 1950, Sec 143",
      descBn:
        "সিএস ও এসএ জরিপ রেকর্ড থেকে বর্তমান মালিক পর্যন্ত হস্তান্তরের অবিচ্ছিন্ন ধারা ও কোনো মধ্যবর্তী দলিল বা ওয়ারিশান সনদ বাদ পড়েছে কি না তা যাচাই করে।",
      descEn:
        "Validates the unbroken genealogical and transactional chain from root CS/SA records to current owner, identifying missing link deeds.",
      icon: Layers,
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      slug: "cadastral-area",
      titleBn: "খতিয়ান বনাম দলিল পরিমাপ অসঙ্গতি যাচাই",
      titleEn: "Cadastral vs. Deed Area Audit",
      ruleTag: "Rule 3 (নিয়ম ৩)",
      legalRefBn: "ভূমি ব্যবস্থাপনা ম্যানুয়াল ১৯৯০ ও সার্ভে আইন",
      legalRefEn: "Land Management Manual 1990 & Survey Act",
      descBn:
        "মূল দাগ ও খতিয়ানের মোট নির্ধারিত শতাংশের চেয়ে হস্তান্তরিত বিক্রয় দলিলের মোট পরিমাণ বৃদ্ধি পেলে স্বয়ংক্রিয়ভাবে পরিমাপের অমিল চিহ্নিত করে।",
      descEn:
        "Enforces mathematical boundaries to prevent cumulative deed transfers from exceeding parent cadastral khatian acreage.",
      icon: Scale,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      slug: "deed-mutation",
      titleBn: "দলিল ও সহকারী কমিশনার (ভূমি) নামজারি সামঞ্জস্য",
      titleEn: "Deed vs. AC (Land) Mutation Consistency",
      ruleTag: "Rule 4 (নিয়ম ৪)",
      legalRefBn: "নামজারি ও জমাখারিজ নির্দেশিকা ২০১৫",
      legalRefEn: "Mutation & Record-of-Rights Guidelines 2015",
      descBn:
        "সাব-রেজিস্ট্রি অফিসের রেজিস্ট্রিকৃত বিক্রয় দলিলের জমির পরিমাণের সাথে এসি ল্যান্ড অফিসের খারিজ বা নামজারি খতিয়ানের পরিমাণের অমিল শনাক্ত করে।",
      descEn:
        "Compares registered conveyance deeds with AC (Land) sanctioned mutation records to expose discrepancies and counterfeit mutation entries.",
      icon: FileSpreadsheet,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      slug: "timing-anomaly",
      titleBn: "সময়ানুক্রমিক অসঙ্গতি ও অস্বাভাবিক দ্রুত হস্তান্তর",
      titleEn: "Transfer Timing Anomaly & Rapid Flipping",
      ruleTag: "Rule 5 (নিয়ম ৫)",
      legalRefBn: "স্ট্যাম্প আইন ১৮৯৯ এবং রেজিস্ট্রেশন বিধিমালা",
      legalRefEn: "The Stamp Act 1899 & Registration Rules",
      descBn:
        "মালিকানা স্বত্ব অর্জনের তারিখের পূর্বেই বিক্রয় দলিল সম্পাদন অথবা নামজারি ছাড়া ৭ দিনের মধ্যে অস্বাভাবিক দ্রুত হাতবদল অনুসন্ধান করে।",
      descEn:
        "Identifies anachronistic transaction dates where deeds precede title acquisition, or high-risk rapid flipping without mutation clearance.",
      icon: Clock,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      slug: "pre-registration",
      titleBn: "হস্তান্তর পূর্ববর্তী ঝুঁকি সিমুলেটর (নাগরিক)",
      titleEn: "Pre-Registration Transfer Risk Simulator",
      ruleTag: "Citizen Tool (নাগরিক টুল)",
      legalRefBn: "নাগরিক সিদ্ধান্ত ও দলিল খসড়া পূর্ব নিরীক্ষা",
      legalRefEn: "Citizen Decision Support & Draft Deed Audit",
      descBn:
        "জমি ক্রয়ের চুক্তিনামা বা বায়না করার পূর্বে প্রস্তাবিত বিক্রেতা, জমি ও পরিমাপ বসিয়ে স্বত্বে কোনো অমিমাংসিত বিরোধ আছে কি না তা পরীক্ষা করুন।",
      descEn:
        "Allows citizens to test hypothetical purchase parameters against live title records prior to registration fee submission.",
      icon: ShieldCheck,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          {isBangla ? "সার্বিক সেবা ডিরেক্টরি" : "Complete Service Directory"}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isBangla ? "ল্যান্ডট্রেস নাগরিক ও প্রাতিষ্ঠানিক সেবাসমূহ" : "LandTrace Services & Analytical Tools"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isBangla
            ? "বাংলাদেশ ভূমি প্রশাসন এবং সাব-রেজিস্ট্রেশন ব্যবস্থার জন্য প্রণীত প্রতিটি স্বতন্ত্র যাচাইকরণ সেবার বিবরণ ও আইনি ভিত্তি। প্রতিটি সেবার বিস্তারিত দেখতে কার্ডে ক্লিক করুন।"
            : "Detailed specification and statutory basis for all forensic verification tools in LandTrace. Select a card to view dedicated service information."}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.slug}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${service.badgeColor}`}
                  >
                    {service.ruleTag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isBangla ? service.titleBn : service.titleEn}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isBangla ? service.descBn : service.descEn}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 mb-4">
                  <span className="font-semibold text-slate-700 block mb-0.5">
                    {isBangla ? "আইনি ভিত্তি:" : "Statutory Basis:"}
                  </span>
                  <span>{isBangla ? service.legalRefBn : service.legalRefEn}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                >
                  <span>{isBangla ? "বিস্তারিত জানুন" : "Service Details"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Search className="w-3 h-3" />
                  <span>{isBangla ? "যাচাই করুন" : "Verify Now"}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
