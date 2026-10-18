/**
 * LandTrace - Localization (i18n) Engine
 * Natural Bangladesh Land Administration Terminology & Bi-directional Formatter
 */

export type Language = "bn" | "en";

export const STORAGE_KEY = "landtrace_lang";

/**
 * Converts English digits (0-9) to Bangla digits (০-৯).
 * Leaves all non-digit characters unchanged.
 */
export function toBanglaDigits(input: string | number): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(input).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)]);
}

/**
 * Formats a generic number for display.
 * If Bangla, converts to Bangla digits; if English, leaves as English.
 */
export function formatNumber(value: number | string, lang: Language): string {
  const str = String(value);
  return lang === "bn" ? toBanglaDigits(str) : str;
}

/**
 * Formats land area with decimals unit.
 * Example: "12.50 শতাংশ" or "12.50 decimals"
 */
export function formatArea(area: number | string, lang: Language): string {
  const numStr = typeof area === "number" ? area.toFixed(area % 1 === 0 ? 1 : 2) : String(area);
  const formatted = lang === "bn" ? toBanglaDigits(numStr) : numStr;
  const unit = lang === "bn" ? "শতাংশ" : "decimals";
  return `${formatted} ${unit}`;
}

/**
 * Formats a risk score: e.g. "৮৫/১০০" vs "85/100"
 */
export function formatScore(score: number, lang: Language): string {
  if (lang === "bn") {
    return `${toBanglaDigits(score)}/${toBanglaDigits(100)}`;
  }
  return `${score}/100`;
}

const BANGLA_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const ENGLISH_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Formats a date into a localized date string.
 * Example (bn): "১৫ মার্চ ২০১৫" or "১৫/০৮/২০১৫"
 * Example (en): "15 Aug 2015" or "08/15/2015"
 */
export function formatDate(dateInput: string | Date, lang: Language, format: "short" | "full" = "short"): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    if (lang === "bn") {
      if (format === "full") {
        return `${toBanglaDigits(day)} ${BANGLA_MONTHS[month]} ${toBanglaDigits(year)}`;
      }
      const padDay = day < 10 ? `০${toBanglaDigits(day)}` : toBanglaDigits(day);
      const padMonth = month + 1 < 10 ? `০${toBanglaDigits(month + 1)}` : toBanglaDigits(month + 1);
      return `${padDay}/${padMonth}/${toBanglaDigits(year)}`;
    } else {
      if (format === "full") {
        return `${ENGLISH_MONTHS[month]} ${day}, ${year}`;
      }
      const padDay = day < 10 ? `0${day}` : `${day}`;
      const padMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
      return `${padMonth}/${padDay}/${year}`;
    }
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats a time string into localized Bangla/English time.
 */
export function formatTime(dateOrTime: Date | string, lang: Language): string {
  try {
    const d = typeof dateOrTime === "string" && !dateOrTime.includes(":") ? new Date(dateOrTime) : new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const isPm = hours >= 12;
    hours = hours % 12 || 12;

    const padHours = hours < 10 ? (lang === "bn" ? `০${toBanglaDigits(hours)}` : `0${hours}`) : (lang === "bn" ? toBanglaDigits(hours) : `${hours}`);
    const padMin = minutes < 10 ? (lang === "bn" ? `০${toBanglaDigits(minutes)}` : `0${minutes}`) : (lang === "bn" ? toBanglaDigits(minutes) : `${minutes}`);

    if (lang === "bn") {
      const period = isPm ? "অপরাহ্ন" : "পূর্বাহ্ন";
      return `${padHours}:${padMin} ${period}`;
    }
    const period = isPm ? "PM" : "AM";
    return `${padHours}:${padMin} ${period}`;
  } catch {
    return String(dateOrTime);
  }
}

/**
 * Localizes anomaly types into natural titles and tags.
 */
export function getAnomalyTypeLabel(type: string, lang: Language): string {
  const labels: Record<string, { bn: string; en: string }> = {
    DOUBLE_SELLING: {
      bn: "দ্বৈত বিক্রয় (পরবর্তী অবৈধ হস্তান্তর)",
      en: "Double Selling (Subsequent Alienation)",
    },
    CHAIN_BREAK: {
      bn: "স্বত্ব ধারাবাহিকতা বিচ্ছিন্ন",
      en: "Ownership Chain Break",
    },
    AREA_MISMATCH: {
      bn: "খতিয়ান বনাম দলিল পরিমাপ অসঙ্গতি",
      en: "Khatian vs. Deed Area Discrepancy",
    },
    DEED_MUTATION_MISMATCH: {
      bn: "দলিল ও অনুমোদিত নামজারি অমিল",
      en: "Deed vs. Mutation Inconsistency",
    },
    TIMING_ANOMALY: {
      bn: "সময়ানুক্রমিক অসঙ্গতি / দ্রুত হস্তান্তর",
      en: "Suspicious Rapid Turnover / Timing Anomaly",
    },
  };
  return labels[type]?.[lang] || (lang === "bn" ? "অসঙ্গতিপূর্ণ রেকর্ড" : "Contradiction Flagged");
}

/**
 * Severity label translations
 */
export function getSeverityLabel(severity: string, lang: Language): string {
  const map: Record<string, { bn: string; en: string }> = {
    CRITICAL: { bn: "মারাত্মক (CRITICAL)", en: "CRITICAL" },
    HIGH: { bn: "উচ্চ (HIGH)", en: "HIGH" },
    MEDIUM: { bn: "মাঝারি (MEDIUM)", en: "MEDIUM" },
    LOW: { bn: "নিম্ন (LOW)", en: "LOW" },
  };
  return map[severity]?.[lang] || severity;
}

/**
 * Returns human-review recommended actions for detected anomalies
 */
export function getRecommendedAction(anomalyType: string, lang: Language): string {
  const recommendations: Record<string, { bn: string; en: string }> = {
    DOUBLE_SELLING: {
      bn: "উপজেলা সাব-রেজিস্ট্রারের বালাম বই তল্লাশি এবং সরেজমিন দখলদারিত্ব অনুসন্ধানের নির্দেশ দিন।",
      en: "Order Sub-Registry volume register inspection and on-site physical possession inquiry.",
    },
    CHAIN_BREAK: {
      bn: "মূল সিএস/এসএ রেকর্ড ও ওয়ারিশান সনদপত্র যাচাই না হওয়া পর্যন্ত নামজারি স্থগিত রাখুন।",
      en: "Withhold mutation pending verification of root CS/SA records and legal heirship certificates.",
    },
    AREA_MISMATCH: {
      bn: "উপজেলা কানুনগো / সার্ভেয়ার দ্বারা ডিজিটাল নকশা ও সরেজমিন সীমানা পরিমাপের নির্দেশ দিন।",
      en: "Depute Kanungo / Surveyor for digital cadastral map verification and physical boundary demarcation.",
    },
    DEED_MUTATION_MISMATCH: {
      bn: "খারিজ নথির সহকারী নথি ও সাব-রেজিস্ট্রির মূল বালাম বই তলব করে শুনানি গ্রহণ করুন।",
      en: "Summon AC (Land) case records and Sub-Registry volume register for comparative hearing.",
    },
    TIMING_ANOMALY: {
      bn: "স্বত্ব অর্জনের পূর্ববর্তী হস্তান্তর সংক্রান্ত ভুয়া বা যোগসাজশকৃত দলিলের নিরপেক্ষ তদন্ত করুন।",
      en: "Investigate potential fraudulent collusion or anachronistic conveyance prior to title acquisition.",
    },
  };
  return (
    recommendations[anomalyType]?.[lang] ||
    (lang === "bn"
      ? "নথি পর্যালোচনা ও সহকারী কমিশনার (ভূমি) দ্বারা শুনানির ব্যবস্থা গ্রহণ করুন।"
      : "Schedule case dossier review and hearing before Assistant Commissioner (Land).")
  );
}

