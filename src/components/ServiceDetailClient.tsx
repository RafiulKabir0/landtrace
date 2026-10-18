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
  ArrowLeft,
  ArrowRight,
  Search,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

interface ServiceInfo {
  slug: string;
  titleBn: string;
  titleEn: string;
  ruleTag: string;
  icon: React.ElementType;
  summaryBn: string;
  summaryEn: string;
  statutoryBasisBn: string;
  statutoryBasisEn: string;
  problemSolvedBn: string;
  problemSolvedEn: string;
  algorithmLogicBn: string;
  algorithmLogicEn: string;
  officerRoleBn: string;
  officerRoleEn: string;
  demoPlot: string;
}

const SERVICE_DATA: Record<string, ServiceInfo> = {
  "double-selling": {
    slug: "double-selling",
    titleBn: "দ্বৈত বিক্রয় ও পরবর্তী অবৈধ হস্তান্তর শনাক্তকরণ",
    titleEn: "Double-Selling & Subsequent Alienation Detection",
    ruleTag: "Rule 1 (নিয়ম ১)",
    icon: Split,
    summaryBn:
      "একই বিক্রেতা একটি নির্দিষ্ট দাগের মালিকানা প্রথম ক্রেতার কাছে হস্তান্তরের পর স্বত্ব পুনরায় অর্জন না করেই দ্বিতীয় ব্যক্তির নিকট বিক্রয় করলে তা শনাক্ত করে।",
    summaryEn:
      "Detects duplicate fraudulent conveyances where the same vendor sells a parcel to a second party without lawful re-acquisition of title.",
    statutoryBasisBn:
      "রেজিস্ট্রেশন আইন ১৯০৮-এর ধারা ৪৭ ও ৪৮, সম্পত্তি হস্তান্তর আইন ১৮৮২-এর ধারা ৪৮ (Priorities of Rights Created by Transfer), এবং দণ্ডবিধি ১৮৬০-এর ধারা ৪১৭/৪২০/৪৬৮।",
    statutoryBasisEn:
      "The Registration Act 1908 (Sec 47-48), Transfer of Property Act 1882 (Sec 48), and Penal Code 1860 (Sec 417, 420, 468).",
    problemSolvedBn:
      "বাংলাদেশে ভূমি বিরোধ ও দেওয়ানি মামলার অন্যতম প্রধান কারণ হলো সাব-রেজিস্ট্রি দলিলের তথ্যের সাথে তাৎক্ষণিক ভূমি রেকর্ড হালনাগাদ না থাকার সুযোগে একই জমি বারবার বিক্রয় করা। ল্যান্ডট্রেসের অ্যালগরিদম প্রতিটি দলিলের বিক্রেতার পূর্ববর্তী বিক্রয় ইতিহাস মিলিয়ে দ্বৈত বিক্রয় প্রতিরোধ করে।",
    problemSolvedEn:
      "A leading cause of land litigation in Bangladesh is repetitive sale of identical plots before mutation occurs. LandTrace correlates grantor transaction histories across sub-registry books to intercept duplicate conveyances.",
    algorithmLogicBn:
      "অ্যালগরিদম দলিলের সময়ানুক্রম সাজিয়ে বিক্রেতার পূর্ববর্তী হস্তান্তর হিসাব করে। যদি পূর্ববর্তী কোনো দলিলে সমুদয় বা আংশিক জমি হস্তান্তর হয়ে থাকে এবং মধ্যবর্তী কোনো বৈধ দলিলের মাধ্যমে বিক্রেতা তা পুনরায় ক্রয় না করেন, তবে এটি ক্রিটিক্যাল দ্বৈত বিক্রয় অসঙ্গতি ঘোষণা করে।",
    algorithmLogicEn:
      "Sorts deeds chronologically. If a vendor transfers land without a subsequent purchase deed proving legitimate title replenishment, the engine triggers a CRITICAL double-selling anomaly.",
    officerRoleBn:
      "সাব-রেজিস্ট্রার দলিল রেজিস্ট্রেশন সাময়িকভাবে স্থগিত রেখে মূল বিক্রেতার দাখিলা তলব করতে পারেন। সহকারী কমিশনার (ভূমি) দ্বিতীয় দলিলের ভিত্তিতে দাখিলকৃত নামজারি আবেদন সরাসরি খারিজ করতে পারেন।",
    officerRoleEn:
      "Sub-Registrars withhold registration pending vendor title clarification; AC (Land) officers can summarily dismiss mutation petitions based on duplicate subsequent deeds.",
    demoPlot: "PLOT-DH-2045",
  },
  "chain-of-title": {
    slug: "chain-of-title",
    titleBn: "সিএস/এসএ হতে স্বত্ব ধারাবাহিকতা ট্র্যাকিং",
    titleEn: "Cadastral Chain-of-Title Tracking",
    ruleTag: "Rule 2 (নিয়ম ২)",
    icon: Layers,
    summaryBn:
      "সিএস বা এসএ মূল খতিয়ান হতে শুরু করে বর্তমান দাবিদার পর্যন্ত সকল বিক্রয়, হেবা বা ওয়ারিশি দলিলের অবিচ্ছিন্ন যোগসূত্র নিশ্চিত করে।",
    summaryEn:
      "Traces unbroken title provenance from root CS/SA cadastral records to current claimants, catching gaps and missing link deeds.",
    statutoryBasisBn:
      "স্টেট একুইজিশন অ্যান্ড প্রজাস্বত্ব আইন ১৯৫০-এর ধারা ১৪৩ (Maintenance of Record-of-Rights) এবং ভূমি জরিপ বিধিমালা।",
    statutoryBasisEn:
      "State Acquisition & Tenancy Act 1950 (Section 143: Maintenance of Record-of-Rights) and Land Survey Rules.",
    problemSolvedBn:
      "ভুয়া বা জাল পিঠদলিল (Link Deed) ব্যবহার করে অন্যের জমি নিজের দাবি করার অপচেষ্টা রোধ। কোনো অননুমোদিত ব্যক্তি স্বত্বধারায় হঠাৎ করে আবির্ভূত হলে তা ধরা পড়ে।",
    problemSolvedEn:
      "Eliminates forged root and link deeds by verifying that every successive grantor in the deed sequence was legitimately recorded as a grantee in an earlier transaction.",
    algorithmLogicBn:
      "প্রথম দলিল বাদে প্রতিটি দলিলের বিক্রেতা পূর্ববর্তী কোনো অনুমোদিত দলিলের ক্রেতা বা মূল খতিয়ানের বৈধ ওয়ারিশ কি না তা নাম ও জাতীয় পরিচয়পত্র/ওয়ারিশান সূত্রে মেলায়।",
    algorithmLogicEn:
      "Verifies that each seller in sequential transactions was a legitimate buyer in a preceding deed or recognized heir in parent survey khatians.",
    officerRoleBn:
      "সহকারী কমিশনার (ভূমি) ধারাবাহিকতাহীন দলিলের ক্ষেত্রে মূল বালাম বই তলব এবং ওয়ারিশান সনদ সরেজমিন তদন্তের নির্দেশ প্রদান করেন।",
    officerRoleEn:
      "Empowers AC (Land) to order physical heirship verification and summon sub-registry record books for unlinked deeds.",
    demoPlot: "PLOT-SYL-5501",
  },
  "cadastral-area": {
    slug: "cadastral-area",
    titleBn: "খতিয়ান বনাম দলিল পরিমাপ অসঙ্গতি যাচাই",
    titleEn: "Cadastral Area vs. Deed Acreage Verification",
    ruleTag: "Rule 3 (নিয়ম ৩)",
    icon: Scale,
    summaryBn:
      "মূল খতিয়ান ও দাগে বরাদ্দকৃত মোট জমির চেয়ে দলিলের মোট হস্তান্তরকৃত জমির পরিমাণ বৃদ্ধি পেলে গাণিতিক অসঙ্গতি রোধ করে।",
    summaryEn:
      "Prevents aggregate deed conveyances from mathematically exceeding the parcel's cadastral survey boundary.",
    statutoryBasisBn:
      "ভূমি ব্যবস্থাপনা ম্যানুয়াল ১৯৯০, খতিয়ান লিখন ও হিসাবরক্ষণ বিধিমালা এবং জরিপ আইন ১৮৭৫।",
    statutoryBasisEn:
      "Land Management Manual 1990, Record-of-Rights Accounting Rules & Survey Act 1875.",
    problemSolvedBn:
      "দাগে ১০ শতাংশ জমি থাকা সত্ত্বেও একাধিক দলিলের মাধ্যমে ১৫ বা ২০ শতাংশ জমি বিক্রির প্রতারণা প্রতিহত করে।",
    problemSolvedEn:
      "Prevents fraudulent 'phantom acreage' schemes where owners of small fractional shares sell more land than physically recorded in the cadastral dag.",
    algorithmLogicBn:
      "দাগের মোট শতক এবং সংশ্লিষ্ট সকল দলিলের হস্তান্তরিত শতকের সমষ্টি তুলনা করা হয়। সমষ্টি ১০৫% অতিক্রম করলেই সিস্টেম এরিয়া মিসম্যাচ সংকেত দেয়।",
    algorithmLogicEn:
      "Aggregates transferred deed decimals against cadastral khatian total. If deed sum exceeds 105% of recorded survey acreage, an Area Mismatch anomaly is raised.",
    officerRoleBn:
      "উপজেলা কানুনগো ও সার্ভেয়ার দ্বারা ডিজিটাল নকশা ও সরেজমিন সীমানা পরিমাপের আদেশ প্রদান করা হয়।",
    officerRoleEn:
      "Orders Kanungo and Surveyors to conduct physical field demarcation and digital map cross-verification.",
    demoPlot: "PLOT-CTG-3301",
  },
  "deed-mutation": {
    slug: "deed-mutation",
    titleBn: "দলিল ও সহকারী কমিশনার (ভূমি) নামজারি সামঞ্জস্য",
    titleEn: "Deed vs. Sanctioned Mutation Consistency",
    ruleTag: "Rule 4 (নিয়ম ৪)",
    icon: FileSpreadsheet,
    summaryBn:
      "রেজিস্ট্রিকৃত বিক্রয় দলিলের জমির পরিমাপের সাথে এসি ল্যান্ড অফিসের খারিজ বা নামজারি খতিয়ানের তথ্যের অমিল শনাক্ত করে।",
    summaryEn:
      "Correlates registered conveyance deed figures with AC (Land) approved e-mutation records to expose unapproved variations.",
    statutoryBasisBn:
      "ই-নামজারি সমন্বয় পরিপত্র এবং জমি রেজিস্ট্রেশন ও নামজারি আন্তঃসংযোগ কাঠামো।",
    statutoryBasisEn:
      "E-Mutation Interconnection Circular & Registration-to-Mutation Digital Framework.",
    problemSolvedBn:
      "দলিলের চেয়ে বেশি জমিতে নামজারি করিয়ে নেওয়া কিংবা নামজারির শর্ত অমান্য করে দলিল করার মতো অনিয়ম দূর করে।",
    problemSolvedEn:
      "Stops illicit mutations granting more acreage than authorized in the underlying registered conveyance deed.",
    algorithmLogicBn:
      "প্রতিটি দলিলের দাগ নম্বর ও জমির পরিমাপের সাথে নামজারি খতিয়ানের কেস নম্বর ও পরিমাপের তুলনা করে ১০% বা ততোধিক পার্থক্য থাকলে সতর্কবার্তা দেয়।",
    algorithmLogicEn:
      "Compares deed acreage directly with mutation approval metrics. A variation exceeding 10% triggers an immediate consistency warning.",
    officerRoleBn:
      "নামজারি বাতিলকরণ এবং রেজিস্ট্রি অফিসের মূল বালাম বই তলব করে শুনানি গ্রহণ।",
    officerRoleEn:
      "Summons mutation case records and initiates administrative correction hearing before AC (Land).",
    demoPlot: "PLOT-RAJ-4402",
  },
  "timing-anomaly": {
    slug: "timing-anomaly",
    titleBn: "সময়ানুক্রমিক অসঙ্গতি ও অস্বাভাবিক দ্রুত হস্তান্তর",
    titleEn: "Transfer Timing Anomaly & Rapid Flipping",
    ruleTag: "Rule 5 (নিয়ম ৫)",
    icon: Clock,
    summaryBn:
      "মালিকানা স্বত্ব অর্জনের তারিখের পূর্বেই বিক্রয় সম্পাদন বা নামজারি ছাড়া অস্বাভাবিক দ্রুত হাতবদল অনুসন্ধান করে।",
    summaryEn:
      "Uncovers anachronistic transactions where deeds predate vendor ownership, or high-risk rapid flips within 7 days.",
    statutoryBasisBn:
      "রেজিস্ট্রেশন বিধিমালা ২০১৪ এবং সম্পত্তি হস্তান্তর আইন ১৮৮২।",
    statutoryBasisEn:
      "Registration Rules 2014 & Transfer of Property Act 1882.",
    problemSolvedBn:
      "ব্যাকডেটেড (পেছনের তারিখে ভুয়া দলিল তৈরি) জালিয়াতি এবং বিরোধপূর্ণ জমি দ্রুত বিক্রি করে টাকা হাতিয়ে নেওয়ার চক্র শনাক্ত করে।",
    problemSolvedEn:
      "Catches backdated deed fabrication and predatory quick-flipping schemes designed to create pseudo-innocent third-party buyers.",
    algorithmLogicBn:
      "দলিলের তারিখ এবং পূর্ববর্তী দলিলের তারিখের সময় ব্যবধান পর্যবেক্ষণ করে। যদি কোনো দলিল পূর্ববর্তী স্বত্ব অর্জনের আগের তারিখে নিবন্ধিত দেখানো হয় অথবা ৭ দিনের মধ্যে পুনরায় বিক্রি হয়, তবে সিস্টেম অ্যালার্ট জারি করে।",
    algorithmLogicEn:
      "Evaluates chronological intervals. Backdated deeds where deedDate precedes seller acquisition date, or transfers executed within 7 days trigger timing warnings.",
    officerRoleBn:
      "জালিয়াতির পূর্ণাঙ্গ তদন্ত এবং দলিল লেখকের বিরুদ্ধে ব্যবস্থা গ্রহণের জন্য সাব-রেজিস্ট্রারের নিকট প্রেরণ।",
    officerRoleEn:
      "Requires forensic investigation into deed writers and witnesses for suspiciously backdated conveyances.",
    demoPlot: "PLOT-KHL-6610",
  },
  "pre-registration": {
    slug: "pre-registration",
    titleBn: "হস্তান্তর পূর্ববর্তী ঝুঁকি মূল্যায়ন ও নাগরিক সিমুলেটর",
    titleEn: "Pre-Registration Transfer Risk Simulator",
    ruleTag: "Citizen Tool (নাগরিক টুল)",
    icon: ShieldCheck,
    summaryBn:
      "জমি ক্রয়ের চুক্তি বা বায়না করার পূর্বেই নাগরিকরা প্রস্তাবিত বিক্রেতা ও জমির পরিমাপ যাচাই করে স্বত্ব ঝুঁকিমুক্ত কি না তা পরীক্ষা করতে পারেন।",
    summaryEn:
      "Permits prospective land purchasers to run pre-flight title audits before committing non-refundable earnest money or registration fees.",
    statutoryBasisBn:
      "নাগরিক সেবা সহজীকরণ নির্দেশিকা ও ভোক্তা অধিকার সুরক্ষা।",
    statutoryBasisEn:
      "Citizen Service Simplification Guidelines & Consumer Rights Protection.",
    problemSolvedBn:
      "নাগরিকরা জমি কিনে প্রতারিত হওয়া এবং পরবর্তীতে দীর্ঘস্থায়ী মামলা-মোকদ্দমায় জড়িয়ে পড়ার ঝুঁকি থেকে রক্ষা পান।",
    problemSolvedEn:
      "Protects ordinary citizens from investing life savings into contested, encumbered, or double-sold real estate.",
    algorithmLogicBn:
      "প্রস্তাবিত বিক্রেতার নাম ও পরিমাপ বর্তমান অনুমোদিত খতিয়ানের সাথে মিলিয়ে দেখে যে বিক্রেতার নামে অবশিষ্ট জমির পরিমাণ ক্রয়ের প্রস্তাবিত পরিমাণের সমান বা বেশি কি না।",
    algorithmLogicEn:
      "Compares proposed vendor name and acreage against verified records to calculate prospective title feasibility.",
    officerRoleBn:
      "নাগরিকদের সচেতনতা বৃদ্ধি এবং আদালতে জমি সংক্রান্ত মামলা হ্রাসকরণে সহায়তা করে।",
    officerRoleEn:
      "Drastically reduces burden on land tribunals by preempting disputes before registration execution.",
    demoPlot: "PLOT-DH-1001",
  },
};

