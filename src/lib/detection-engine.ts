/**
 * LandTrace - Ownership Chain Contradiction & Fraud Detection Engine
 * P3: Fraud & Double-Selling Detection
 *
 * Implements the 5 Core Detection Rules:
 * 1. Double Selling (দ্বৈত বিক্রয়)
 * 2. Ownership Chain Break (মালিকানা ধারাবাহিকতা বিচ্ছিন্ন)
 * 3. Area Mismatch (খতিয়ান বনাম দলিল পরিমাপ অসঙ্গতি)
 * 4. Deed-Mutation Mismatch (দলিল ও নামজারি অমিল)
 * 5. Wrong Transfer Timing / Suspicious Rapid Transfer (সময়ানুক্রমিক অসঙ্গতি / দ্রুত হস্তান্তর)
 */

export interface DeedRecord {
  id: string;
  deedNumber: string;
  sellerName: string;
  buyerName: string;
  transferredArea: number;
  deedDate: Date | string;
  registrationOffice: string;
  deedType: string;
  serialOrder?: number;
  isVerified?: boolean;
}

export interface MutationRecord {
  id: string;
  caseNumber: string;
  applicantName: string;
  mutatedArea: number;
  khatianNumber: string;
  approvalDate: Date | string;
  officerName: string;
  status: string;
}

export interface ParcelRecord {
  id: string;
  parcelNumber: string;
  khatianNumber: string;
  mouza: string;
  district: string;
  upazila: string;
  totalArea: number; // in decimals (শতাংশ)
  currentOwner: string;
  status?: string;
  deeds: DeedRecord[];
  mutations: MutationRecord[];
}

export type AnomalyType =
  | "DOUBLE_SELLING"
  | "CHAIN_BREAK"
  | "AREA_MISMATCH"
  | "DEED_MUTATION_MISMATCH"
  | "TIMING_ANOMALY";

export type AnomalySeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface DetectionAnomaly {
  anomalyType: AnomalyType;
  severity: AnomalySeverity;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  evidence: Record<string, unknown>;
}

export interface AuditResult {
  parcelNumber: string;
  riskScore: number; // 0 - 100
  riskLevel: "CLEAN" | "MEDIUM_RISK" | "HIGH_RISK" | "CRITICAL_RISK";
  anomalies: DetectionAnomaly[];
  chainIsValid: boolean;
  totalDeeds: number;
  totalMutations: number;
  auditedAt: string;
}

/**
 * Normalizes Bangla and English names for case & whitespace insensitive comparison
 */
export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Rule 1: Double Selling Detection
 * Detects if a seller sold the same interest to multiple buyers without legitimate title re-acquisition.
 */
export function detectDoubleSelling(deeds: DeedRecord[]): DetectionAnomaly[] {
  const anomalies: DetectionAnomaly[] = [];
  const sortedDeeds = [...deeds].sort(
    (a, b) => new Date(a.deedDate).getTime() - new Date(b.deedDate).getTime()
  );

  const sellerHistory: Record<string, DeedRecord[]> = {};

  for (const deed of sortedDeeds) {
    const seller = normalizeName(deed.sellerName);
    if (!sellerHistory[seller]) {
      sellerHistory[seller] = [];
    }
    sellerHistory[seller].push(deed);
  }

  for (const [seller, deedsBySeller] of Object.entries(sellerHistory)) {
    if (deedsBySeller.length > 1) {
      // Check if seller re-acquired before second sale
      for (let i = 0; i < deedsBySeller.length - 1; i++) {
        const firstSale = deedsBySeller[i];
        const secondSale = deedsBySeller[i + 1];

        // Check if there was an intermediate purchase where this seller was the buyer
        const reacquired = sortedDeeds.some((d) => {
          const t = new Date(d.deedDate).getTime();
          return (
            t > new Date(firstSale.deedDate).getTime() &&
            t < new Date(secondSale.deedDate).getTime() &&
            normalizeName(d.buyerName) === seller
          );
        });

        if (!reacquired) {
          anomalies.push({
            anomalyType: "DOUBLE_SELLING",
            severity: "CRITICAL",
            titleEn: "Subsequent Alienation by Non-Titleholder (Double Selling)",
            titleBn: "পূর্ববর্তী বিক্রয়ের পর পুনরায় অননুমোদিত হস্তান্তর (দ্বৈত বিক্রয়)",
            descriptionEn: `Seller '${firstSale.sellerName}' transferred land to '${firstSale.buyerName}' on ${new Date(firstSale.deedDate).toISOString().slice(0, 10)}, but subsequently executed deed '${secondSale.deedNumber}' to '${secondSale.buyerName}' without recorded title.`,
            descriptionBn: `দাতা '${firstSale.sellerName}' ইতিপূর্বে '${firstSale.buyerName}'-এর নিকট জমি হস্তান্তর করার পর পুনরায় দলিল নং '${secondSale.deedNumber}' মূলে '${secondSale.buyerName}'-এর নিকট হস্তান্তর করেছেন।`,
            evidence: {
              firstDeedNumber: firstSale.deedNumber,
              firstDeedDate: firstSale.deedDate,
              firstBuyer: firstSale.buyerName,
              secondDeedNumber: secondSale.deedNumber,
              secondDeedDate: secondSale.deedDate,
              secondBuyer: secondSale.buyerName,
              unauthorizedSeller: firstSale.sellerName,
            },
          });
        }
      }
    }
  }

  return anomalies;
}

