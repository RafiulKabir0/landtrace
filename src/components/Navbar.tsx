"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  Menu,
  X,
  Globe,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Building2,
  FileCheck2,
  Home,
  BookOpen,
  Info,
  Phone,
  LayoutDashboard,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { UserRole } from "@/lib/auth";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  designation?: string;
}

export default function Navbar({ initialUser }: { initialUser?: UserInfo | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggleLang, isBangla } = useLanguage();

  const [user, setUser] = useState<UserInfo | null>(initialUser || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  // Check auth state on client mount if not passed in
  useEffect(() => {
    if (!initialUser) {
      fetch("/api/auth/me")
        .then((res) => {
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [initialUser]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", labelBn: "হোম", labelEn: "Home", icon: Home },
    { href: "/services", labelBn: "সেবাসমূহ", labelEn: "Services", icon: FileCheck2 },
    { href: "/verify", labelBn: "যাচাইকরণ", labelEn: "Verify", icon: ShieldAlert },
    { href: "/guide", labelBn: "নির্দেশিকা", labelEn: "Guide", icon: BookOpen },
    { href: "/about", labelBn: "পরিচিতি", labelEn: "About", icon: Info },
    { href: "/contact", labelBn: "যোগাযোগ", labelEn: "Contact", icon: Phone },
  ];

  const getDashboardHref = () => {
    if (!user) return "/login/citizen";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "OFFICIAL") return "/official/dashboard";
    return "/citizen/dashboard";
  };

  const getRoleLabel = () => {
    if (!user) return "";
    if (user.role === "ADMIN") return isBangla ? "সিস্টেম অ্যাডমিন" : "System Admin";
    if (user.role === "OFFICIAL") return isBangla ? "ভূমি কর্মকর্তা" : "Land Official";
    return isBangla ? "নাগরিক" : "Citizen";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Government Disclaimer & Prototype Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">
              {isBangla
                ? "ল্যান্ডটেক ২০২৬ পাইলট প্রোটোটাইপ • সমস্যা ৩: জালিয়াতি ও দ্বৈত বিক্রয় শনাক্তকরণ"
                : "LandTech 2026 Pilot Prototype • Problem 3: Fraud & Double-Selling Detection"}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {isBangla
              ? "সিন্থেটিক ডেমো ডেটাসেট • কোনো বাস্তব নাগরিক উপাত্ত নয়"
              : "Synthetic Demonstration Dataset • No Real Citizen Data"}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  {isBangla ? "ল্যান্ডট্রেস" : "LandTrace"}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  {isBangla ? "পি৩ সিস্টেম" : "P3 Engine"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isBangla
                  ? "ভূমি রেকর্ড যাচাইকরণ ও সিদ্ধান্ত সহায়তা"
                  : "Land Record Verification & Decision Support"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-teal-700 bg-teal-50/80 font-semibold"
                      : "text-slate-600 hover:text-teal-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                  <span>{isBangla ? link.labelBn : link.labelEn}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Controls (Language & Auth) */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              aria-label="Toggle Language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>

            {/* Authenticated User Menu */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href={getDashboardHref()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100/80 text-teal-900 border border-teal-200 text-xs font-medium transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-teal-700" />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-slate-800 line-clamp-1 max-w-[120px]">
                      {user.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-teal-700">{getRoleLabel()}</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title={isBangla ? "লগআউট" : "Logout"}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Guest Login Dropdown */
              <div className="relative">
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isBangla ? "লগইন" : "Login"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-teal-200" />
                </button>

                {loginDropdownOpen && (
                  <div
                    onMouseLeave={() => setLoginDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      {isBangla ? "ভূমিকাভিত্তিক লগইন" : "Role-Based Login"}
                    </div>
                    <Link
                      href="/login/citizen"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-semibold">{isBangla ? "নাগরিক প্রবেশদ্বার" : "Citizen Portal"}</div>
                        <div className="text-[10px] text-slate-500">{isBangla ? "জমি ক্রেতা / ওয়ারিশ" : "Buyer / Heir"}</div>
                      </div>
                    </Link>
                    <Link
                      href="/login/official"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <div>
                        <div className="font-semibold">{isBangla ? "ভূমি কর্মকর্তা প্রবেশদ্বার" : "Land Official"}</div>
                        <div className="text-[10px] text-slate-500">{isBangla ? "এসি ল্যান্ড / সাব-রেজিস্ট্রার" : "AC Land / Sub-Registrar"}</div>
                      </div>
                    </Link>
                    <Link
                      href="/login/admin"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-slate-700" />
                      <div>
                        <div className="font-semibold">{isBangla ? "সিস্টেম অ্যাডমিন" : "System Admin"}</div>
                        <div className="text-[10px] text-slate-500">{isBangla ? "ব্যবহারকারী ও অডিট ব্যবস্থাপনা" : "Users & Audit Management"}</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu & Language Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700"
            >
              {lang === "bn" ? "EN" : "বাং"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? "text-teal-700 bg-teal-50" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span>{isBangla ? link.labelBn : link.labelEn}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-200 space-y-1">
              {user ? (
                <>
                  <Link
                    href={getDashboardHref()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-teal-800 bg-teal-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-teal-700" />
                    <span>{isBangla ? "ড্যাশবোর্ড প্রবেশ করুন" : "Access Dashboard"}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isBangla ? "লগআউট" : "Logout"}</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <Link
                    href="/login/citizen"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-2 py-2 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700 hover:bg-teal-50"
                  >
                    {isBangla ? "নাগরিক" : "Citizen"}
                  </Link>
                  <Link
                    href="/login/official"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-2 py-2 rounded-md bg-teal-50 text-[11px] font-semibold text-teal-800 hover:bg-teal-100"
                  >
                    {isBangla ? "কর্মকর্তা" : "Official"}
                  </Link>
                  <Link
                    href="/login/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-2 py-2 rounded-md bg-slate-800 text-[11px] font-semibold text-white hover:bg-slate-900"
                  >
                    {isBangla ? "অ্যাডমিন" : "Admin"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
