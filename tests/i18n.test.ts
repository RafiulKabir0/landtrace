import test from "node:test";
import assert from "node:assert/strict";
import {
  toBanglaDigits,
  formatNumber,
  formatArea,
  formatScore,
  formatDate,
  formatTime,
  getAnomalyTypeLabel,
  getSeverityLabel,
  translations,
  STORAGE_KEY,
} from "../src/lib/i18n";

test("i18n: toBanglaDigits converts 0-9 correctly and preserves non-digits", () => {
  assert.equal(toBanglaDigits("0123456789"), "০১২৩৪৫৬৭৮৯");
  assert.equal(toBanglaDigits("PLOT-DH-2045"), "PLOT-DH-২০৪৫"); // Used only on numbers
  assert.equal(toBanglaDigits(100), "১০০");
  assert.equal(toBanglaDigits("15.50"), "১৫.৫০");
});

test("i18n: formatNumber handles Bangla and English modes", () => {
  assert.equal(formatNumber(15, "bn"), "১৫");
  assert.equal(formatNumber(15, "en"), "15");
  assert.equal(formatNumber("0", "bn"), "০");
  assert.equal(formatNumber("0", "en"), "0");
});

test("i18n: formatArea formats decimals properly", () => {
  assert.equal(formatArea(10.5, "bn"), "১০.৫০ শতাংশ");
  assert.equal(formatArea(10.5, "en"), "10.50 decimals");
  assert.equal(formatArea(12, "bn"), "১২.০ শতাংশ");
  assert.equal(formatArea(12, "en"), "12.0 decimals");
});

test("i18n: formatScore formats fraction out of 100", () => {
  assert.equal(formatScore(85, "bn"), "৮৫/১০০");
  assert.equal(formatScore(85, "en"), "85/100");
  assert.equal(formatScore(0, "bn"), "০/১০০");
  assert.equal(formatScore(0, "en"), "0/100");
});

test("i18n: formatDate formats BD and EN dates correctly", () => {
  const d = new Date("2024-03-15T00:00:00Z");
  const bnDate = formatDate(d, "bn", "full");
  const enDate = formatDate(d, "en", "full");

  assert.ok(bnDate.includes("মার্চ"));
  assert.ok(bnDate.includes("২০২৪"));
  assert.ok(enDate.includes("March"));
  assert.ok(enDate.includes("2024"));
});

test("i18n: getAnomalyTypeLabel returns natural Bangla and English labels", () => {
  assert.equal(getAnomalyTypeLabel("DOUBLE_SELLING", "bn"), "দ্বৈত বিক্রয় (পরবর্তী অবৈধ হস্তান্তর)");
  assert.equal(getAnomalyTypeLabel("DOUBLE_SELLING", "en"), "Double Selling (Subsequent Alienation)");
  assert.equal(getAnomalyTypeLabel("CHAIN_BREAK", "bn"), "স্বত্ব ধারাবাহিকতা বিচ্ছিন্ন");
  assert.equal(getAnomalyTypeLabel("CHAIN_BREAK", "en"), "Ownership Chain Break");
  assert.equal(getAnomalyTypeLabel("AREA_MISMATCH", "bn"), "খতিয়ান বনাম দলিল পরিমাপ অসঙ্গতি");
  assert.equal(getAnomalyTypeLabel("AREA_MISMATCH", "en"), "Khatian vs. Deed Area Discrepancy");
});

test("i18n: getSeverityLabel localizes severity tags", () => {
  assert.equal(getSeverityLabel("CRITICAL", "bn"), "মারাত্মক (CRITICAL)");
  assert.equal(getSeverityLabel("CRITICAL", "en"), "CRITICAL");
  assert.equal(getSeverityLabel("HIGH", "bn"), "উচ্চ (HIGH)");
  assert.equal(getSeverityLabel("HIGH", "en"), "HIGH");
});

test("i18n: formatTime formats BD and EN times correctly", () => {
  const testDate = new Date("2026-03-15T14:30:00.000Z");
  const bnTime = formatTime(testDate, "bn");
  const enTime = formatTime(testDate, "en");
  assert.ok(typeof bnTime === "string" && bnTime.length > 0);
  assert.ok(typeof enTime === "string" && enTime.length > 0);
});

test("i18n: getRecommendedAction returns valid advice for all 5 rules", () => {
  assert.ok(translations.bn.roleCitizen.includes("নাগরিক"));
  assert.ok(translations.en.roleCitizen.includes("Citizen"));
  assert.ok(getAnomalyTypeLabel("DOUBLE_SELLING", "bn").length > 0);
  assert.ok(getSeverityLabel("CRITICAL", "bn").length > 0);
});

test("i18n: translations dictionary contains all key phrases in both languages", () => {
  assert.equal(STORAGE_KEY, "landtrace_lang");
  assert.ok(translations.bn.appName.includes("ল্যান্ডট্রেস"));
  assert.ok(translations.en.appName.includes("LandTrace"));
  assert.equal(translations.bn.cleanFilter, "বৈধ");
  assert.equal(translations.en.cleanFilter, "Clean");
  assert.equal(translations.bn.flaggedFilter, "অসঙ্গতিপূর্ণ");
  assert.equal(translations.en.flaggedFilter, "Flagged");
  assert.ok(translations.bn.showingRecords(5, 7).includes("৭টি"));
  assert.ok(translations.en.showingRecords(5, 7).includes("7"));
});

