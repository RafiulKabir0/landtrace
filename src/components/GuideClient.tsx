"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  User,
  Building2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function GuideClient() {
  const { isBangla } = useLanguage();

  const citizenSteps = [
    {
      step: "১",
      stepEn: "1",
      titleBn: "খতিয়ান বা প্লট নম্বর দিয়ে অনুসন্ধান",
      titleEn: "Search by Khatian or Plot Number",
      descBn: "যাচাইকরণ পাতায় গিয়ে আপনার এলাকার জেলা, উপজেলা, মৌজা ও দাগ/খতিয়ান নম্বর দিন অথবা ড্রপডাউন হতে নির্বাচন করুন।",
      descEn: "Visit the Verification page, enter your district, upazila, mouza, and plot or khatian identifier.",
    },
    {
      step: "২",
      stepEn: "2",
      titleBn: "ঐতিহাসিক সিএস/এসএ রেকর্ড পর্যালোচনা",
      titleEn: "Inspect Historical CS/SA Surveys",
      descBn: "১৯৫৬ সালের স্টেট একুইজিশন সিএস রেকর্ড এবং পরবর্তী আরএস/বিএস রেকর্ডের সাথে জমির সীমানা ও পরিমাপ মিলিয়ে নিন।",
      descEn: "Compare the historical State Acquisition CS records with subsequent RS/BS surveys for boundary consistency.",
    },
    {
      step: "৩",
      stepEn: "3",
      titleBn: "স্বত্ব ধারাবাহিকতা ও ঝুঁকি স্কোর পর্যবেক্ষণ",
      titleEn: "Review Chain-of-Title & Risk Score",
      descBn: "সবুজ স্কোর (৮০-১০০) মানে স্বত্ব সন্তোষজনক। হলুদ বা লাল স্কোর থাকলে সতর্ক থাকুন এবং বিস্তারিত অসঙ্গতি পড়ুন।",
      descEn: "A green score (80-100) indicates clear title. Amber or red scores indicate contradictions requiring caution.",
    },
    {
      step: "৪",
      stepEn: "4",
      titleBn: "হস্তান্তর পূর্ববর্তী ঝুঁকি সিমুলেশন",
      titleEn: "Run Pre-Registration Transfer Simulator",
      descBn: "বায়না করার আগে বিক্রেতার নাম ও ক্রয়যোগ্য শতাংশ বসিয়ে সিমুলেট করুন যাতে দ্বৈত বিক্রয়ের ফাঁদে না পড়েন।",
      descEn: "Before signing an agreement, simulate proposed transfer parameters to ensure the seller holds sufficient unencumbered title.",
    },
  ];

  const officialSteps = [
    {
      step: "১",
      stepEn: "1",
      titleBn: "রেজিস্ট্রি ওভারভিউ ও ঝুঁকি ভিত্তিক বাছাই",
      titleEn: "Registry Overview & Risk Filtering",
      descBn: "ড্যাশবোর্ডে প্রবেশের পর ফিল্টার ব্যবহার করে শুধুমাত্র 'ফ্ল্যাগড' বা উচ্চ ঝুঁকির প্লটসমূহ অগ্রাধিকার ভিত্তিতে চিহ্নিত করুন।",
      descEn: "Access the Official Dashboard and filter registry records by 'Flagged' or Critical Risk to prioritize investigation.",
    },
    {
      step: "২",
      stepEn: "2",
      titleBn: "তদন্ত ফাইলে স্বত্ববিরোধ ও প্রমাণপত্র যাচাই",
      titleEn: "Inspect Contradictions & Evidence Dossier",
      descBn: "প্রতিটি অসংগতির পেছনের মূল দলিল, অনুমোদিত নামজারি এবং বিক্রেতার পূর্ববর্তী হস্তান্তর হিসাব পরীক্ষা করুন।",
      descEn: "Analyze underlying registered deeds, mutation cases, and mathematical acreage calculations.",
    },
    {
      step: "৩",
      stepEn: "3",
      titleBn: "প্রশাসনিক পদক্ষেপ গ্রহণ ও নোটিশ প্রদান",
      titleEn: "Execute Review Actions & Issue Notices",
      descBn: "শুনানির নোটিশ জারি করুন, নামজারি সাময়িক স্থগিত রাখুন অথবা সরেজমিন সীমানা নির্ধারণের জন্য কানুনগোকে নির্দেশ দিন।",
      descEn: "Issue official hearing summons, freeze mutation proceedings, or depute Kanungo for boundary demarcation.",
    },
    {
      step: "৪",
      stepEn: "4",
      titleBn: "অডিট রিপোর্ট মুদ্রণ ও কেস নথিতে সংযোজন",
      titleEn: "Print Forensic Audit Report for Case File",
      descBn: "এক ক্লিকে আনুষ্ঠানিক সরকারি ফরম্যাটের প্রতিবেদন প্রিন্ট করে নথিতে যুক্ত করুন।",
      descEn: "Export or print standardized audit dossiers formatted for administrative case dockets.",
    },
  ];

  const faqs = [
    {
      qBn: "ল্যান্ডট্রেসের ঝুঁকি স্কোর কীভাবে গণনা করা হয়?",
      qEn: "How is the LandTrace Risk Score calculated?",
      aBn: "প্রতিটি প্লট ১০০ পূর্ণমান দিয়ে শুরু হয়। দ্বৈত বিক্রয় ধরা পড়লে ৪০ পয়েন্ট, স্বত্ব ধারাবাহিকতা বিচ্ছিন্নতায় ৩৫ পয়েন্ট, জমির পরিমাপের অসঙ্গতিতে ২৫ পয়েন্ট, দলিল-নামজারি অমিল থাকলে ২০ পয়েন্ট এবং সময়ানুক্রমিক অসঙ্গতিতে ১৫ পয়েন্ট কর্তন করা হয়।",
      aEn: "Parcels begin with a baseline score of 100. Deductions are applied for each verified contradiction: -40 for Double Selling, -35 for Chain Break, -25 for Area Mismatch, -20 for Deed-Mutation Mismatch, and -15 for Timing Anomalies.",
    },
    {
      qBn: "ল্যান্ডট্রেসের ফলাফল কি কোনো আদালতে আইনি প্রমাণ হিসেবে ব্যবহার করা যাবে?",
      qEn: "Can LandTrace results be used as direct legal evidence in court?",
      aBn: "না। ল্যান্ডট্রেস একটি সিদ্ধান্ত-সহায়ক সফটওয়্যার প্রোটোটাইপ। এটি সহকারী কমিশনার (ভূমি) এবং সাব-রেজিস্ট্রারদের দ্রুত অসঙ্গতি চিহ্নিত করতে সহায়তা করে। চূড়ান্ত আইনি সিদ্ধান্ত বিজ্ঞ আদালতের বালাম বই ও মূল দলিলের নিরীক্ষার মাধ্যমেই নির্ধারিত হবে।",
      aEn: "No. LandTrace is an analytical decision-support prototype. It assists administrative officers in identifying discrepancies. Binding judicial determinations must be made by competent civil courts upon inspecting original volume registers.",
    },
    {
      qBn: "সিন্থেটিক ডেটা বলতে কী বোঝায়?",
      qEn: "What does Synthetic Data mean in this prototype?",
      aBn: "বাংলাদেশের ভূমি ব্যবস্থাপনা আইন ও পরিভাষা সম্পূর্ণ যথাযথ রেখে পরীক্ষামূলক উদ্দেশ্যে প্লট, নাম ও দলিল নম্বরসমূহ কৃত্রিমভাবে তৈরি করা হয়েছে যাতে কোনো নাগরিকের ব্যক্তিগত তথ্যের গোপনীয়তা ক্ষুণ্ণ না হয়।",
      aEn: "All names, deed numbers, and cadastral plots are synthetically generated following realistic Bangladesh land administration conventions, ensuring zero breach of private citizen data.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          {isBangla ? "ব্যবহারকারী নির্দেশিকা" : "User Guide & Knowledge Base"}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isBangla ? "ল্যান্ডট্রেস ব্যবহারের পূর্ণাঙ্গ নির্দেশিকা" : "How to Use the LandTrace Platform"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isBangla
            ? "নাগরিক এবং ভূমি কর্মকর্তাদের জন্য ধাপে ধাপে জমি যাচাই, স্বত্ব-শৃঙ্খল অডিট ও সিদ্ধান্ত গ্রহণের নিয়মাবলি।"
            : "Step-by-step instructions for citizens and land administration officers on verifying records and conducting title audits."}
        </p>
      </div>

      {/* Citizen Walkthrough */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isBangla ? "নাগরিক ব্যবহার নির্দেশিকা (জমি ক্রেতা ও ওয়ারিশ)" : "Citizen Guide (Land Buyers & Heirs)"}
            </h2>
            <p className="text-xs text-slate-500">
              {isBangla
                ? "জমি ক্রয়ের পূর্বে প্রতারণা এড়াতে ৪টি করণীয় ধাপ"
                : "Four essential steps before executing a purchase deed"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {citizenSteps.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  {isBangla ? s.step : s.stepEn}
                </span>
                <h3 className="text-sm font-bold text-slate-800">
                  {isBangla ? s.titleBn : s.titleEn}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {isBangla ? s.descBn : s.descEn}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{isBangla ? "রেকর্ড যাচাই শুরু করুন" : "Start Citizen Verification"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Official Walkthrough */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isBangla
                ? "ভূমি কর্মকর্তা নির্দেশিকা (সহকারী কমিশনার ভূমি ও সাব-রেজিস্ট্রার)"
                : "Official Guide (AC Land & Sub-Registrars)"}
            </h2>
            <p className="text-xs text-slate-500">
              {isBangla
                ? "রেজিস্ট্রি অডিট ও সিদ্ধান্ত সহায়তার ৪টি প্রশাসনিক ধাপ"
                : "Four administrative review and decision protocol steps"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {officialSteps.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center">
                  {isBangla ? s.step : s.stepEn}
                </span>
                <h3 className="text-sm font-bold text-slate-800">
                  {isBangla ? s.titleBn : s.titleEn}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {isBangla ? s.descBn : s.descEn}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <Link
            href="/login/official"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>{isBangla ? "কর্মকর্তা পোর্টালে প্রবেশ করুন" : "Open Official Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {isBangla ? "সচরাচর জিজ্ঞাসিত প্রশ্নাবলি (FAQ)" : "Frequently Asked Questions"}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900">
                {isBangla ? faq.qBn : faq.qEn}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBangla ? faq.aBn : faq.aEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