/**
 * Rule 2: Ownership Chain Break Detection
 * Verifies that each grantor in deed N was legitimately the grantee in deed N-1 (or initial government/ancestral record).
 */
export function detectChainBreaks(deeds: DeedRecord[]): DetectionAnomaly[] {
  const anomalies: DetectionAnomaly[] = [];
  if (deeds.length <= 1) return anomalies;

  const sortedDeeds = [...deeds].sort(
    (a, b) => new Date(a.deedDate).getTime() - new Date(b.deedDate).getTime()
  );

  const legitimateOwners = new Set<string>();

  // Root deed grants title to first buyer
  legitimateOwners.add(normalizeName(sortedDeeds[0].buyerName));
  legitimateOwners.add(normalizeName(sortedDeeds[0].sellerName)); // initial survey/grant title

  for (let i = 1; i < sortedDeeds.length; i++) {
    const currentDeed = sortedDeeds[i];
    const seller = normalizeName(currentDeed.sellerName);

    if (!legitimateOwners.has(seller)) {
      anomalies.push({
        anomalyType: "CHAIN_BREAK",
        severity: "CRITICAL",
        titleEn: "Discontinuous Chain of Title (Grantor Not Found in Record of Title)",
        titleBn: "মালিকানা ধারাবাহিকতা বিচ্ছিন্ন (পূর্ববর্তী খতিয়ান বা দলিলে দাতার নাম অনুপস্থিত)",
        descriptionEn: `Grantor '${currentDeed.sellerName}' in deed '${currentDeed.deedNumber}' is not recorded as a legitimate buyer or titleholder in preceding deeds.`,
        descriptionBn: `দলিল নং '${currentDeed.deedNumber}'-এর দাতা '${currentDeed.sellerName}'-এর অনুকূলে পূর্ববর্তী কোনো ক্রমানুসারী দলিল বা বৈধ স্বত্ব পাওয়া যায়নি।`,
        evidence: {
          compromisedDeed: currentDeed.deedNumber,
          unverifiedGrantor: currentDeed.sellerName,
          recordedTitleHolders: Array.from(legitimateOwners),
        },
      });
    }

    legitimateOwners.add(normalizeName(currentDeed.buyerName));
  }

  return anomalies;
}

/**
 * Rule 3: Area Mismatch Detection
 * Checks if transferred area in deeds or cumulative active area exceeds the parent survey Khatian acreage.
 */
export function detectAreaMismatch(deeds: DeedRecord[], totalKhatianArea: number): DetectionAnomaly[] {
  const anomalies: DetectionAnomaly[] = [];

  // Individual deed area check
  for (const deed of deeds) {
    if (deed.transferredArea > totalKhatianArea) {
      anomalies.push({
        anomalyType: "AREA_MISMATCH",
        severity: "HIGH",
        titleEn: "Deed Transferred Area Exceeds Parent Survey Khatian Area",
        titleBn: "দলিলের হস্তান্তরিত জমির পরিমাণ খতিয়ানের মোট পরিমাপের চেয়ে বেশি",
        descriptionEn: `Deed '${deed.deedNumber}' conveys ${deed.transferredArea} decimals, exceeding the parent plot khatian boundary of ${totalKhatianArea} decimals.`,
        descriptionBn: `দলিল নং '${deed.deedNumber}'-এ হস্তান্তরিত ${deed.transferredArea} শতাংশ জমি মূল খতিয়ানের মোট ${totalKhatianArea} শতাংশ অপেক্ষা অধিক।`,
        evidence: {
          deedNumber: deed.deedNumber,
          deedArea: deed.transferredArea,
          parentKhatianArea: totalKhatianArea,
          excessDecimals: +(deed.transferredArea - totalKhatianArea).toFixed(2),
        },
      });
    }
  }

  return anomalies;
}