export default function ServiceDetailClient({ serviceSlug }: { serviceSlug: string }) {
  const { isBangla } = useLanguage();

  const service = SERVICE_DATA[serviceSlug] || SERVICE_DATA["double-selling"];
  const Icon = service.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Back Button */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBangla ? "সকল সেবার তালিকায় ফিরে যান" : "Back to Service Directory"}</span>
        </Link>
      </div>

      {/* Service Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {service.ruleTag}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {isBangla ? service.titleBn : service.titleEn}
              </h1>
            </div>
          </div>

          <Link
            href={`/verify/${service.demoPlot}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>
              {isBangla ? `ডেমো প্লট (${service.demoPlot}) যাচাই করুন` : `Verify Demo (${service.demoPlot})`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
          {isBangla ? service.summaryBn : service.summaryEn}
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statutory Basis */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>{isBangla ? "আইনি ভিত্তি ও সংশ্লিষ্ট আইন" : "Statutory Authority & Laws"}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isBangla ? service.statutoryBasisBn : service.statutoryBasisEn}
          </p>
        </div>

        {/* Problem Solved */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isBangla ? "যে সমস্যা দূর করে" : "Target Problem Prevented"}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isBangla ? service.problemSolvedBn : service.problemSolvedEn}
          </p>
        </div>

        {/* Algorithm Logic */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>{isBangla ? "ল্যান্ডট্রেস অ্যালগরিদম যুক্তি" : "Detection Algorithm Logic"}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isBangla ? service.algorithmLogicBn : service.algorithmLogicEn}
          </p>
        </div>

        {/* Officer Decision Support */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>{isBangla ? "কর্মকর্তাদের সিদ্ধান্ত সহায়তা" : "Officer Action & Decision Protocol"}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isBangla ? service.officerRoleBn : service.officerRoleEn}
          </p>
        </div>
      </div>

      {/* Direct Action Banner */}
      <div className="rounded-2xl bg-teal-50 border border-teal-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-teal-950 text-sm">
            {isBangla ? "এই নিয়মের সরাসরি কার্যকারিতা দেখুন" : "Test This Rule in the Live Verification Engine"}
          </h3>
          <p className="text-xs text-teal-800 mt-1">
            {isBangla
              ? `নমুনা রেকর্ড ${service.demoPlot}-এ এই অ্যালগরিদমের বাস্তব ফলাফল ও তথ্যপ্রমাণ সংরক্ষিত রয়েছে।`
              : `Sample record ${service.demoPlot} contains real synthetic contradiction data for this rule.`}
          </p>
        </div>
        <Link
          href={`/verify/${service.demoPlot}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <span>{isBangla ? "যাচাইকরণে যান" : "Open Verification"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
