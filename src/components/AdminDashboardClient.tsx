"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { UserRole } from "@/lib/auth";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string;
  designation?: string;
  permittedPlots: string;
  createdAt: string;
}

interface Props {
  currentUser: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  initialUsers: AdminUser[];
  totalParcelsCount: number;
}

export default function AdminDashboardClient({
  currentUser,
  initialUsers,
  totalParcelsCount,
}: Props) {
  const { isBangla, formatNum } = useLanguage();

  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setFeedback({
          type: "error",
          message: data.error || (isBangla ? "ভূমিকা পরিবর্তন ব্যর্থ হয়েছে।" : "Failed to change role."),
        });
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setFeedback({
          type: "success",
          message: isBangla
            ? `ব্যবহারকারীর ভূমিকা '${newRole}'-এ সফলভাবে হালনাগাদ হয়েছে।`
            : `User role successfully updated to '${newRole}'.`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: isBangla ? "সার্ভার সংযোগ ত্রুটি।" : "Server network error.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    setUpdatingId(userId);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setFeedback({
          type: "error",
          message: data.error || (isBangla ? "অ্যাকাউন্ট স্ট্যাটাস পরিবর্তন ব্যর্থ।" : "Failed to toggle status."),
        });
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: !currentStatus } : u))
        );
        setFeedback({
          type: "success",
          message: isBangla
            ? `অ্যাকাউন্ট সফলভাবে ${!currentStatus ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে।`
            : `Account successfully ${!currentStatus ? "activated" : "deactivated"}.`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: isBangla ? "সার্ভার সংযোগ ত্রুটি।" : "Server network error.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.designation && u.designation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentUser.name}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {isBangla ? "সিস্টেম অ্যাডমিনিস্ট্রেটর" : "System Administrator"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser.email} • {isBangla ? "নিরাপত্তা ও ব্যবহারকারী নিয়ন্ত্রণ কেন্দ্র" : "Security & Access Governance"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>{isBangla ? "সার্ভার অডিট সক্রিয়" : "Tamper-Evident Audit Active"}</span>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">
            {isBangla ? "নিবন্ধিত ব্যবহারকারী" : "Registered Users"}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {formatNum(users.length)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isBangla ? "ডাটাবেজ সংরক্ষিত অ্যাকাউন্ট" : "Database Stored Accounts"}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-emerald-700 font-medium block mb-1">
            {isBangla ? "সক্রিয় অ্যাকাউন্ট" : "Active Accounts"}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
            {formatNum(users.filter((u) => u.isActive).length)}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">
            {isBangla ? "অনুমোদিত ও ভেরিফায়েড" : "Authorized & Permitted"}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-teal-700 font-medium block mb-1">
            {isBangla ? "মোট ক্যাডাস্ট্রাল প্লট" : "Total Cadastral Parcels"}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono">
            {formatNum(totalParcelsCount)}
          </div>
          <span className="text-[11px] text-teal-600/80 mt-1 block">
            {isBangla ? "ঐতিহাসিক সিএস-বিএস রেকর্ড" : "Historic CS-BS Records"}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-amber-700 font-medium block mb-1">
            {isBangla ? "পি৩ শনাক্তকরণ ইঞ্জিন" : "P3 Detection Rules"}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono">
            {formatNum(5)}/৫
          </div>
          <span className="text-[11px] text-amber-600/80 mt-1 block">
            {isBangla ? "সকল অ্যালগরিদম সক্রিয়" : "All Algorithms Active"}
          </span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in duration-150 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* User Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-700" />
              <span>{isBangla ? "ব্যবহারকারী ও ভূমিকা ব্যবস্থাপনা" : "User & Role Access Governance"}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBangla
                ? "সার্ভার-সাইড রোল বরাদ্দ ও অ্যাকাউন্ট সক্রিয়/নিষ্ক্রিয় নিয়ন্ত্রণ"
                : "Manage server-side role assignment and account activation status"}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBangla ? "ব্যবহারকারী খুঁজুন..." : "Filter users..."}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">{isBangla ? "ব্যবহারকারী" : "User"}</th>
                <th className="px-4 py-3">{isBangla ? "পদবি / দায়িত্ব" : "Designation"}</th>
                <th className="px-4 py-3">{isBangla ? "ভূমিকা (Role)" : "Assigned Role"}</th>
                <th className="px-4 py-3">{isBangla ? "অনুমোদিত প্লট" : "Permitted Plots"}</th>
                <th className="px-4 py-3">{isBangla ? "স্থিতি (Status)" : "Account Status"}</th>
                <th className="px-4 py-3 text-right">{isBangla ? "অ্যাকশন" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isSelf = u.id === currentUser.id;
                const isBusy = updatingId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {isSelf && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            {isBangla ? "আপনি" : "You"}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {u.designation || (isBangla ? "সাধারণ নাগরিক" : "Citizen")}
                    </td>

                    <td className="px-4 py-3">
                      <select
                        disabled={isBusy}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                          u.role === "ADMIN"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : u.role === "OFFICIAL"
                            ? "bg-teal-50 text-teal-800 border-teal-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        <option value="CITIZEN">{isBangla ? "নাগরিক (Citizen)" : "Citizen"}</option>
                        <option value="OFFICIAL">{isBangla ? "ভূমি কর্মকর্তা (Official)" : "Land Official"}</option>
                        <option value="ADMIN">{isBangla ? "সিস্টেম অ্যাডমিন (Admin)" : "System Admin"}</option>
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                        {u.permittedPlots}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isActive ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        <span>
                          {u.isActive
                            ? isBangla
                              ? "সক্রিয়"
                              : "Active"
                            : isBangla
                            ? "নিষ্ক্রিয়"
                            : "Deactivated"}
                        </span>
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        disabled={isBusy || (isSelf && u.isActive)}
                        onClick={() => handleStatusToggle(u.id, u.isActive)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer ${
                          u.isActive
                            ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {u.isActive
                          ? isBangla
                            ? "নিষ্ক্রিয় করুন"
                            : "Deactivate"
                          : isBangla
                          ? "সক্রিয় করুন"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