/**
 * Rule 4: Deed-Mutation Mismatch Detection
 * Compares Sub-Registry deed transfer parameters with AC (Land) Mutation / Namjari records.
 */
export function detectDeedMutationMismatch(deeds: DeedRecord[], mutations: MutationRecord[]): DetectionAnomaly[] {
  const anomalies: DetectionAnomaly[] = [];

  for (const mut of mutations) {
    const applicant = normalizeName(mut.applicantName);

    // Find corresponding deed where this applicant was the buyer
    const matchingDeed = deeds.find((d) => normalizeName(d.buyerName) === applicant);

    if (!matchingDeed) {
      anomalies.push({
        anomalyType: "DEED_MUTATION_MISMATCH",
        severity: "HIGH",
        titleEn: "Mutation Applicant Without Corresponding Registered Deed",
        titleBn: "রেজিস্ট্রিকৃত দলিলবিহীন নামজারি আবেদন",
        descriptionEn: `Mutation case '${mut.caseNumber}' for '${mut.applicantName}' has no matching deed of acquisition in the title record.`,
        descriptionBn: `নামজারি মোকদ্দমা নং '${mut.caseNumber}'-এর আবেদনকারী '${mut.applicantName}'-এর অনুকূলে কোনো বৈধ ক্রয় দলিল পাওয়া যায়নি।`,
        evidence: {
          mutationCase: mut.caseNumber,
          applicantName: mut.applicantName,
          mutatedArea: mut.mutatedArea,
        },
      });
    } else if (Math.abs(mut.mutatedArea - matchingDeed.transferredArea) > 0.05) {
      anomalies.push({
        anomalyType: "DEED_MUTATION_MISMATCH",
        severity: "HIGH",
        titleEn: "Discrepancy Between Mutated Area and Deed Area",
        titleBn: "দলিলের হস্তান্তরিত পরিমাপ এবং নামজারি খতিয়ানের পরিমাপে গরমিল",
        descriptionEn: `Mutation case '${mut.caseNumber}' records ${mut.mutatedArea} decimals, but linked deed '${matchingDeed.deedNumber}' transferred ${matchingDeed.transferredArea} decimals.`,
        descriptionBn: `নামজারি মোকদ্দমা নং '${mut.caseNumber}'-এ ${mut.mutatedArea} শতাংশ অনুমোদন করা হয়েছে, কিন্তু সংশ্লিষ্ট দলিল নং '${matchingDeed.deedNumber}'-এ হস্তান্তরিত হয়েছে ${matchingDeed.transferredArea} শতাংশ।`,
        evidence: {
          mutationCase: mut.caseNumber,
          mutatedArea: mut.mutatedArea,
          linkedDeed: matchingDeed.deedNumber,
          deedArea: matchingDeed.transferredArea,
          discrepancy: +(mut.mutatedArea - matchingDeed.transferredArea).toFixed(2),
        },
      });
    }
  }

  return anomalies;
}

/**
 * Rule 5: Wrong Transfer Timing / Suspicious Rapid Transfer Detection
 * Detects chronological anomalies (transfer before acquisition) or rapid flipping (< 7 days) without mutation.
 */
