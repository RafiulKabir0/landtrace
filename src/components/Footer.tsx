"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight, Scale } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function Footer() {
  const { isBangla } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Upper Footer: Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Project Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  {isBangla ? "ল্যান্ডট্রেস (LandTrace)" : "LandTrace"}
                </span>
                <p className="text-xs text-teal-400 font-medium">
                  {isBangla
                    ? "ভূমি রেকর্ড জালিয়াতি ও দ্বৈত বিক্রয় শনাক্তকরণ সিদ্ধান্ত-সহায়তা"
                    : "Land Fraud & Double-Selling Decision-Support Engine"}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isBangla
                ? "ল্যান্ডটেক ২০২৬ (LandTech 2026) জাতীয় উদ্ভাবনী হ্যাকাথনের সমস্যা ৩ (P3)-এর অধীনে প্রণীত প্রোটোটাইপ। এটি বাংলাদেশ ভূমি প্রশাসন ব্যবস্থায় সহকারী কমিশনার (ভূমি) এবং সাব-রেজিস্ট্রারদের জন্য কৃত্রিম বুদ্ধিমত্তা ও নিয়মতান্ত্রিক স্বত্ব-শৃঙ্খল অডিট সম্পাদন করে।"
                : "Innovative prototype developed under LandTech 2026 Problem Statement 3 (P3). Performs automated chain-of-title audits and fraud contradiction detection for Assistant Commissioners (Land) and Sub-Registrars in Bangladesh."}
            </p>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-teal-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>{isBangla ? "আইনি ও তথ্যের স্পষ্টতা" : "Legal & Technical Notice"}</span>
              </div>
              <p className="text-slate-400">
                {isBangla
                  ? "এই প্ল্যাটফর্মের সকল তথ্য সিন্থেটিক/পরীক্ষামূলক। কোনো ব্যক্তিগত বা রাষ্ট্রীয় গোপনীয় ডেটা ব্যবহৃত হয়নি। সিদ্ধান্ত সতর্কবার্তা বিচারিক রায় হিসেবে গ্রহণযোগ্য নয়।"
                  : "All records are synthetic demonstration data. No confidential or live citizen data is accessed. Engine alerts serve solely as decision support, not legal proof."}
              </p>
            </div>
          </div>

          {/* Quick Links: Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
              {isBangla ? "সেবাসমূহ" : "Services"}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/services/double-selling"
                  className="hover:text-white transition-colors"
                >
                  {isBangla ? "দ্বৈত বিক্রয় শনাক্তকরণ" : "Double-Selling Detection"}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/chain-of-title"
                  className="hover:text-white transition-colors"
                >
                  {isBangla ? "মালিকানা ধারাবাহিকতা" : "Chain of Title Tracking"}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/cadastral-area"
                  className="hover:text-white transition-colors"
                >
                  {isBangla ? "খতিয়ান পরিমাপ যাচাই" : "Cadastral Area Verification"}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/deed-mutation"
                  className="hover:text-white transition-colors"
                >
                  {isBangla ? "দলিল-নামজারি সামঞ্জস্য" : "Deed-Mutation Consistency"}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/pre-registration"
                  className="hover:text-white transition-colors"
                >
                  {isBangla ? "হস্তান্তর পূর্ববর্তী ঝুঁকি সিমুলেটর" : "Pre-Registration Simulator"}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 font-medium pt-1"
                >
                  <span>{isBangla ? "সকল সেবা দেখুন" : "View All Services"}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Platform & Guide */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
              {isBangla ? "তথ্যাবলি ও নির্দেশিকা" : "Information & Guide"}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/verify" className="hover:text-white transition-colors">
                  {isBangla ? "রেকর্ড যাচাইকরণ পোর্টাল" : "Record Verification"}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  {isBangla ? "ব্যবহার নির্দেশিকা" : "User Guide & FAQ"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {isBangla ? "পরিচিতি ও সীমাবদ্ধতা" : "About & Scope"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {isBangla ? "যোগাযোগ ও টিম" : "Contact & Team"}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/RafiulKabir0/landtrace"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors pt-1"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Role Portals */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
              {isBangla ? "প্রবেশদ্বার (Login)" : "Access Portals"}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/login/citizen"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{isBangla ? "নাগরিক প্রবেশদ্বার" : "Citizen Portal"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login/official"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>{isBangla ? "ভূমি কর্মকর্তা প্রবেশদ্বার" : "Land Official Portal"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login/admin"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{isBangla ? "সিস্টেম অ্যাডমিন" : "System Admin"}</span>
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                {isBangla
                  ? "সংরক্ষিত প্রাতিষ্ঠানিক ভূমিকার জন্য সার্ভার-সাইড অনুমোদন বাধ্যতামূলক।"
                  : "Server-side role authorization strictly enforced."}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Attribution */}
      <div className="border-t border-slate-800 bg-slate-950 py-4 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>
            {isBangla
              ? "© ২০২৬ ল্যান্ডট্রেস (LandTrace) • সর্বস্বত্ব সংরক্ষিত • ল্যান্ডটেক ২০২৬ প্রতিযোগিতার প্রোটোটাইপ"
              : "© 2026 LandTrace • All Rights Reserved • LandTech 2026 Prototype"}
          </p>
          <p className="text-slate-400">
            {isBangla ? "প্রধান প্রকৌশলী:" : "Lead Developer:"}{" "}
            <a
              href="https://github.com/RafiulKabir0"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-teal-400 hover:text-teal-300 transition-colors"
            >
              Rafiul Kabir (রাফিউল কবির)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
