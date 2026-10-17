/**
 * LandTrace - Synthetic Demonstration Dataset
 * Strictly synthetic cadastral records adhering to Bangladesh land administration norms.
 * No real citizen or government data is used.
 */

export interface DemoDeed {
  id: string;
  deedNumber: string;
  sellerName: string;
  buyerName: string;
  transferredArea: number; // in decimals (শতাংশ)
  deedDate: string;
  registrationOffice: string;
  deedType: string;
  serialOrder: number;
  isVerified: boolean;
  dagNumber?: string;
  surveyType?: string;
}

export interface DemoMutation {
  id: string;
  caseNumber: string;
  applicantName: string;
  mutatedArea: number;
  khatianNumber: string;
  approvalDate: string;
  officerName: string;
  status: string;
  dagNumber?: string;
}

export interface DemoAnomaly {
  id: string;
  anomalyType:
    | "DOUBLE_SELLING"
    | "CHAIN_BREAK"
    | "AREA_MISMATCH"
    | "DEED_MUTATION_MISMATCH"
    | "TIMING_ANOMALY";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  evidence: string;
  status: string;
}

export interface DemoParcel {
  id: string;
  parcelNumber: string;
  dagNumber: string;
  khatianNumber: string;
  mouza: string;
  district: string;
  upazila: string;
  surveyType: "CS" | "SA" | "RS" | "BS" | "CITY_SURVEY";
  totalArea: number; // in decimals (শতাংশ)
  currentOwner: string;
  ownershipShares?: string; // JSON formatted string
  provenance: string;
  status: "ACTIVE" | "FLAGGED";
  deeds: DemoDeed[];
  mutations: DemoMutation[];
  anomalies: DemoAnomaly[];
  createdAt: string;
  updatedAt: string;
}

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "CITIZEN" | "OFFICIAL" | "ADMIN";
  isActive: boolean;
  phoneNumber?: string;
  designation?: string;
  permittedPlots: string; // "ALL" or comma-separated list like "PLOT-DH-1001"
  createdAt: string;
}

