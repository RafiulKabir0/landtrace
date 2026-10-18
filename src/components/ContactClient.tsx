"use client";

import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function ContactClient() {
  const { isBangla } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          {isBangla ? "যোগাযোগ ও তথ্য" : "Contact & Verified Project Team"}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isBangla ? "ল্যান্ডট্রেস টিম ও ডেভেলপার যোগাযোগ" : "Contact the LandTrace Engineering Team"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isBangla
            ? "ল্যান্ডটেক ২০২৬ প্রকল্প সংক্রান্ত যেকোনো প্রযুক্তিগত প্রশ্ন, নিরীক্ষা বা ফিডব্যাকের জন্য যোগাযোগ করুন।"
            : "Reach out for technical inquiries, competition evaluations, or feedback regarding LandTrace."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Verified Team Profile Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900 text-base">Team LandTrace</h2>
                  <span className="text-[10px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                    ID: LA-73
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-medium">
                  {isBangla ? "ল্যান্ডটেক ২০২৬ প্রতিযোগী দল" : "LandTech 2026 Competition Team"}
                </p>
                <span className="text-[10px] text-slate-400">Problem P3: Fraud & Double-Selling Detection</span>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                {isBangla ? "দলীয় সদস্যবৃন্দ (Members)" : "Team Members"}
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Rafiul Kabir</span>
                    <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                      {isBangla ? "দলনেতা / LEADER" : "LEADER"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    ID: 253-35-162 &bull; Department of Software Engineering
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Mst Maimuna Mim</span>
                    <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                      {isBangla ? "সদস্য / MEMBER" : "MEMBER"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    ID: 253-35-103 &bull; Department of Software Engineering
                  </p>
                </div>
              </div>
            </div>

            {/* Mentors */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  {isBangla ? "মেন্টরবৃন্দ (Mentors)" : "Mentors"}
                </span>
                <span className="text-[9px] text-slate-500 italic">
                  {isBangla ? "কমিটি কর্তৃক নিযুক্ত" : "Assigned by Committee"}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-100">
                  <div className="text-[10px] text-teal-800 font-semibold uppercase">
                    {isBangla ? "ফ্যাকাল্টি মেন্টর" : "Faculty Mentor"}
                  </div>
                  <div className="font-bold text-slate-900">Ms. Subarna Akter Liza</div>
                  <div className="text-[11px] text-slate-600">Lecturer &bull; CSE</div>
                  <div className="text-[11px] text-teal-700 font-mono mt-0.5">subarna.cse@diu.edu.bd</div>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-100">
                  <div className="text-[10px] text-teal-800 font-semibold uppercase">
                    {isBangla ? "ইন্ডাস্ট্রি সাপোর্ট মেন্টর" : "Industry Support Mentor"}
                  </div>
                  <div className="font-bold text-slate-900">MD. Tahamid Hassan Sadib</div>
                  <div className="text-[11px] text-slate-600">CSE-TECH</div>
                  <div className="text-[11px] text-teal-700 font-mono mt-0.5">251-15-084@diu.edu.bd</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <GithubIcon className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700 block">GitHub Repository:</span>
                  <a
                    href="https://github.com/RafiulKabir0/landtrace"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>github.com/RafiulKabir0/landtrace</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700 block">Contact Email:</span>
                  <span className="text-slate-600">contact.landtrace@gmail.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700 block">Location:</span>
                  <span className="text-slate-600">Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">
                {isBangla ? "প্রতিযোগিতা স্বীকৃতি ও ঘোষণা" : "Competition Verification & Notice"}
              </div>
              <p>
                {isBangla
                  ? "ল্যান্ডটেক ২০২৬ সমস্যা ৩ (P3: Fraud & Double-Selling Detection)-এর অফিসিয়াল রেজিস্ট্রেশন অনুযায়ী দলীয় তথ্য ও মেন্টর সমন্বয় সংরক্ষিত।"
                  : "Official registration details and assigned mentors verified per LandTech 2026 records."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Feedback / Message Form */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isBangla ? "বার্তাটি গৃহীত হয়েছে!" : "Message Received!"}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {isBangla
                    ? "আপনার মূল্যবান মতামত ও অনুসন্ধান আমাদের নিকট পৌঁছেছে। ধন্যবাদ!"
                    : "Thank you for your valuable feedback regarding LandTrace. We will respond promptly."}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  {isBangla ? "আরেকটি বার্তা পাঠান" : "Send Another Message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 mb-2">
                  {isBangla ? "মতামত বা বার্তা পাঠান" : "Send Feedback or Query"}
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? "আপনার নাম" : "Your Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isBangla ? "উদা: রফিকুল ইসলাম" : "e.g. Rafiqul Islam"}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? "ইমেইল ঠিকানা" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? "বিষয়" : "Subject"}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={isBangla ? "উদা: দ্বৈত বিক্রয় অ্যালগরিদম অনুসন্ধান" : "e.g. Algorithm Evaluation Query"}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? "বার্তা বা মন্তব্য" : "Your Message"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isBangla ? "আপনার বার্তা লিখুন..." : "Write your message here..."}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isBangla ? "বার্তা প্রেরণ করুন" : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
