"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { UserRole } from "@/lib/auth";

interface LoginFormProps {
  targetRole: UserRole;
}

export default function LoginForm({ targetRole }: LoginFormProps) {
  const router = useRouter();
  const { isBangla } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRoleConfig = () => {
    switch (targetRole) {
      case "CITIZEN":
        return {
          titleBn: "নাগরিক প্রবেশদ্বার",
          titleEn: "Citizen Portal Login",
          subtitleBn: "জমি ক্রেতা, বিক্রেতা ও ওয়ারিশদের জন্য একক রেকর্ড নিরীক্ষা ও ঝুঁকি সিমুলেটর",
          subtitleEn: "Plot record audit and pre-registration transfer risk simulator for citizens",
          icon: User,
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          demoEmail: "citizen@demo.landtrace.gov.bd",
          demoPass: "Citizen@LandTrace2026!",
          demoLabelBn: "ডেমো নাগরিক অ্যাকাউন্ট বসান (Mohammad Abdul Karim)",
          demoLabelEn: "Fill Demo Citizen Account (Mohammad Abdul Karim)",
          targetDashboard: "/citizen/dashboard",
        };
      case "OFFICIAL":
        return {
          titleBn: "ভূমি কর্মকর্তা প্রবেশদ্বার",
          titleEn: "Land Official Login",
          subtitleBn: "সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের জন্য স্বত্ব-শৃঙ্খল অডিট ও তদন্ত সিদ্ধান্ত সহায়তা",
          subtitleEn: "Decision support, chain of title audit & investigation actions for AC (Land) & Sub-Registrars",
          icon: Building2,
          badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
          demoEmail: "officer@demo.landtrace.gov.bd",
          demoPass: "Officer@LandTrace2026!",
          demoLabelBn: "ডেমো ভূমি কর্মকর্তা অ্যাকাউন্ট বসান (A. S. M. Rahman)",
          demoLabelEn: "Fill Demo Official Account (A. S. M. Rahman)",
          targetDashboard: "/official/dashboard",
        };
      case "ADMIN":
        return {
          titleBn: "সিস্টেম অ্যাডমিন প্রবেশদ্বার",
          titleEn: "System Administrator Login",
          subtitleBn: "ব্যবহারকারী অনুমোদন, রোল বরাদ্দকরণ, সিস্টেম নিরীক্ষা ও নিরাপত্তা ব্যবস্থাপনা",
          subtitleEn: "User role provisioning, system telemetry, audit logs & dataset configuration",
          icon: ShieldAlert,
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          demoEmail: "admin@demo.landtrace.gov.bd",
          demoPass: "Admin@LandTrace2026!",
          demoLabelBn: "ডেমো সিস্টেম অ্যাডমিন অ্যাকাউন্ট বসান (System Admin)",
          demoLabelEn: "Fill Demo Admin Account (System Admin)",
          targetDashboard: "/admin/dashboard",
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  const handleFillDemo = () => {
    setEmail(config.demoEmail);
    setPassword(config.demoPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.error ||
            (isBangla
              ? "ভুল ইমেইল বা পাসওয়ার্ড অথবা অ্যাকাউন্ট নিষ্ক্রিয় করা আছে।"
              : "Invalid email or password or account deactivated.")
        );
        setIsLoading(false);
        return;
      }

      // Check server returned role to route to the correct actual dashboard
      const userRole = data.user.role as UserRole;
      if (userRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (userRole === "OFFICIAL") {
        router.push("/official/dashboard");
      } else {
        router.push("/citizen/dashboard");
      }
      router.refresh();
    } catch {
      setError(
        isBangla
          ? "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
          : "Failed to connect to authentication server. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20 mb-4">
            <Icon className="w-7 h-7" />
          </div>
          <div className="inline-block mb-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.badgeColor}`}
            >
              {isBangla ? config.titleBn : config.titleEn}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isBangla ? config.titleBn : config.titleEn}
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {isBangla ? config.subtitleBn : config.subtitleEn}
          </p>
        </div>

        {/* Demo Fast-Fill Button for Evaluators */}
        <div className="px-6 sm:px-8 pt-4 pb-2">
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{isBangla ? config.demoLabelBn : config.demoLabelEn}</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 sm:mx-8 mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 pt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isBangla ? "ইমেইল ঠিকানা" : "Email Address"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={config.demoEmail}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isBangla ? "গোপন পাসওয়ার্ড" : "Password"}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-700/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isBangla ? "নিরাপদ প্রবেশ করুন" : "Secure Sign In"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Security & Role Enforcement Note */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-400 leading-normal flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>
                {isBangla
                  ? "সার্ভার-সাইড রোল যাচাইকরণ সক্রিয়। অনুমোদন ব্যতীত সংরক্ষিত বিভাগে প্রবেশ নিষিদ্ধ।"
                  : "Server-side role verification active. Unauthorized access is restricted."}
              </span>
            </p>
          </div>
        </form>

        {/* Alternate login navigation links */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            {isBangla ? "অন্যান্য ভূমিকা:" : "Other Portals:"}
          </span>
          <div className="flex items-center gap-3">
            {targetRole !== "CITIZEN" && (
              <Link
                href="/login/citizen"
                className="text-teal-700 hover:text-teal-900 font-semibold transition-colors"
              >
                {isBangla ? "নাগরিক" : "Citizen"}
              </Link>
            )}
            {targetRole !== "OFFICIAL" && (
              <Link
                href="/login/official"
                className="text-teal-700 hover:text-teal-900 font-semibold transition-colors"
              >
                {isBangla ? "কর্মকর্তা" : "Official"}
              </Link>
            )}
            {targetRole !== "ADMIN" && (
              <Link
                href="/login/admin"
                className="text-teal-700 hover:text-teal-900 font-semibold transition-colors"
              >
                {isBangla ? "অ্যাডমিন" : "Admin"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