// Pre-hashed bcrypt passwords for synthetic demo accounts:
// Citizen: 'Citizen@LandTrace2026!'
// Officer: 'Officer@LandTrace2026!'
// Admin:   'Admin@LandTrace2026!'
export const DEMO_USERS: DemoUser[] = [
  {
    id: "usr-citizen-001",
    email: "citizen@demo.landtrace.gov.bd",
    name: "Mohammad Abdul Karim (নাগরিক)",
    passwordHash: "$2b$10$tDnRh/vWASFZhyt00CP1MegF1bDSP71k5AIMVZeSQP7RIOTnYJmlS", // Citizen@LandTrace2026!
    role: "CITIZEN",
    isActive: true,
    phoneNumber: "01700-000001",
    designation: "জমি ক্রেতা / নাগরিক আবেদনকারী",
    permittedPlots: "PLOT-DH-1001",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "usr-officer-001",
    email: "officer@demo.landtrace.gov.bd",
    name: "A. S. M. Rahman (ভূমি কর্মকর্তা)",
    passwordHash: "$2b$10$20OHVFlcSUFWVZWidtfGr.58c2QAJ7HXPWKRZnFQ29y0CMXXwEzWu", // Officer@LandTrace2026!
    role: "OFFICIAL",
    isActive: true,
    phoneNumber: "01800-000002",
    designation: "সহকারী কমিশনার (ভূমি) / সাব-রেজিস্ট্রার",
    permittedPlots: "ALL",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "usr-admin-001",
    email: "admin@demo.landtrace.gov.bd",
    name: "System Administrator (সিস্টেম অ্যাডমিন)",
    passwordHash: "$2b$10$h2my1f3J51B0G4JzN23.W.pTOMxeQx8piLp.KBWZSzdjclFnKDBFa", // Admin@LandTrace2026!
    role: "ADMIN",
    isActive: true,
    phoneNumber: "01900-000003",
    designation: "ভূমি মন্ত্রণালয় আইসিটি সেল সুপার-অ্যাডমিন",
    permittedPlots: "ALL",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];


export const SYNTHETIC_PARCELS: DemoParcel[] = [
  // 1. Clean Verified Chain: PLOT-DH-1001
  {
    id: "5aa3dd3f-e5c2-4750-b0e6-f4a3e8e132de",
    parcelNumber: "PLOT-DH-1001",
    dagNumber: "402",
    khatianNumber: "KH-4029-CS",
    mouza: "Tejgaon",
    district: "Dhaka",
    upazila: "Tejgaon",
    surveyType: "CS",
    totalArea: 10.5,
    currentOwner: "Mohammad Abdul Karim",
    ownershipShares: JSON.stringify([
      { owner: "Mohammad Abdul Karim", share: 1.0, decimals: 10.5 },
    ]),
    provenance: "State Acquisition Cadastral Survey (CS) Record 1956",
    status: "ACTIVE",
    deeds: [
      {
        id: "a488804b-08c3-4a6e-bf44-49f541756c89",
        deedNumber: "DEED-2005-0912",
        sellerName: "Government Land Record Board",
        buyerName: "Rafiqul Islam",
        transferredArea: 10.5,
        deedDate: "2005-03-15T00:00:00.000Z",
        registrationOffice: "Dhaka Sadar Registry",
        deedType: "GRANT",
        serialOrder: 1,
        isVerified: true,
        dagNumber: "402",
        surveyType: "CS",
      },
      {
        id: "7fcdb31a-ab57-4768-a1bf-d70daaa00625",
        deedNumber: "DEED-2015-4421",
        sellerName: "Rafiqul Islam",
        buyerName: "Mohammad Abdul Karim",
        transferredArea: 10.5,
        deedDate: "2015-08-20T00:00:00.000Z",
        registrationOffice: "Tejgaon Sub-Registry",
        deedType: "SALE",
        serialOrder: 2,
        isVerified: true,
        dagNumber: "402",
        surveyType: "CS",
      },
    ],
    mutations: [
      {
        id: "3441113a-39ca-4875-9620-e1deaa6a5e1a",
        caseNumber: "MUT-2016-0819",
        applicantName: "Mohammad Abdul Karim",
        mutatedArea: 10.5,
        khatianNumber: "KH-4029-MUT",
        approvalDate: "2016-01-10T00:00:00.000Z",
        officerName: "A. S. M. Rahman (AC Land)",
        status: "APPROVED",
        dagNumber: "402",
      },
    ],
    anomalies: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // 2. Double Selling: PLOT-DH-2045
  {
    id: "5a0ec58c-f627-4cb5-ae5b-bbae9fc77931",
    parcelNumber: "PLOT-DH-2045",
    dagNumber: "1105",
    khatianNumber: "KH-1102-SA",
    mouza: "Gulshan",
    district: "Dhaka",
    upazila: "Gulshan",
    surveyType: "SA",
    totalArea: 15.0,
    currentOwner: "Contested / একাধিক দাবিদার",
    ownershipShares: JSON.stringify([
      { claimant: "Tariqul Alam", deed: "DEED-2018-1100", shareClaimed: 15.0 },
      { claimant: "Farhana Yasmin", deed: "DEED-2021-3948", shareClaimed: 15.0 },
    ]),
    provenance: "State Acquisition (SA) Cadastral Ledger 1962",
    status: "FLAGGED",
    deeds: [
      {
        id: "1d6e0aa4-5c69-42a6-bae5-b497f6bb7ec1",
        deedNumber: "DEED-2018-1100",
        sellerName: "Abdur Rashid",
        buyerName: "Tariqul Alam",
        transferredArea: 15.0,
        deedDate: "2018-05-12T00:00:00.000Z",
        registrationOffice: "Gulshan Sub-Registry",
        deedType: "SALE",
        serialOrder: 1,
        isVerified: true,
        dagNumber: "1105",
      },
      {
        id: "fa591de7-02c7-490c-8a54-b1519fbf7b10",
        deedNumber: "DEED-2021-3948",
        sellerName: "Abdur Rashid",
        buyerName: "Farhana Yasmin",
        transferredArea: 15.0,
        deedDate: "2021-11-04T00:00:00.000Z",
        registrationOffice: "Gulshan Sub-Registry",
        deedType: "SALE",
        serialOrder: 2,
        isVerified: false,
        dagNumber: "1105",
      },
    ],
    mutations: [],
    anomalies: [
      {
        id: "66b6f4ff-ffdd-4dad-809c-fd8676df389d",
        anomalyType: "DOUBLE_SELLING",
        severity: "CRITICAL",
        title: "Simultaneous / Subsequent Sale by Non-Titleholder (Double Selling)",
        description:
          "Abdur Rashid alienated 15.0 decimals to Tariqul Alam in 2018, but executed a subsequent deed (DEED-2021-3948) to Farhana Yasmin without title.",
        evidence: JSON.stringify({
          firstDeed: "DEED-2018-1100",
          secondDeed: "DEED-2021-3948",
          unauthorizedSeller: "Abdur Rashid",
          compromisedBuyer: "Farhana Yasmin",
          overlappingAreaDecimals: 15.0,
          dataOrigin: "Synthetic Demo Data / নমুনা সিন্থেটিক ডেটা",
        }),
        status: "OPEN",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // 3. Ownership Chain Break: PLOT-SYL-5501
  {
    id: "58144d02-7994-43fb-9a50-483f209ca82e",
    parcelNumber: "PLOT-SYL-5501",
    dagNumber: "3320",
    khatianNumber: "KH-3319-RS",
    mouza: "Kotwali",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    surveyType: "RS",
    totalArea: 12.0,
    currentOwner: "Mahfuzur Rahman",
    provenance: "Revisional Survey (RS) Gazette 1988",
    status: "FLAGGED",
    deeds: [
      {
        id: "a655e82d-bd76-43bb-85c4-366e91d4a92a",
        deedNumber: "DEED-2008-1011",
        sellerName: "Nazrul Islam",
        buyerName: "Kamal Uddin",
        transferredArea: 12.0,
        deedDate: "2008-04-14T00:00:00.000Z",
        registrationOffice: "Sylhet Sadar",
        deedType: "SALE",
        serialOrder: 1,
        isVerified: true,
        dagNumber: "3320",
      },
      {
        id: "371eba0d-908e-4aeb-b399-f2dbb69b9a9c",
        deedNumber: "DEED-2019-8802",
        sellerName: "Enamul Haque (Ghost Seller)",
        buyerName: "Mahfuzur Rahman",
        transferredArea: 12.0,
        deedDate: "2019-10-02T00:00:00.000Z",
        registrationOffice: "Sylhet Sadar",
        deedType: "SALE",
        serialOrder: 2,
        isVerified: false,
        dagNumber: "3320",
      },
    ],
    mutations: [],
    anomalies: [
      {
        id: "8efbea16-3f2c-44a8-8463-1229cac82ce6",
        anomalyType: "CHAIN_BREAK",
        severity: "CRITICAL",
        title: "Discontinuous Chain of Title (Ghost Grantor Break)",
        description:
          "Grantor 'Enamul Haque' in deed DEED-2019-8802 holds no preceding acquisition deed or inheritance record in the chain.",
        evidence: JSON.stringify({
          compromisedDeed: "DEED-2019-8802",
          unverifiedGrantor: "Enamul Haque",
          priorLegitimateOwner: "Kamal Uddin",
          gapDetectedYears: 11,
          dataOrigin: "Synthetic Demo Data / নমুনা সিন্থেটিক ডেটা",
        }),
        status: "OPEN",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // 4. Area Mismatch: PLOT-CTG-3301
  {
    id: "4561fa6e-5e73-40cd-8f2e-802600d348af",
    parcelNumber: "PLOT-CTG-3301",
    dagNumber: "9845",
    khatianNumber: "KH-9844-RS",
    mouza: "Pahartali",
    district: "Chattogram",
    upazila: "Pahartali",
    surveyType: "RS",
    totalArea: 8.0,
    currentOwner: "Shamsul Huda",
    provenance: "Revisional Survey (RS) Boundary 1991",
    status: "FLAGGED",
    deeds: [
      {
        id: "6d8111ed-7db5-4dfb-838d-5478ce8b846c",
        deedNumber: "DEED-2012-7721",
        sellerName: "Kabir Hossain",
        buyerName: "Shamsul Huda",
        transferredArea: 14.5, // 14.5 exceeds 8.0
        deedDate: "2012-04-10T00:00:00.000Z",
        registrationOffice: "Chattogram Sadar",
        deedType: "SALE",
        serialOrder: 1,
        isVerified: false,
        dagNumber: "9845",
      },
    ],
    mutations: [],
    anomalies: [
      {
        id: "ea8eec7e-f5af-4c9f-ba92-2a458d5aefab",
        anomalyType: "AREA_MISMATCH",
        severity: "HIGH",
        title: "Transferred Deed Area Exceeds Survey Khatian Record",
        description:
          "Deed DEED-2012-7721 purports to convey 14.5 decimals, whereas parent survey RS record KH-9844-RS only establishes 8.0 decimals total.",
        evidence: JSON.stringify({
          khatianTotalArea: 8.0,
          deedClaimedArea: 14.5,
          excessArea: 6.5,
          unit: "decimals / শতাংশ",
          dataOrigin: "Synthetic Demo Data / নমুনা সিন্থেটিক ডেটা",
        }),
        status: "OPEN",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // 5. Deed-Mutation Mismatch: PLOT-RAJ-4402
  {
    id: "277a85e8-d4b0-420c-9d45-501d770a93ad",
    parcelNumber: "PLOT-RAJ-4402",
    dagNumber: "6105",
    khatianNumber: "KH-6102-CS",
    mouza: "Boalia",
    district: "Rajshahi",
    upazila: "Boalia",
    surveyType: "CS",
    totalArea: 6.0,
    currentOwner: "Zahid Hasan",
    provenance: "Cadastral Survey (CS) 1958",
    status: "FLAGGED",
    deeds: [
      {
        id: "d485116c-de58-4a1d-b523-8d2cce18057c",
        deedNumber: "DEED-2014-9912",
        sellerName: "Abdul Matin",
        buyerName: "Zahid Hasan",
        transferredArea: 4.0,
        deedDate: "2014-06-18T00:00:00.000Z",
        registrationOffice: "Rajshahi Sadar",
        deedType: "SALE",
        serialOrder: 1,
        isVerified: true,
        dagNumber: "6105",
      },
    ],
    mutations: [
      {
        id: "d0729e4c-d903-4301-8e83-13f25f8b079f",
        caseNumber: "MUT-2015-3391",
        applicantName: "Zahid Hasan",
        mutatedArea: 9.5, // Exceeds deed transferred area of 4.0
        khatianNumber: "KH-6102-MUT",
        approvalDate: "2015-02-22T00:00:00.000Z",
        officerName: "M. N. Islam (AC Land)",
        status: "APPROVED",
        dagNumber: "6105",
      },
    ],
    anomalies: [
      {
        id: "d51157d3-9f66-4b6a-bb33-020c95045826",
        anomalyType: "DEED_MUTATION_MISMATCH",
        severity: "HIGH",
        title: "Discrepancy Between Mutated Area and Registered Deed",
        description:
          "Namjari mutation MUT-2015-3391 mutated 9.5 decimals, whereas originating deed DEED-2014-9912 only conveyed 4.0 decimals.",
        evidence: JSON.stringify({
          registeredDeedArea: 4.0,
          approvedMutationArea: 9.5,
          unsupportedAcres: 5.5,
          dataOrigin: "Synthetic Demo Data / নমুনা সিন্থেটিক ডেটা",
        }),
        status: "OPEN",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // 6. Suspicious Rapid Transfer / Timing Anomaly: PLOT-KHL-6610
  {
    id: "3e105601-0d51-4e3f-9cd8-e2afd65e5c23",
    parcelNumber: "PLOT-KHL-6610",
    dagNumber: "7715",
    khatianNumber: "KH-7711-SA",
    mouza: "Khalishpur",
    district: "Khulna",
    upazila: "Khalishpur",
    surveyType: "SA",
    totalArea: 7.5,
    currentOwner: "Golam Mustafa",
    provenance: "State Acquisition (SA) Record 1964",
    status: "FLAGGED",
    deeds: [
      {
        id: "80b9b38f-9116-46f0-a974-1f5e651d4687",
        deedNumber: "DEED-2023-1101",
        sellerName: "Fazlul Haque",
        buyerName: "Middleman Syndicate",
        transferredArea: 7.5,
        deedDate: "2023-08-01T00:00:00.000Z",
        registrationOffice: "Khulna Sadar",
        deedType: "SALE",
        serialOrder: 1,
        isVerified: true,
        dagNumber: "7715",
      },
      {
        id: "2a2a38b7-69ad-416b-8e02-4d68c4cb0560",
        deedNumber: "DEED-2023-1145",
        sellerName: "Middleman Syndicate",
        buyerName: "Golam Mustafa",
        transferredArea: 7.5,
        deedDate: "2023-08-03T00:00:00.000Z", // 48 hours later!
        registrationOffice: "Khulna Sadar",
        deedType: "SALE",
        serialOrder: 2,
        isVerified: false,
        dagNumber: "7715",
      },
    ],
    mutations: [],
    anomalies: [
      {
        id: "dcb88580-a13d-4b31-adae-dc6564a7ec01",
        anomalyType: "TIMING_ANOMALY",
        severity: "MEDIUM",
        title: "Suspicious Rapid Flip (Under 48 Hours Without Interim Mutation)",
        description:
          "Parcel was resold in deed DEED-2023-1145 within 2 days of acquisition without obtaining Namjari/Khatian clearance.",
        evidence: JSON.stringify({
          holdingIntervalDays: 2,
          priorDeed: "DEED-2023-1101",
          rapidDeed: "DEED-2023-1145",
          dataOrigin: "Synthetic Demo Data / নমুনা সিন্থেটিক ডেটা",
        }),
        status: "OPEN",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // 7. Multiple Simultaneous Contradictions: PLOT-BAR-7703
  {
    id: "09428366-33f6-4990-a746-855d813c3225",
    parcelNumber: "PLOT-BAR-7703",
    dagNumber: "8805",
    khatianNumber: "KH-8800-RS",
    mouza: "Kotwali",
    district: "Barishal",
    upazila: "Kotwali",
    surveyType: "RS",
    totalArea: 5.0,
    currentOwner: "Syed Mokhlesur Rahman",
    provenance: "Revisional Cadastral Survey (RS) 1985",
    status: "FLAGGED",
    deeds: [
      {
        id: "e0f23b8a-bc0c-4d54-9e4c-73efb2c4a8c5",
        deedNumber: "DEED-2010-001",
        sellerName: "Original Titleholder",
        buyerName: "Salim Ahmed",
        transferredArea: 5.0,
        deedDate: "2010-01-10T00:00:00.000Z",
        registrationOffice: "Barishal Sadar",
        deedType: "SALE",
        serialOrder: 1,
        isVerified: true,
        dagNumber: "8805",
      },
      {
        id: "d3c3fda9-8b08-43ff-b621-a81eb9ddc089",
        deedNumber: "DEED-2016-042",
        sellerName: "Unrecorded Party X", // Chain Break
        buyerName: "Intermediary Buyer",
        transferredArea: 12.0, // Area Mismatch (> 5.0)
        deedDate: "2016-05-15T00:00:00.000Z",
        registrationOffice: "Barishal Sadar",
        deedType: "SALE",
        serialOrder: 2,
        isVerified: false,
        dagNumber: "8805",
      },
      {
        id: "6c524c61-0c33-477c-a6cb-b02d988a1cce",
        deedNumber: "DEED-2019-109",
        sellerName: "Unrecorded Party X", // Double Selling
        buyerName: "Syed Mokhlesur Rahman",
        transferredArea: 12.0,
        deedDate: "2019-11-20T00:00:00.000Z",
        registrationOffice: "Barishal Sadar",
        deedType: "SALE",
        serialOrder: 3,
        isVerified: false,
        dagNumber: "8805",
      },
    ],
    mutations: [],
    anomalies: [
      {
        id: "c91099fb-7efe-4e8a-8edd-1c41faa1a5e4",
        anomalyType: "CHAIN_BREAK",
        severity: "CRITICAL",
        title: "Discontinuous Custody Chain (Unverified Grantor)",
        description:
          "Grantor 'Unrecorded Party X' possesses no preceding root in title register.",
        evidence: JSON.stringify({
          unverifiedGrantor: "Unrecorded Party X",
          priorOwner: "Salim Ahmed",
        }),
        status: "OPEN",
      },
      {
        id: "fa248b60-c308-404d-ad2c-3f8723361add",
        anomalyType: "AREA_MISMATCH",
        severity: "HIGH",
        title: "Exorbitant Deed Area Beyond Khatian Bounds",
        description:
          "Deeds claim 12.0 decimals against 5.0 decimals surveyed plot.",
        evidence: JSON.stringify({
          surveyArea: 5.0,
          claimedArea: 12.0,
        }),
        status: "OPEN",
      },
      {
        id: "08cd8cca-bf38-4e65-b5a0-4d78e4ef92a8",
        anomalyType: "DOUBLE_SELLING",
        severity: "CRITICAL",
        title: "Double Selling by Fraudulent Grantor",
        description:
          "Unrecorded Party X executed two contradictory conveyances for same parcel.",
        evidence: JSON.stringify({
          deedA: "DEED-2016-042",
          deedB: "DEED-2019-109",
        }),
        status: "OPEN",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];
