"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Language,
  STORAGE_KEY,
  translations,
  formatNumber,
  formatArea,
  formatScore,
  formatDate,
  formatTime,
  getAnomalyTypeLabel,
  getSeverityLabel,
  getRecommendedAction,
} from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  isBangla: boolean;
  formatNum: (val: number | string) => string;
  formatLandArea: (area: number | string) => string;
  formatRiskScore: (score: number) => string;
  formatDt: (date: string | Date | undefined) => string;
  formatTm: (date: string | Date | undefined) => string;
  getAnomalyLabel: (type: string) => string;
  getSeverityText: (sev: string) => string;
  getRecommendedStep: (anomalyType: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
        if (saved === "bn" || saved === "en") return saved;
      } catch {}
    }
    return "bn";
  });

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
      window.dispatchEvent(new Event("landtrace-lang-changed"));
    } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "bn" ? "en" : "bn");
  }, [lang, setLang]);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[lang] as unknown as Record<string, string>;
      if (dict && dict[key]) {
        return dict[key];
      }
      const fallbackDict = translations.bn as unknown as Record<string, string>;
      return fallbackDict[key] || key;
    },
    [lang]
  );

  const formatNum = useCallback((val: number | string) => formatNumber(val, lang), [lang]);
  const formatLandArea = useCallback((area: number | string) => formatArea(area, lang), [lang]);
  const formatRiskScore = useCallback((score: number) => formatScore(score, lang), [lang]);
  const formatDt = useCallback((date: string | Date | undefined) => (date ? formatDate(date, lang) : ""), [lang]);
  const formatTm = useCallback((date: string | Date | undefined) => (date ? formatTime(date, lang) : ""), [lang]);
  const getAnomalyLabel = useCallback((type: string) => getAnomalyTypeLabel(type, lang), [lang]);
  const getSeverityText = useCallback((sev: string) => getSeverityLabel(sev, lang), [lang]);
  const getRecommendedStep = useCallback((anomalyType: string) => getRecommendedAction(anomalyType, lang), [lang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        isBangla: lang === "bn",
        formatNum,
        formatLandArea,
        formatRiskScore,
        formatDt,
        formatTm,
        getAnomalyLabel,
        getSeverityText,
        getRecommendedStep,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