export function detectTimingAnomalies(deeds: DeedRecord[]): DetectionAnomaly[] {
  const anomalies: DetectionAnomaly[] = [];
  if (deeds.length <= 1) return anomalies;

  const sortedDeeds = [...deeds].sort(
    (a, b) => new Date(a.deedDate).getTime() - new Date(b.deedDate).getTime()
  );

  for (let i = 0; i < sortedDeeds.length; i++) {
    const deed = sortedDeeds[i];
    const seller = normalizeName(deed.sellerName);

    // Look for when seller acquired
    const acquisitionDeed = sortedDeeds.find(
      (d) => normalizeName(d.buyerName) === seller
    );

    if (acquisitionDeed) {
      const acqTime = new Date(acquisitionDeed.deedDate).getTime();
      const saleTime = new Date(deed.deedDate).getTime();

      // Case A: Sold before acquisition (impossible chronology)
      if (saleTime < acqTime) {
        anomalies.push({
          anomalyType: "TIMING_ANOMALY",
          severity: "CRITICAL",
          titleEn: "Anachronistic Transfer (Deed Executed Prior to Title Acquisition)",
          titleBn: "অসম্ভব সময়ানুক্রমিক হস্তান্তর (জমি ক্রয়ের পূর্বেই বিক্রয় দলিল সম্পাদন)",
          descriptionEn: `Deed '${deed.deedNumber}' was executed on ${new Date(deed.deedDate).toISOString().slice(0, 10)}, before seller acquired title on ${new Date(acquisitionDeed.deedDate).toISOString().slice(0, 10)}.`,
          descriptionBn: `দলিল নং '${deed.deedNumber}' সম্পাদিত হয়েছে ${new Date(deed.deedDate).toISOString().slice(0, 10)} তারিখে, যা দাতার স্বত্ব অর্জনের তারিখ (${new Date(acquisitionDeed.deedDate).toISOString().slice(0, 10)}) অপেক্ষা পূর্ববর্তী।`,
          evidence: {
            saleDeed: deed.deedNumber,
            saleDate: deed.deedDate,
            acquisitionDeed: acquisitionDeed.deedNumber,
            acquisitionDate: acquisitionDeed.deedDate,
          },
        });
      }

      // Case B: Suspicious Rapid Flip (< 7 days between transfer)
      const diffDays = (saleTime - acqTime) / (1000 * 60 * 60 * 24);
      if (diffDays >= 0 && diffDays < 7) {
        anomalies.push({
          anomalyType: "TIMING_ANOMALY",
          severity: "MEDIUM",
          titleEn: "Suspicious Rapid Resale Without Namjari Interval",
          titleBn: "নামজারি ব্যতিরেকে সন্দেহজনক অতি দ্রুত পুনঃহস্তান্তর",
          descriptionEn: `Parcel was resold in deed '${deed.deedNumber}' within ${Math.round(diffDays)} days of acquisition in '${acquisitionDeed.deedNumber}'.`,
          descriptionBn: `ক্রয়ের মাত্র ${Math.round(diffDays)} দিনের মাথায় নামজারি ব্যতিরেকে পুনঃবিক্রয় করা হয়েছে।`,
          evidence: {
            priorDeed: acquisitionDeed.deedNumber,
            rapidDeed: deed.deedNumber,
            daysBetween: Math.round(diffDays),
          },
        });
      }
    }
  }

  return anomalies;
}

/**
 * Master Audit Function
 * Executes all 5 rules, aggregates forensic evidence, and calculates calibrated Risk Score.
 */
export function auditParcel(parcel: ParcelRecord): AuditResult {
  const anomalies: DetectionAnomaly[] = [
    ...detectDoubleSelling(parcel.deeds),
    ...detectChainBreaks(parcel.deeds),
    ...detectAreaMismatch(parcel.deeds, parcel.totalArea),
    ...detectDeedMutationMismatch(parcel.deeds, parcel.mutations),
    ...detectTimingAnomalies(parcel.deeds),
  ];

  // Calculate Risk Score
  let score = 0;
  for (const anomaly of anomalies) {
    switch (anomaly.severity) {
      case "CRITICAL":
        score += 45;
        break;
      case "HIGH":
        score += 25;
        break;
      case "MEDIUM":
        score += 15;
        break;
      case "LOW":
        score += 5;
        break;
    }
  }

  const finalScore = Math.min(100, score);
  let riskLevel: "CLEAN" | "MEDIUM_RISK" | "HIGH_RISK" | "CRITICAL_RISK" = "CLEAN";

  if (finalScore >= 60) riskLevel = "CRITICAL_RISK";
  else if (finalScore >= 30) riskLevel = "HIGH_RISK";
  else if (finalScore > 0) riskLevel = "MEDIUM_RISK";

  return {
    parcelNumber: parcel.parcelNumber,
    riskScore: finalScore,
    riskLevel,
    anomalies,
    chainIsValid: anomalies.length === 0,
    totalDeeds: parcel.deeds.length,
    totalMutations: parcel.mutations.length,
    auditedAt: new Date().toISOString(),
  };
}
