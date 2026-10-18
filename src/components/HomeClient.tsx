"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  FileCheck,
  Scale,
  Sparkles,
  Layers,
  AlertTriangle,
  User,
  Building2,
  ShieldAlert,
  Clock,
  Split,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function HomeClient() {
  const { isBangla } = useLanguage();

  const detectionCapabilities = [
    {
      titleBn: "দ্বৈত বিক্রয় শনাক্তকরণ",
      titleEn: "Double-Selling Detection",
      descBn: "একই বিক্রেতা বৈধ পুনঃঅধিগ্রহণ ছাড়া একাধিক ক্রেতার নিকট বিক্রয় দলিল সম্পাদন করলে তাৎক্ষণিক লাল সতর্কবার্তা প্রদান করে।",
      descEn: "Detects subsequent fraudulent alienation by the same vendor without legitimate title re-acquisition.",
      icon: Split,
      badgeBn: "নিয়ম ১ (Rule 1)",
      badgeEn: "Rule 1",
    },
    {
      titleBn: "মালিকানা ধারাবাহিকতা বিচ্ছিন্নতা",
      titleEn: "Ownership Chain Break",
      descBn: "সিএস/এসএ জরিপ খতিয়ান থেকে বর্তমান দাতা পর্যন্ত বিক্রয় বা ওয়ারিশি হস্তান্তরের অবিচ্ছিন্ন ধারা ও অনুপস্থিত দলিল চিহ্নিত করে।",
      descEn: "Identifies missing link deeds or untraceable grantors from root CS/SA cadastral records to current owner.",
      icon: Layers,
      badgeBn: "নিয়ম ২ (Rule 2)",
      badgeEn: "Rule 2",
    },
    {
      titleBn: "খতিয়ান বনাম দলিল পরিমাপ অসঙ্গতি",
      titleEn: "Khatian vs. Deed Area Mismatch",
      descBn: "মূল খতিয়ানের মোট নির্ধারিত জমির পরিমাণের চেয়ে হস্তান্তরিত দলিলের মোট পরিমাণ বৃদ্ধি পেলে গাণিতিক অসঙ্গতি রোধ করে।",
      descEn: "Prevents fractional over-sale when aggregate deed acreage exceeds the parent cadastral khatian share.",
      icon: Scale,
      badgeBn: "নিয়ম ৩ (Rule 3)",
      badgeEn: "Rule 3",
    },
    {
      titleBn: "দলিল ও অনুমোদিত নামজারি অমিল",
      titleEn: "Deed vs. Mutation Discrepancy",
      descBn: "রেজিস্ট্রিকৃত বিক্রয় দলিলের জমির পরিমাপ ও সহকারী কমিশনার (ভূমি) কর্তৃক অনুমোদিত নামজারি খতিয়ানের মধ্যে অমিল শনাক্ত করে।",
      descEn: "Flags discrepancies between Sub-Registry registered deed acreage and Assistant Commissioner (Land) mutation orders.",
      icon: FileSpreadsheet,
      badgeBn: "নিয়ম ৪ (Rule 4)",
      badgeEn: "Rule 4",
    },
    {
      titleBn: "সময়ানুক্রমিক অসঙ্গতি ও দ্রুত হস্তান্তর",
      titleEn: "Timing Anomaly & Rapid Flipping",
      descBn: "মালিকানা স্বত্ব অর্জনের তারিখের পূর্বে বিক্রয় সম্পাদন বা নামজারি ছাড়া অস্বাভাবিক দ্রুত (৭ দিনের মধ্যে) হস্তান্তর অনুসন্ধান করে।",
      descEn: "Uncovers anachronistic conveyance prior to title vesting or suspicious rapid flipping without mutation clearance.",
      icon: Clock,
      badgeBn: "নিয়ম ৫ (Rule 5)",
      badgeEn: "Rule 5",
    },
  ];

  const workflowSteps = [
    {
      step: "০১",
      stepEn: "01",
      titleBn: "রেকর্ড বা দলিল নম্বর অনুসন্ধান",
      titleEn: "Search Record Identifier",
      descBn: "প্লট নম্বর, খতিয়ান, দাগ, মৌজা অথবা সাব-রেজিস্ট্রি দলিল নম্বর প্রদান করুন।",
      descEn: "Enter plot number, khatian, dag, mouza, or registered deed number.",
    },
    {
      step: "০২",
      stepEn: "02",
      titleBn: "ডিজিটাল স্বত্ব-শৃঙ্খল বিশ্লেষণ",
      titleEn: "Chain-of-Title Reconstruction",
      descBn: "সিএস, এসএ, আরএস ও বিএস ঐতিহাসিক জরিপ রেকর্ড এবং হস্তান্তরের সময়রেখা সমন্বয়।",
      descEn: "Reconstructs chronological deed lineage from root CS/SA surveys to latest transactions.",
    },
    {
      step: "০৩",
      stepEn: "03",
      titleBn: "স্বয়ংক্রিয় ৫-স্তরের অডিট",
      titleEn: "Automated 5-Rule Engine Audit",
      descBn: "দ্বৈত বিক্রয়, পরিমাপ অমিল ও সময় অসঙ্গতি যাচাই করে নিরাপত্তা স্কোর (০-১০০) গণনা।",
      descEn: "Runs all 5 forensic detection rules and calculates an objective integrity score (0-100).",
    },
    {
      step: "০৪",
      stepEn: "04",
      titleBn: "তদন্ত ফাইল ও সিদ্ধান্ত সহায়তা",
      titleEn: "Forensic Investigation Dossier",
      descBn: "সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের জন্য তথ্যপ্রমাণসহ শুনানির সুপারিশ ও প্রিন্ট।",
      descEn: "Generates structured contradiction evidence, legal recommendations, and printable reports.",
    },
  ];

  const rolePortals = [
    {
      href: "/login/citizen",
      titleBn: "নাগরিক প্রবেশদ্বার",
      titleEn: "Citizen Portal",
      descBn: "জমি ক্রয়ের পূর্বে রেকর্ড নিরাপত্তা যাচাই করুন ও স্থানান্তর ঝুঁকি সিমুলেটর ব্যবহার করুন।",
      descEn: "Verify land title before purchase and simulate transfer risk to prevent costly disputes.",
      icon: User,
      buttonBn: "নাগরিক হিসেবে প্রবেশ",
      buttonEn: "Citizen Login",
      border: "hover:border-emerald-500",
      bg: "bg-emerald-50/50",
      accent: "text-emerald-700",
      btnBg: "bg-emerald-700 hover:bg-emerald-800",
    },
    {
      href: "/login/official",
      titleBn: "ভূমি কর্মকর্তা প্রবেশদ্বার",
      titleEn: "Land Official Portal",
      descBn: "সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের জন্য দলিল যাচাই, খতিয়ান অডিট ও শুনানি সিদ্ধান্ত।",
      descEn: "Decision support dossier, registry inspection and administrative review for AC (Land) & Sub-Registrars.",
      icon: Building2,
      buttonBn: "কর্মকর্তা হিসেবে প্রবেশ",
      buttonEn: "Official Login",
      border: "hover:border-teal-500",
      bg: "bg-teal-50/50",
      accent: "text-teal-700",
      btnBg: "bg-teal-700 hover:bg-teal-800",
    },
    {
      href: "/login/admin",
      titleBn: "সিস্টেম অ্যাডমিন প্রবেশদ্বার",
      titleEn: "System Admin Portal",
      descBn: "ব্যবহারকারী রোল অনুমোদন, অডিট ট্রেইল নিরীক্ষা এবং সিস্টেম সক্ষমতা কনফিগারেশন।",
      descEn: "Manage user roles, inspect tamper-evident audit logs, and monitor system performance.",
      icon: ShieldAlert,
      buttonBn: "অ্যাডমিন হিসেবে প্রবেশ",
      buttonEn: "Admin Login",
      border: "hover:border-slate-400",
      bg: "bg-slate-50",
      accent: "text-slate-700",
      btnBg: "bg-slate-800 hover:bg-slate-900",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-200/80 pt-8 sm:pt-14 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {isBangla
                    ? "ল্যান্ডটেক ২০২৬ (দল: LA-73) | P3: ভুয়া ও দ্বৈত বিক্রয় শনাক্তকরণ"
                    : "LandTech 2026 (Team: LA-73) | P3: Fraud & Double-Selling Detection"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.25] sm:leading-[1.2]">
                {isBangla ? (
                  <>
                    স্বত্ব-শৃঙ্খল বিশ্লেষণ ও <br />
                    <span className="text-teal-700">দ্বৈত বিক্রয় শনাক্তকরণ</span> সিস্টেম
                  </>
                ) : (
                  <>
                    Chain-of-Title Audit & <br />
                    <span className="text-teal-700">Double-Selling Fraud</span> Detection
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {isBangla
                  ? "বাংলাদেশ ভূমি প্রশাসন ও সাব-রেজিস্ট্রেশনের জন্য একটি সমন্বিত সিদ্ধান্ত-সহায়ক প্রোটোটাইপ। সিএস/এসএ জরিপ রেকর্ড হতে শুরু করে সাম্প্রতিক দলিল ও নামজারির ধারাবাহিকতা মিলিয়ে জালিয়াতি, অতিরিক্ত বিক্রয় ও সময়ানুক্রমিক অসঙ্গতি তাৎক্ষণিক উন্মোচন করে।"
                  : "A decision-support system prototype for Bangladesh land administration. Automatically correlates historical cadastral surveys (CS, SA, RS, BS) with deed and mutation chains to flag double-selling, fractional over-sales, and title breaks."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="/verify"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-md shadow-teal-700/20 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{isBangla ? "জমির রেকর্ড যাচাই করুন" : "Verify Land Record"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-teal-600" />
                  <span>{isBangla ? "সেবাসমূহ দেখুন" : "Explore Services"}</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isBangla ? "৫টি স্বয়ংক্রিয় অডিট নিয়ম" : "5 Automated Audit Rules"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isBangla ? "সিএস/এসএ/আরএস/বিএস জরিপ সমর্থন" : "CS/SA/RS/BS Survey Support"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isBangla ? "নিরাপদ ভূমিকাভিত্তিক প্রবেশদ্বার" : "Role-Based Access"}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xl bg-white group">
                <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                  <Image
                    src="/bangladesh_land_hero.jpg"
                    alt="Bangladesh Land Administration and Cadastral Surveys"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-600/90 text-white backdrop-blur-xs">
                      {isBangla ? "বাংলাদেশ ভূমি ব্যবস্থাপনা" : "Bangladesh Land Records"}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold mt-1 text-white">
                      {isBangla
                        ? "স্বত্ব-শৃঙ্খল ও ক্যাডাস্ট্রাল জরিপ নিরাপত্তা"
                        : "Cadastral Survey & Chain-of-Title Integrity"}
                    </h3>
                  </div>
                </div>

                {/* Hero Mini Stats Bar */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white p-3 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {isBangla ? "শনাক্তকরণ নিয়ম" : "Audit Rules"}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {isBangla ? "৫ টি" : "5 Rules"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {isBangla ? "ঐতিহাসিক জরিপ" : "Surveys"}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {isBangla ? "সিএস - বিএস" : "CS - BS"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {isBangla ? "সিদ্ধান্ত নির্ভুলতা" : "Risk Scoring"}
                    </span>
                    <span className="font-bold text-teal-600 text-sm">
                      {isBangla ? "০ - ১০০" : "0 - 100"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Detection Capabilities Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 mb-2">
            {isBangla ? "সমস্যা ৩ (P3) সমাধান" : "Problem Statement 3 (P3)"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isBangla
              ? "৫টি মূল স্বয়ংক্রিয় জালিয়াতি ও অসঙ্গতি শনাক্তকরণ নিয়ম"
              : "Five Core Automated Fraud & Anomaly Detection Rules"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {isBangla
              ? "প্রত্যেকটি রেকর্ড যাচাইকালে এই ৫টি অ্যালগরিদম সক্রিয়ভাবে সম্ভাব্য অমিল ও ঝুঁকি অনুসন্ধান করে।"
              : "Every land record is audited against these 5 deterministic algorithms to uncover hidden legal contradictions."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {detectionCapabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {isBangla ? item.badgeBn : item.badgeEn}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {isBangla ? item.titleBn : item.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBangla ? item.descBn : item.descEn}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-teal-700 font-semibold">
                    {isBangla ? "স্বয়ংক্রিয় অ্যালগরিদম" : "Automated Engine"}
                  </span>
                  <Link
                    href={`/services#rule-${idx + 1}`}
                    className="text-slate-400 hover:text-teal-700 font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{isBangla ? "বিস্তারিত" : "Details"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Direct Link to Verification */}
          <div className="bg-gradient-to-br from-teal-700 to-emerald-800 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-teal-200" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {isBangla ? "তাৎক্ষণিক রেকর্ড যাচাই" : "Instant Record Audit"}
              </h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                {isBangla
                  ? "যে কোনো ডেমো প্লট নম্বর দিয়ে অনুসন্ধান করুন এবং পূর্ণাঙ্গ স্বত্ব-শৃঙ্খল, জরিপ ইতিহাস ও অসঙ্গতি বিশ্লেষণ প্রত্যক্ষ করুন।"
                  : "Search any demo parcel identifier to inspect the complete chain-of-title, survey chronology, and contradiction dossier."}
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/verify"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-teal-900 hover:bg-teal-50 font-semibold text-xs transition-colors shadow-xs"
              >
                <span>{isBangla ? "যাচাইকরণ পোর্টালে যান" : "Go to Verification Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works: 4 Steps */}
      <section className="bg-slate-100/70 py-12 sm:py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isBangla ? "ল্যান্ডট্রেস যেভাবে কাজ করে" : "How LandTrace Works"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {isBangla
                ? "চারটি সহজ ধাপে ভূমি রেকর্ড বিশ্লেষণ ও সিদ্ধান্ত গ্রহণ"
                : "Land title analysis and decision support in four streamlined steps"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative"
              >
                <div className="text-2xl font-black text-teal-600 mb-2 font-mono">
                  {isBangla ? step.step : step.stepEn}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {isBangla ? step.titleBn : step.titleEn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isBangla ? step.descBn : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Portals Entry Points */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 mb-2">
            {isBangla ? "ভূমিকাভিত্তিক নিরাপত্তা" : "Role-Based Access"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isBangla ? "ব্যবহারকারী লগইন প্রবেশদ্বার" : "User Access Portals"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {isBangla
              ? "আপনার দায়িত্ব ও প্রয়োজনের ভিত্তিতে নির্ধারিত পোর্টালে প্রবেশ করুন"
              : "Select your designated portal based on your role and permissions"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rolePortals.map((portal, idx) => {
            const Icon = portal.icon;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-xs ${portal.border} transition-all flex flex-col justify-between`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${portal.bg} ${portal.accent} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {isBangla ? portal.titleBn : portal.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {isBangla ? portal.descBn : portal.descEn}
                  </p>
                </div>

                <Link
                  href={portal.href}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer ${portal.btnBg}`}
                >
                  <span>{isBangla ? portal.buttonBn : portal.buttonEn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimers & Synthetic Data Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 sm:p-6 text-xs text-amber-900 flex flex-col sm:flex-row items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950">
              {isBangla
                ? "আইনি নোটিশ ও তথ্যের সীমাবদ্ধতা (LandTech 2026 Prototype)"
                : "Legal Notice & Data Scope (LandTech 2026 Prototype)"}
            </h4>
            <p className="text-amber-800 leading-relaxed">
              {isBangla
                ? "ল্যান্ডট্রেস একটি স্বাধীন উদ্ভাবনী গবেষণা ও সিদ্ধান্ত-সহায়ক প্রোটোটাইপ। এটি বাংলাদেশ ভূমি প্রশাসন ব্যবস্থায় সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের সহায়তা করার লক্ষ্যে তৈরি করা হয়েছে। এটি কোনো আনুষ্ঠানিক সরকারি প্ল্যাটফর্ম নয় এবং এর ফলাফলের কোনো বিচারিক বাধ্যবাধকতা নেই। ওয়েবসাইটে প্রদর্শিত সকল প্লট, খতিয়ান, দাগ ও দলিল নম্বর পরীক্ষামূলক উদ্দেশ্যে প্রস্তুতকৃত সিন্থেটিক ডেটা।"
                : "LandTrace is an independent innovation and decision-support prototype created for LandTech 2026 Problem Statement P3. It is designed to assist Assistant Commissioners (Land) and Sub-Registrars. It is not an officially commissioned government portal and does not provide legally binding judicial determination of title. All parcel numbers, khatians, dags, and deeds are synthetic demonstration data."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