/**
 * Centralized UI Translations Dictionary
 */
export const translations = {
  bn: {
    // Top Bar & Branding
    appName: "ল্যান্ডট্রেস (LandTrace)",
    tagline: "ভূমি রেকর্ড জালিয়াতি ও দ্বৈত বিক্রয় সনাক্তকরণ সিস্টেম",
    badge: "সিদ্ধান্ত-সহায়ক প্ল্যাটফর্ম (P3)",
    govtBadge: "ভূমি মন্ত্রণালয় পাইলট — ল্যান্ডটেক ২০২৬",
    officerLabel: "কর্মকর্তা: সহকারী কমিশনার (ভূমি) / সাব-রেজিস্ট্রার",
    officerId: "আইডি: ACL-DH-2026",
    dbConnected: "নিয়ন পোস্টগ্রেস সক্রিয়",
    syntheticNotice: "নমুনা/সিন্থেটিক ডেটা — কোনো বাস্তব নাগরিক তথ্য ব্যবহৃত হয়নি",
    legalDisclaimer:
      "আইনি সতর্কবার্তা: ল্যান্ডট্রেস একটি বিশ্লেষণমূলক সিদ্ধান্ত-সহায়ক প্ল্যাটফর্ম। এটি আইনি মালিকানা নির্ধারণ করে না বা বিচারিক আদেশ প্রদান করে না।",

    // Roles & Auth
    roleCitizen: "নাগরিক (Citizen)",
    roleOfficial: "ভূমি কর্মকর্তা (Land Official)",
    roleAdmin: "সিস্টেম অ্যাডমিন (Administrator)",
    currentRole: "বর্তমান ব্যবহারকারী:",
    loginBtn: "লগইন করুন",
    logoutBtn: "লগআউট",
    registerBtn: "নাগরিক নিবন্ধন",
    quickDemoRolesTitle: "ডেমো রোল পরিবর্তন (১-ক্লিক পরীক্ষক সুইচ):",
    switchRoleNote: "বিচারক ও পরীক্ষকদের জন্য তাৎক্ষণিক ৩টি ভূমিকার ডেমো অ্যাকাউন্ট প্রস্তুত করা আছে।",
    demoCitizenBtn: "👤 নাগরিক ডেমো",
    demoOfficerBtn: "🏛️ ভূমি কর্মকর্তা ডেমো",
    demoAdminBtn: "🛡️ সিস্টেম অ্যাডমিন ডেমো",
    loginModalTitle: "ল্যান্ডট্রেস নিরাপত্তা প্রবেশদ্বার",
    loginSubtitle: "আপনার সংরক্ষিত প্রাতিষ্ঠানিক বা নাগরিক অ্যাকাউন্ট দিয়ে প্রবেশ করুন",
    registerModalTitle: "নতুন নাগরিক অ্যাকাউন্ট নিবন্ধন",
    registerSubtitle: "জমি ক্রেতা বা ওয়ারিশ হিসেবে আপনার খতিয়ান ও দলিলের নিরাপত্তা যাচাই করুন",
    emailLabel: "ইমেইল ঠিকানা",
    passwordLabel: "গোপন পাসওয়ার্ড",
    nameLabel: "পূর্ণ নাম",
    phoneLabel: "মোবাইল নম্বর",
    roleLabel: "সিস্টেম পদমর্যাদা / ভূমিকা",
    submitLogin: "নিরাপদে প্রবেশ করুন",
    submitRegister: "অ্যাকাউন্ট তৈরি করুন",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন",
    needAccount: "নতুন নাগরিক? এখানে নিবন্ধন করুন",
    authTabCitizen: "নাগরিক লগইন",
    authTabOfficial: "ভূমি কর্মকর্তা লগইন",
    authTabAdmin: "প্রশাসক লগইন",
    fillDemoCredentialsBtn: "ডেমো তথ্য বসান",
    citizenRegOnlyNotice: "পাবলিক রেজিস্ট্রেশন শুধুমাত্র নাগরিক অ্যাকাউন্টের জন্য উন্মুক্ত। কর্মকর্তা বা অ্যাডমিন পদবী সার্ভারে সংরক্ষিত।",
    showPasswordLabel: "পাসওয়ার্ড দেখুন",
    hidePasswordLabel: "পাসওয়ার্ড লুকান",

    // Navigation Tabs
    tabHome: "হোমপেজ",
    tabDashboard: "রেকর্ড ও অনুসন্ধান ড্যাশবোর্ড",
    tabInvestigation: "তদন্ত বিবরণী ও ফরেনসিক বিশ্লেষণ",
    tabTransferCheck: "রেজিস্ট্রেশন পূর্ববর্তী ঝুঁকি যাচাই",
    tabAlerts: "শনাক্তকৃত সকল অসঙ্গতি",
    tabAdmin: "ব্যবহারকারী ও নিরাপত্তা ব্যবস্থাপনা",

    // Public Homepage (Layer 1)
    homeHeroBadge: "ল্যান্ডটেক ২০২৬ — সমস্যা ৩: জালিয়াতি ও দ্বৈত বিক্রয় শনাক্তকরণ",
    homeHeroTitle: "ভূমির মালিকানা ধারাবাহিকতা যাচাই ও দ্বৈত বিক্রয় স্বয়ংক্রিয় নিরীক্ষা",
    homeHeroSubtitle: "সিএস, এসএ, আরএস, বিএস জরিপ ও রেজিস্ট্রার্ড দলিলের ধারাবাহিকতা মিলিয়ে জমির জালিয়াতি ও মালিকানা সংকট রোধে আধুনিক সিদ্ধান্ত-সহায়ক প্ল্যাটফর্ম।",
    homeVerifyCta: "জমির রেকর্ড যাচাই করুন",
    homeExploreRolesCta: "ভূমিকাভিত্তিক পোর্টাল নির্বাচন করুন",
    homeQuickSearchTitle: "তাৎক্ষণিক পাবলিক রেকর্ড যাচাইকরণ",
    homeQuickSearchSubtitle: "মৌজার দাগ নম্বর, খতিয়ান বা দলিল লিখে প্রাথমিক স্থিতি পরীক্ষা করুন",
    homeQuickSearchPlaceholder: "দাগ নম্বর (যেমন: দাগ ১০১, PLOT-DH-1001), খতিয়ান বা দলিল লিখুন...",
    homeQuickVerifyBtn: "যাচাই করুন",
    homeSampleQueriesLabel: "নমুনা পরীক্ষামূলক দাগ:",
    homePublicResultTitle: "পাবলিক রেকর্ড সারাংশ",
    homePublicResultPrompt: "সম্পূর্ণ মালিকানা চেইন, পূর্ববর্তী জরিপ ইতিহাস এবং ফরেনসিক বিশ্লেষণ দেখতে আপনার অ্যাকাউন্টে লগইন করুন।",
    homeLoginToInspectBtn: "লগইন করে সম্পূর্ণ ডসিয়ার দেখুন",
    homeHowItWorksTitle: "যাচাইকরণ প্রক্রিয়া যেভাবে কাজ করে",
    homeHowItWorksSubtitle: "৩টি সহজ ধাপে জমির মালিকানা ও দলিলের সত্যতা নিশ্চিতকরণ",
    homeStep1Title: "১. রেকর্ড ও দাগ নম্বর অনুসন্ধান",
    homeStep1Desc: "নির্দিষ্ট মৌজার দাগ নম্বর, খতিয়ান বা সাব-রেজিস্ট্রি দলিল নম্বর ইনপুট দিয়ে স্বয়ংক্রিয় যাচাই শুরু করুন।",
    homeStep2Title: "২. ধারাবাহিক মালিকানা ও খতিয়ান মিলকরণ",
    homeStep2Desc: "মূল জরিপ খতিয়ান থেকে শুরু করে প্রতিটি ক্রয় দলিল, হস্তান্তরকৃত জমির পরিমাণ ও এসি ল্যান্ড নামজারি মেলানো হয়।",
    homeStep3Title: "৩. স্বয়ংক্রিয় অসঙ্গতি ও জালিয়াতি শনাক্তকরণ",
    homeStep3Desc: "দ্বৈত বিক্রয়, চেইনের বিচ্ছিন্নতা, পরিমাপের অমিল এবং অস্বাভাবিক হস্তান্তরের সময়কালের জন্য তাৎক্ষণিক ঝুঁকি অ্যালার্ট তৈরি হয়।",
    homeP3CapabilitiesTitle: "ল্যান্ডটেক ২০২৬ (সমস্যা ৩) — ৫টি প্রধান শনাক্তকরণ প্রযুক্তি",
    homeP3CapabilitiesSubtitle: "ভূমি প্রশাসনের সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের জন্য বিশেষায়িত সিদ্ধান্ত-সহায়ক অ্যালগরিদম",
    p3Cap1Title: "দ্বৈত বিক্রয় শনাক্তকরণ (Double Selling)",
    p3Cap1Desc: "একই বিক্রেতা কর্তৃক পুনঃঅধিগ্রহণ ছাড়া একই জমি একাধিক ক্রেতার নিকট বিক্রির অপচেষ্টা চিহ্নিতকরণ।",
    p3Cap2Title: "মালিকানা চেইনের বিচ্ছিন্নতা (Chain Break)",
    p3Cap2Desc: "পূর্ববর্তী রেকর্ডভুক্ত মালিক ছাড়া মধ্যবর্তী কোনো অননুমোদিত ব্যক্তির নামে দলিলের অসম্পূর্ণ যোগসূত্র শনাক্ত।",
    p3Cap3Title: "জমির পরিমাপের অমিল (Area Mismatch)",
    p3Cap3Desc: "মূল খতিয়ানের প্রাপ্যতা ও দাগের মোট আয়তনের চেয়ে দলিলে অতিরিক্ত জমি হস্তান্তরের চেষ্টা প্রতিহত।",
    p3Cap4Title: "দলিল ও নামজারির অসঙ্গতি (Deed–Mutation Mismatch)",
    p3Cap4Desc: "রেজিস্ট্রিকৃত দলিলের জমির পরিমাণের সাথে এসি ল্যান্ড অফিসের অনুমোদিত খারিজ/নামজারির তথ্যের গরমিল।",
    p3Cap5Title: "অস্বাভাবিক হস্তান্তর সময়কাল (Timing Anomaly)",
    p3Cap5Desc: "স্বত্ব পাওয়ার পূর্বেই বিক্রয় দলিল সম্পাদন বা নামজারি ব্যতিরেকে ৭ দিনের মধ্যে দ্রুত ফ্লিপ হস্তান্তরের সতর্কতা।",
    homePortalsTitle: "ভূমিকাভিত্তিক নিরাপত্তা প্রবেশদ্বার",
    homePortalsSubtitle: "ব্যবহারকারীর দায়িত্ব অনুযায়ী নির্ধারিত অ্যাক্সেস ও কার্যপরিধি",
    citizenPortalTitle: "নাগরিক পোর্টাল",
    citizenPortalDesc: "জমি ক্রেতা, মালিক বা ওয়ারিশ হিসেবে আপনার অনুমোদিত প্লটের ঝুঁকি স্থিতি যাচাই ও রেজিস্ট্রেশন পূর্ববর্তী পরীক্ষা করুন।",
    citizenPortalBtn: "নাগরিক হিসেবে প্রবেশ",
    officerPortalTitle: "ভূমি কর্মকর্তা পোর্টাল",
    officerPortalDesc: "সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রারদের জন্য পূর্ণাঙ্গ রেজিস্ট্রি অনুসন্ধান, ফরেনসিক ডসিয়ার ও কর্মকর্তা নোট।",
    officerPortalBtn: "কর্মকর্তা হিসেবে প্রবেশ",
    adminPortalTitle: "প্রশাসনিক পোর্টাল",
    adminPortalDesc: "ভূমি মন্ত্রণালয় আইসিটি সেলের জন্য ব্যবহারকারী ব্যবস্থাপনা, রোল বরাদ্দ ও অডিট ট্রেইল পর্যবেক্ষণ।",
    adminPortalBtn: "প্রশাসক হিসেবে প্রবেশ",
    homeSyntheticBannerTitle: "কৃত্রিম সিন্থেটিক ডেটা বিজ্ঞপ্তি (Synthetic Data Notice)",
    homeSyntheticBannerDesc: "এই প্ল্যাটফর্মের সকল খতিয়ান, দাগ, দলিল ও ব্যক্তির নাম ল্যান্ডটেক ২০২৬ প্রতিযোগিতার কারিগরি মূল্যায়নের জন্য প্রস্তুতকৃত কৃত্রিম টেস্ট ডেটা। কোনো বাস্তব নাগরিক তথ্য বা সরকারের লাইভ সার্ভারে সরাসরি সংযোগ নেই। এটি একটি স্বাধীন সিদ্ধান্ত-সহায়ক প্রোটোটাইপ।",
    homeFooterTitle: "ল্যান্ডট্রেস — স্মার্ট ভূমি প্রশাসন প্রোটোটাইপ",
    homeFooterDesc: "ল্যান্ডটেক ২০২৬ প্রতিযোগিতার সমস্যা ৩ (P3: Fraud & Double-Selling Detection) সমাধানের অংশ হিসেবে উদ্ভাবিত।",
    homeFooterAboutLabel: "প্রকল্পের লক্ষ্য",
    homeFooterAboutText: "বাংলাদেশ ভূমি ব্যবস্থাপনায় ডিজিটালাইজেশন ও স্বত্ব ধারাবাহিকতা নিশ্চিত করে জালিয়াতি শূন্যে নামিয়ে আনা।",
    homeFooterPrivacyLabel: "গোপনীয়তা ও ডেটা নিরাপত্তা",
    homeFooterPrivacyText: "জিরো লাইভ গভমেন্ট স্ক্র্যাপিং নীতি অনুসৃত। সুরক্ষিত পাসওয়ার্ড হ্যাশিং ও ভূমিকাভিত্তিক এক্সেস নিয়ন্ত্রণ কার্যকর।",
    homeFooterLimitsLabel: "কার্যপরিধি ও সীমাবদ্ধতা",
    homeFooterLimitsText: "ল্যান্ডট্রেস একটি বিশ্লেষণাত্মক সিদ্ধান্ত-সহায়ক টুল। কোনো আদালত বা সাব-রেজিস্ট্রি দলিলের আইনি রায় প্রতিস্থাপন করে না।",
    homeFooterTeamLabel: "ডেভেলপমেন্ট ও টিম",
    homeFooterTeamText: "একক ডেভেলপার: রাফিউল কবির (Rafiul Kabir)। স্ট্যাক: Next.js, Prisma, Neon PostgreSQL, Vercel।",

    // Survey Record History vs Ownership Chain
    surveyHistoryTitle: "জরিপ রেকর্ড ইতিহাস (Survey Record History: CS, SA, RS, BS)",
    surveyHistoryNotice: "দৃষ্টি আকর্ষণ: জরিপ রেকর্ড ও পিঠ খতিয়ান স্বয়ংসম্পূর্ণ ধারাবাহিক মালিকানা স্বত্ব প্রমাণের দলিল নয়। জরিপকালীন দখলদারের নামে খতিয়ান প্রস্তুত হয়েছিল; বিধায় সংশ্লিষ্ট আমলের রেজিস্ট্রার্ড বিক্রয় দলিল, বণ্টননামা ও এসি (ল্যান্ড) নামজারি আদেশ যাচাই করা আবশ্যক।",
    surveyCSLabel: "সিএস জরিপ (Cadastral Survey ~১৯৪০)",
    surveySALabel: "এসএ রেকর্ড (State Acquisition ~১৯৫৬)",
    surveyRSLabel: "আরএস জরিপ (Revisional Survey ~১৯৭২)",
    surveyBSLabel: "বিএস / সিটি জরিপ (City Survey ~১৯৯৮+)",
    surveyStatusRecorded: "রেকর্ডভুক্ত ও সংরক্ষিত",
    surveyStatusPredecessor: "পূর্ববর্তী জরিপ ভিত্তিক",
    surveyStatusRevised: "সংশোধিত ও প্রকাশিত",
    surveyStatusFinal: "চূড়ান্ত প্রকাশিত বিএস খতিয়ান",
    ownershipChainHeader: "মালিকানা হস্তান্তর চেইন (Ownership Transfer Chain)",
    ownershipChainSub: "সাব-রেজিস্ট্রি দলিল ও এসি (ল্যান্ড) নামজারি আদেশের ধারাবাহিক যোগসূত্র",
    chainIntactBadge: "বৈধ ও অবিচ্ছিন্ন হস্তান্তর যোগসূত্র",
    chainBrokenBadge: "বিচ্ছিন্ন বা প্রশ্নবিদ্ধ যোগসূত্র — মূল বালাম ও ওয়ারিশান তলব আবশ্যক",

    // Citizen Dashboard
    citizenWelcomeTitle: "নাগরিক ভূমি ড্যাশবোর্ড",
    citizenWelcomeDesc: "আপনার জাতীয় পরিচয়পত্র ও অনুমোদিত রেজিস্ট্রেশন অনুযায়ী সংরক্ষিত ভূমি রেকর্ডের সারাংশ।",
    citizenMyPlot: "আপনার অনুমোদিত প্লট",
    citizenAuthorizedNotice: "নিরাপত্তা নীতি: নাগরিক হিসেবে আপনি শুধুমাত্র আপনার অনুমোদিত প্লট এবং রেজিস্ট্রেশন পূর্ববর্তী হস্তান্তর সিমুলেটর ব্যবহার করতে পারেন।",

    // Search and Primary Actions
    searchPlaceholder: "দাগ নম্বর (যেমন: PLOT-DH-2045), খতিয়ান, মৌজা বা দলিল দিয়ে খুঁজুন...",
    verifyBtn: "ভূমি রেকর্ড যাচাই করুন",
    filterLabel: "ফিল্টার:",
    allFilter: "সকল রেকর্ড",
    cleanFilter: "বৈধ",
    flaggedFilter: "অসঙ্গতিপূর্ণ",
    showingRecords: (shown: number, total: number) =>
      `মোট ${toBanglaDigits(total)}টি রেকর্ডের মধ্যে ${toBanglaDigits(shown)}টি প্রদর্শিত`,
    emptySearchTitle: "কোনো ভূমি রেকর্ড পাওয়া যায়নি",
    emptySearchDesc: "আপনার অনুসন্ধানকৃত দাগ, খতিয়ান বা দলিলের সাথে মিল পাওয়া যায়নি। অনুসন্ধান পরিবর্তন করে পুনরায় চেষ্টা করুন।",
    resetSearchBtn: "অনুসন্ধান রিসেট করুন",

    // Verification Alerts
    verifyNoticeSuccess: (plot: string) => `যাচাই সম্পন্ন (${plot}): মালিকানা ধারাবাহিকতা বৈধ ও অক্ষুণ্ণ।`,
    verifyNoticeWarning: (plot: string) => `যাচাই সম্পন্ন (${plot}): ৫টি ভেক্টরে সম্ভাব্য অসঙ্গতি চিহ্নিত হয়েছে!`,

    // Summary Metrics
    recordsChecked: "নিরীক্ষিত রেকর্ড",
    recordsCheckedSub: "মোট পরীক্ষিত প্লট",
    cleanRecords: "বৈধ রেকর্ড",
    cleanRecordsSub: "১০০% অক্ষুণ্ণ ধারাবাহিকতা",
    flaggedRecords: "অসঙ্গতিপূর্ণ রেকর্ড",
    flaggedRecordsSub: "তদন্ত পর্যালোচনা প্রয়োজন",

    // Left List
    registryListTitle: "প্লট ও খতিয়ান তালিকা",
    deedsCount: (count: number) => `${toBanglaDigits(count)}টি দলিল`,
    decimals: "শতাংশ",
    cleanStatus: "বৈধ ধারাবাহিকতা",
    flaggedStatus: "ঝুঁকিপূর্ণ / অসঙ্গতিপূর্ণ",
    openDossierBtn: "পূর্ণাঙ্গ তদন্ত রিপোর্ট খুলুন",
    backToDashboard: "ড্যাশবোর্ডে ফিরুন",

    // Investigation Dossier Panel
    dagNumber: "দাগ নম্বর",
    surveyType: "জরিপের ধরন",
    khatian: "খতিয়ান",
    mouza: "মৌজা",
    upazila: "উপজেলা",
    district: "জেলা",
    totalArea: "মোট পরিমাপ",
    currentOwner: "বর্তমান মালিক",
    ownershipShares: "মালিকানা অংশ ও হিস্যা",
    provenance: "রেকর্ডের উৎস ও ঐতিহাসিক ভিত্তি",
    printReport: "তদন্ত সারাংশ মুদ্রণ",
    riskScore: "ঝুঁকি স্কোর",
    riskScoreTitle: "সিদ্ধান্ত-সহায়ক ঝুঁকি স্কোর",
    riskScoreDesc: "৫টি ভেক্টরে ধারাবাহিকতার গাণিতিক অসঙ্গতি বিশ্লেষণ করে স্বয়ংক্রিয়ভাবে নির্ধারিত।",
    criticalRisk: "মারাত্মক ঝুঁকি (Critical Risk)",
    highRisk: "উচ্চ ঝুঁকি (High Risk)",
    mediumRisk: "মাঝারি ঝুঁকি (Medium Risk)",
    cleanRisk: "ঝুঁকিমুক্ত (Clean)",
    contradictionsCount: (count: number) => `${toBanglaDigits(count)}টি অসঙ্গতি চিহ্নিত`,
    recommendedActionTitle: "সুপারিশকৃত অনুসন্ধান পদক্ষেপ:",

    // Area Comparison
    areaComparisonTitle: "পরিমাপের তুলনা (খতিয়ান বনাম দলিল)",
    khatianSurveyArea: "খতিয়ান রেকর্ডকৃত পরিমাপ",
    deedTransferredArea: "সর্বশেষ দলিল পরিমাপ",
    areaMatchStatus: "পরিমাপ স্থিতি",
    areaConsistent: "পরিমাপ সঙ্গতিপূর্ণ (খতিয়ান সীমার মধ্যে)",
    areaExceeded: "পরিমাপ অসঙ্গতিপূর্ণ (খতিয়ানের চেয়ে বেশি)",

    // Anomalies
    anomaliesDetected: "শনাক্তকৃত অসঙ্গতিসমূহ",
    technicalEvidence: "প্রযুক্তিগত প্রমাণ ও প্যারামিটার (প্রসারণযোগ্য)",

    // Chain of Title
    deedTimeline: "মালিকানা ধারাবাহিকতা ও দলিলের সময়রেখা",
    seller: "দাতা (বিক্রেতা)",
    buyer: "গ্রহীতা (ক্রেতা)",
    deedDate: "দলিলের তারিখ",
    registryOffice: "রেজিস্ট্রি অফিস",
    verifiedDeed: "বৈধ দলিল",
    unverifiedDeed: "প্রশ্নবিদ্ধ হস্তান্তর",

    // Mutations
    mutationRecords: "অনুমোদিত নামজারি ও খারিজ রেকর্ড",
    applicant: "আবেদনকারী",
    officer: "অনুমোদনকারী কর্মকর্তা",
    mutationStatus: "নামজারি স্থিতি",
    approved: "অনুমোদিত",

    // Officer Actions
    officerActionsTitle: "কর্মকর্তার সিদ্ধান্ত-সহায়ক পদক্ষেপ",
    actionMarkReview: "পর্যালোচনার জন্য চিহ্নিত",
    actionFieldInquiry: "মাঠ তদন্তে প্রেরণ",
    actionAddNote: "তদন্ত নোট যোগ করুন",
    actionForward: "উর্ধ্বতন কর্তৃপক্ষের নিকট প্রেরণ",
    recentActions: "সাম্প্রতিক কর্মকর্তা পদক্ষেপ ট্রেইল:",
    initialCustodyNote: "প্রাথমিক স্বত্ব ধারাবাহিকতা সিদ্ধান্ত-সহায়ক বাফারে লোড হয়েছে — ACL-DH-2026",
    actionRecordedNotice: (action: string) =>
      `পদক্ষেপ '${action}' ল্যান্ডট্রেস প্রোটোটাইপ সিদ্ধান্ত-সহায়ক বাফারে সংরক্ষিত হয়েছে। (প্রোটোটাইপ টেস্ট ডেটা; কোনো লাইভ সরকারি পোর্টালে সরাসরি প্রেরিত হয়নি)।`,
    citizenRestrictedMsg:
      "বিজ্ঞপ্তি: আপনি নাগরিক হিসেবে প্রবেশ করেছেন। কেবলমাত্র অনুমোদিত ভূমি কর্মকর্তা ও সিস্টেম অ্যাডমিন তদন্ত নোট ও পদক্ষেপ সম্পাদন করতে পারেন।",

    // Pre-Registration Risk Check Simulator
    simTitle: "নতুন দলিল রেজিস্ট্রেশন পূর্ববর্তী ঝুঁকি যাচাই (Pre-Registration Audit)",
    simDesc: "সাব-রেজিস্ট্রি অফিসে দলিল নিবন্ধনের পূর্বে প্রস্তাবিত হস্তান্তরটি ল্যান্ডট্রেস ইঞ্জিনে পরীক্ষা করুন।",
    simSelectPlot: "টার্গেট প্লট নির্বাচন করুন",
    simSellerLabel: "দাতা (বিক্রেতা)",
    simSellerPlaceholder: "যেমন: আব্দুর রশিদ / এনামুল হক",
    simBuyerLabel: "গ্রহীতা (ক্রেতা)",
    simBuyerPlaceholder: "যেমন: নতুন প্রস্তাবিত ক্রেতা",
    simAreaLabel: "প্রস্তাবিত জমির পরিমাপ (শতাংশ)",
    simDateLabel: "দলিলের প্রস্তাবিত তারিখ",
    simTestBtn: "হস্তান্তর ঝুঁকি নিরীক্ষা করুন",
    simPass: "প্রস্তাবিত হস্তান্তর বৈধ: কোনো স্বত্বহীন হস্তান্তর বা পরিমাপের গরমিল নেই।",
    simFail: "সতর্কতা: প্রস্তাবিত হস্তান্তরে অসঙ্গতি সনাক্ত হয়েছে!",
    simReasonChainBreak: (seller: string) =>
      `দাতা '${seller}' উক্ত প্লটের কোনো পূর্ববর্তী ক্রয় দলিল বা খতিয়ানে মালিক হিসেবে নথিভুক্ত নেই (মালিকানা ধারাবাহিকতা বিচ্ছিন্ন)।`,
    simReasonAreaExceeded: (proposed: number, khatianArea: number) =>
      `প্রস্তাবিত জমি (${toBanglaDigits(proposed)} শতাংশ) খতিয়ানের মোট পরিমাপ (${toBanglaDigits(khatianArea)} শতাংশ) অপেক্ষা অধিক (জমির পরিমাপের গরমিল)।`,
    simReasonDoubleSelling: () =>
      "উক্ত দাতা ইতিপূর্বে এই প্লটে জমি হস্তান্তর করেছেন। পুনরায় হস্তান্তর দ্বৈত বিক্রয়ের ঝুঁকি তৈরি করে।",

    // All Alerts Tab
    tabAlertsTitle: "শনাক্তকৃত সকল অসঙ্গতি",
    tabAlertsSubtitle: "৭টি সিন্থেটিক প্লটের মধ্যে সনাক্তকৃত সকল অসঙ্গতির বিস্তারিত তালিকা",
    viewDossierLink: "তদন্ত বিবরণ দেখুন",

    // Admin User Management
    adminTitle: "সিস্টেম প্রশাসন ও ব্যবহারকারী ব্যবস্থাপনা",
    adminSubtitle: "নিবন্ধিত ব্যবহারকারীদের ভূমিকা পরিবর্তন ও অ্যাকাউন্ট সক্রিয়/নিষ্ক্রিয়করণ",
    userColName: "নাম ও পদবি",
    userColEmail: "ইমেইল",
    userColRole: "ভূমিকা (Role)",
    userColStatus: "স্থিতি (Status)",
    userColActions: "অ্যাডমিন অ্যাকশন",
    statusActive: "সক্রিয়",
    statusInactive: "নিষ্ক্রিয়",
    makeOfficialBtn: "ভূমি কর্মকর্তা বানান",
    makeCitizenBtn: "নাগরিক বানান",
    makeAdminBtn: "অ্যাডমিন বানান",
    toggleStatusBtn: "স্থিতি পরিবর্তন",

    // Modals
    noteModalTitle: "তদন্তকারী কর্মকর্তার নোট অন্তর্ভুক্তি",
    notePlaceholder: "রেকর্ড বা সরেজমিন তদন্ত সম্পর্কিত মন্তব্য লিখুন...",
    saveNoteBtn: "নোট সংরক্ষণ করুন",
    cancelBtn: "বাতিল",
    printModalTitle: "সহকারী কমিশনার (ভূমি) তদন্ত সারাংশ প্রতিবেদন",
    printHeaderPlot: "দাগ / Plot",
    printHeaderKhatian: "খতিয়ান / Khatian",
    printHeaderMouza: "মৌজা / Mouza",
    printHeaderDistrict: "জেলা / District",
    printHeaderArea: "মোট পরিমাপ / Area",
    printHeaderOwner: "বর্তমান মালিক",
    printAnomaliesHeader: "সনাক্তকৃত অসঙ্গতিসমূহ:",
    printCleanMessage: "কোনো অসঙ্গতি পাওয়া যায়নি (মালিকানা ধারাবাহিকতা বৈধ)।",
    printActionTrailHeader: "অফিসার অ্যাকশন ট্রেইল:",
    printBtn: "প্রিন্ট করুন",
    closeBtn: "বন্ধ করুন",
  },
  en: {
    // Top Bar & Branding
    appName: "LandTrace",
    tagline: "Automated Land Record Fraud & Double-Selling Detection System",
    badge: "Decision Support System (P3)",
    govtBadge: "Ministry of Land Pilot Project — LandTech 2026",
    officerLabel: "Officer: AC Land / Sub-Registrar",
    officerId: "ID: ACL-DH-2026",
    dbConnected: "Neon PostgreSQL Live",
    syntheticNotice: "Synthetic Demo Data — No real citizen data used",
    legalDisclaimer:
      "Legal Notice: LandTrace is an analytical decision-support system. It does not legally determine title ownership or issue judicial decrees.",

    // Roles & Auth
    roleCitizen: "Citizen",
    roleOfficial: "Land Official",
    roleAdmin: "Administrator",
    currentRole: "Current User:",
    loginBtn: "Sign In",
    logoutBtn: "Sign Out",
    registerBtn: "Citizen Sign Up",
    quickDemoRolesTitle: "Demo Role Switcher (1-Click Judge Switch):",
    switchRoleNote: "Instant pre-configured demo roles prepared for competition evaluation.",
    demoCitizenBtn: "👤 Citizen Demo",
    demoOfficerBtn: "🏛️ Official Demo",
    demoAdminBtn: "🛡️ Admin Demo",
    loginModalTitle: "LandTrace Secure Gateway",
    loginSubtitle: "Sign in with your official or citizen credentials",
    registerModalTitle: "Citizen Registration",
    registerSubtitle: "Verify your land deed security and prevent fraud before registration",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    nameLabel: "Full Name",
    phoneLabel: "Phone Number",
    roleLabel: "System Role",
    submitLogin: "Sign In Securely",
    submitRegister: "Create Account",
    alreadyHaveAccount: "Already registered? Sign in",
    needAccount: "New citizen? Register here",
    authTabCitizen: "Citizen Login",
    authTabOfficial: "Land Official Login",
    authTabAdmin: "Admin Login",
    fillDemoCredentialsBtn: "Auto-fill Demo",
    citizenRegOnlyNotice: "Public self-registration is strictly restricted to Citizen accounts. Official or Admin accounts are server-controlled.",
    showPasswordLabel: "Show password",
    hidePasswordLabel: "Hide password",

    // Navigation Tabs
    tabHome: "Home",
    tabDashboard: "Records & Search Dashboard",
    tabInvestigation: "Forensic Investigation Dossier",
    tabTransferCheck: "Pre-Registration Risk Check",
    tabAlerts: "All Detected Contradictions",
    tabAdmin: "User & Security Management",

    // Public Homepage (Layer 1)
    homeHeroBadge: "LandTech 2026 — Problem P3: Fraud & Double-Selling Detection",
    homeHeroTitle: "Automated Land Ownership Chain & Double-Selling Detection",
    homeHeroSubtitle: "Decision-support system for Assistant Commissioners (Land) and Sub-Registrars analyzing CS, SA, RS, BS surveys and deed chains to prevent land fraud.",
    homeVerifyCta: "Verify Land Record",
    homeExploreRolesCta: "Explore Role Portals",
    homeQuickSearchTitle: "Instant Public Record Verification",
    homeQuickSearchSubtitle: "Enter Mouza Dag number, Khatian, or Deed to check title status",
    homeQuickSearchPlaceholder: "Enter Dag number (e.g., Dag 101, PLOT-DH-1001), Khatian, or Deed...",
    homeQuickVerifyBtn: "Verify Record",
    homeSampleQueriesLabel: "Sample demonstration queries:",
    homePublicResultTitle: "Public Record Summary",
    homePublicResultPrompt: "To inspect the complete title chain, historic survey provenance, and forensic contradiction audit, please log in with an authorized account.",
    homeLoginToInspectBtn: "Sign In to View Full Dossier",
    homeHowItWorksTitle: "How Land Verification Works",
    homeHowItWorksSubtitle: "Three simple steps to verify title continuity and prevent fraudulent alienation",
    homeStep1Title: "1. Search Record & Dag Number",
    homeStep1Desc: "Enter the cadastral Dag number, survey Khatian, or Sub-Registry volume deed number to initiate automated audit.",
    homeStep2Title: "2. Chain of Title & Survey Matching",
    homeStep2Desc: "The engine links root survey Khatians to registered sale deeds, transferred acreages, and approved AC (Land) mutations.",
    homeStep3Title: "3. Automated Anomaly & Fraud Detection",
    homeStep3Desc: "Instant contradiction flags are triggered for double selling, chain breaks, acreage discrepancies, and suspicious turnover timing.",
    homeP3CapabilitiesTitle: "LandTech 2026 (Problem P3) — Five Core Detection Capabilities",
    homeP3CapabilitiesSubtitle: "Specialized algorithmic rules designed for Bangladesh land administration",
    p3Cap1Title: "Double Selling Detection",
    p3Cap1Desc: "Flags subsequent sales by sellers who have already conveyed the parcel without reacquisition.",
    p3Cap2Title: "Ownership Chain Break",
    p3Cap2Desc: "Detects missing grantor links where the seller was never recorded in previous deeds or Khatians.",
    p3Cap3Title: "Area Mismatch",
    p3Cap3Desc: "Identifies deed conveyances that exceed the parent survey Khatian or Dag acreage limits.",
    p3Cap4Title: "Deed–Mutation Mismatch",
    p3Cap4Desc: "Detects inconsistencies between registered deed acreage and approved AC (Land) namjari orders.",
    p3Cap5Title: "Suspicious Transfer Timing",
    p3Cap5Desc: "Flags anachronistic sales (deed executed before grantor acquired title) or rapid flips within 7 days without mutation.",
    homePortalsTitle: "Role-Based Security Gateways",
    homePortalsSubtitle: "Defined access and responsibilities according to user roles",
    citizenPortalTitle: "Citizen Portal",
    citizenPortalDesc: "Verify your designated plot status, title integrity, and test prospective deeds before registration.",
    citizenPortalBtn: "Enter as Citizen",
    officerPortalTitle: "Land Official Portal",
    officerPortalDesc: "Full registry search, forensic dossier inspection, and decision-support actions for AC (Land) and Sub-Registrars.",
    officerPortalBtn: "Enter as Land Official",
    adminPortalTitle: "Administrative Portal",
    adminPortalDesc: "User and security administration, role assignment, and audit trail oversight for ICT Cell.",
    adminPortalBtn: "Enter as Administrator",
    homeSyntheticBannerTitle: "Synthetic Demonstration Data Notice",
    homeSyntheticBannerDesc: "All Khatians, Dags, deeds, and individuals in this platform are synthetic test records created for LandTech 2026 technical evaluation. No real citizen data is used, and no live government servers are modified. LandTrace is an independent decision-support prototype.",
    homeFooterTitle: "LandTrace — Smart Land Administration Prototype",
    homeFooterDesc: "Developed for LandTech 2026, Problem Statement P3: Fraud & Double-Selling Detection.",
    homeFooterAboutLabel: "Project Mission",
    homeFooterAboutText: "Modernizing Bangladesh land records by verifying title custody chains and eliminating fraudulent conveyances.",
    homeFooterPrivacyLabel: "Privacy & Data Security",
    homeFooterPrivacyText: "Strict zero-scraping policy. Secure bcrypt password hashing and server-side role validation enforced.",
    homeFooterLimitsLabel: "Limitations & Decision Support",
    homeFooterLimitsText: "LandTrace is an analytical decision-support tool. It does not replace judicial decrees or statutory registry records.",
    homeFooterTeamLabel: "Development Team",
    homeFooterTeamText: "Solo Developer: Rafiul Kabir. Stack: Next.js 16, TypeScript, Prisma, Neon PostgreSQL, Vercel.",

    // Survey Record History vs Ownership Chain
    surveyHistoryTitle: "Survey Record History (CS, SA, RS, BS)",
    surveyHistoryNotice: "Important: Cadastral survey records alone do not constitute continuous legal ownership title. Surveys recorded physical possession at the time of survey; registered sale deeds and AC (Land) mutation orders must be verified.",
    surveyCSLabel: "CS Survey (Cadastral Survey ~1940)",
    surveySALabel: "SA Record (State Acquisition ~1956)",
    surveyRSLabel: "RS Survey (Revisional Survey ~1972)",
    surveyBSLabel: "BS / City Survey (City Survey ~1998+)",
    surveyStatusRecorded: "Recorded & Preserved",
    surveyStatusPredecessor: "Derived from Predecessor Survey",
    surveyStatusRevised: "Revised & Published",
    surveyStatusFinal: "Final Published BS Khatian",
    ownershipChainHeader: "Ownership Transfer Chain",
    ownershipChainSub: "Chronological chain of Sub-Registry deeds and AC (Land) mutation orders",
    chainIntactBadge: "Valid & Intact Transfer Link",
    chainBrokenBadge: "Broken or Questionable Link — Summon Volume Register & Heirship Proof",

    // Citizen Dashboard
    citizenWelcomeTitle: "Citizen Land Dashboard",
    citizenWelcomeDesc: "Summary of your authorized land records and pre-registration security checks.",
    citizenMyPlot: "Your Designated Plot",
    citizenAuthorizedNotice: "Security Policy: As a citizen, you can view your designated plot records and perform pre-registration transfer risk checks.",

    // Search and Primary Actions
    searchPlaceholder: "Search by plot number (e.g. PLOT-DH-2045), khatian, mouza, or deed...",
    verifyBtn: "Verify Land Record",
    filterLabel: "Filters:",
    allFilter: "All Records",
    cleanFilter: "Clean",
    flaggedFilter: "Flagged",
    showingRecords: (shown: number, total: number) =>
      `Showing ${shown} of ${total} demo records`,
    emptySearchTitle: "No matching land records found",
    emptySearchDesc: "No parcel, khatian, mouza, or deed matched your query. Please adjust your search terms.",
    resetSearchBtn: "Reset Search",

    // Verification Alerts
    verifyNoticeSuccess: (plot: string) => `Verification complete (${plot}): Chain of custody verified clean.`,
    verifyNoticeWarning: (plot: string) => `Verification complete (${plot}): Contradictions flagged across analytical vectors!`,

    // Summary Metrics
    recordsChecked: "Records Checked",
    recordsCheckedSub: "Total Seed Parcels",
    cleanRecords: "Clean Records",
    cleanRecordsSub: "100% Valid Chain",
    flaggedRecords: "Flagged Records",
    flaggedRecordsSub: "Requiring Review",

    // Left List
    registryListTitle: "Parcel & Khatian Registry",
    deedsCount: (count: number) => `${count} deeds`,
    decimals: "decimals",
    cleanStatus: "Clean Custody",
    flaggedStatus: "Flagged Anomaly",
    openDossierBtn: "Open Full Investigation Dossier",
    backToDashboard: "Back to Dashboard",

    // Investigation Dossier Panel
    dagNumber: "Dag No.",
    surveyType: "Survey Type",
    khatian: "Khatian",
    mouza: "Mouza",
    upazila: "Upazila",
    district: "District",
    totalArea: "Recorded Total Area",
    currentOwner: "Recorded Owner",
    ownershipShares: "Ownership Shares & Co-owners",
    provenance: "Cadastral Provenance & Historical Root",
    printReport: "Print Dossier",
    riskScore: "Risk Score",
    riskScoreTitle: "Decision-Support Risk Score",
    riskScoreDesc: "Calculated dynamically based on topological contradictions across 5 rules.",
    criticalRisk: "Critical Risk",
    highRisk: "High Risk",
    mediumRisk: "Medium Risk",
    cleanRisk: "Clean",
    contradictionsCount: (count: number) => `${count} contradictions flagged`,
    recommendedActionTitle: "Recommended Human Review Action:",

    // Area Comparison
    areaComparisonTitle: "Area Comparison (Khatian vs. Deed)",
    khatianSurveyArea: "Khatian Survey Area",
    deedTransferredArea: "Deed Transferred Area",
    areaMatchStatus: "Area Boundary Status",
    areaConsistent: "Consistent (Within Khatian Boundary)",
    areaExceeded: "Discrepancy (Exceeds Khatian Boundary)",

    // Anomalies
    anomaliesDetected: "Detected Contradictions",
    technicalEvidence: "Technical Evidence & Parameters (Expandable)",

    // Chain of Title
    deedTimeline: "Chain of Title & Deed Chronology",
    seller: "Seller / Grantor",
    buyer: "Buyer / Grantee",
    deedDate: "Deed Date",
    registryOffice: "Registry Office",
    verifiedDeed: "Verified Clean",
    unverifiedDeed: "Flagged Transfer",

    // Mutations
    mutationRecords: "Approved Mutation / Namjari Records",
    applicant: "Applicant",
    officer: "Approving Officer",
    mutationStatus: "Status",
    approved: "APPROVED",

    // Officer Actions
    officerActionsTitle: "Officer Review Actions",
    actionMarkReview: "Mark for Review",
    actionFieldInquiry: "Send for Field Inquiry",
    actionAddNote: "Add Investigation Note",
    actionForward: "Forward for Review",
    recentActions: "Officer Action Trail:",
    initialCustodyNote: "Initial custody chain loaded into decision-support buffer — ACL-DH-2026",
    actionRecordedNotice: (action: string) =>
      `Action '${action}' recorded in LandTrace prototype decision buffer. (Prototype test data; not transmitted to external government servers).`,
    citizenRestrictedMsg:
      "Notice: You are logged in as a Citizen. Officer review actions and notes are restricted to authorized Land Officials and System Administrators.",

    // Pre-Registration Risk Check Simulator
    simTitle: "Pre-Registration Transfer Risk Check",
    simDesc: "Audit a proposed transfer against the title custody graph prior to deed execution.",
    simSelectPlot: "Select Target Plot",
    simSellerLabel: "Seller / Grantor",
    simSellerPlaceholder: "e.g. Abdur Rashid / Enamul Haque",
    simBuyerLabel: "Buyer / Grantee",
    simBuyerPlaceholder: "e.g. New Prospective Buyer",
    simAreaLabel: "Proposed Area (Decimals)",
    simDateLabel: "Proposed Deed Date",
    simTestBtn: "Run Transfer Risk Audit",
    simPass: "Proposed Transfer Clean: No title break or boundary excess detected.",
    simFail: "Warning: Contradictions detected in proposed transfer!",
    simReasonChainBreak: (seller: string) =>
      `Seller '${seller}' has no preceding recorded deed or khatian title in the chain of custody (Chain Break).`,
    simReasonAreaExceeded: (proposed: number, khatianArea: number) =>
      `Proposed area (${proposed} dec) exceeds parent survey khatian boundary (${khatianArea} dec) (Area Mismatch).`,
    simReasonDoubleSelling: () =>
      "This grantor has previously alienated title on this plot. Potential Double Selling contradiction.",

    // All Alerts Tab
    tabAlertsTitle: "All Detected Contradictions",
    tabAlertsSubtitle: "Comprehensive breakdown of contradictions flagged across the 7 synthetic test parcels",
    viewDossierLink: "View Dossier",

    // Admin User Management
    adminTitle: "System Administration & User Management",
    adminSubtitle: "Manage registered user accounts, assign permitted roles, and activate/deactivate accounts",
    userColName: "Name & Designation",
    userColEmail: "Email",
    userColRole: "Role",
    userColStatus: "Status",
    userColActions: "Admin Actions",
    statusActive: "Active",
    statusInactive: "Inactive",
    makeOfficialBtn: "Promote to Official",
    makeCitizenBtn: "Set as Citizen",
    makeAdminBtn: "Promote to Admin",
    toggleStatusBtn: "Toggle Status",

    // Modals
    noteModalTitle: "Add Officer Investigation Note",
    notePlaceholder: "Enter inspection details or field findings...",
    saveNoteBtn: "Save Note",
    cancelBtn: "Cancel",
    printModalTitle: "LandTrace Forensic Investigation Dossier",
    printHeaderPlot: "Plot / দাগ",
    printHeaderKhatian: "Khatian / খতিয়ান",
    printHeaderMouza: "Mouza / মৌজা",
    printHeaderDistrict: "District / জেলা",
    printHeaderArea: "Area / মোট পরিমাপ",
    printHeaderOwner: "Recorded Owner / বর্তমান মালিক",
    printAnomaliesHeader: "Detected Contradictions:",
    printCleanMessage: "Zero anomalies detected (Chain of Title Verified Clean).",
    printActionTrailHeader: "Recorded Officer Action Trail:",
    printBtn: "Print Dossier",
    closeBtn: "Close",
  },
};
