import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding comprehensive synthetic LandTrace data for Round 1...");

  // Purge existing synthetic records
  await prisma.auditLog.deleteMany();
  await prisma.fraudAnomaly.deleteMany();
  await prisma.mutationRecord.deleteMany();
  await prisma.deedRecord.deleteMany();
  await prisma.parcel.deleteMany();

  // 1. Clean Verified Chain: PLOT-DH-1001 (Tejgaon, Dhaka)
  const parcel1 = await prisma.parcel.create({
    data: {
      parcelNumber: "PLOT-DH-1001",
      khatianNumber: "KH-4029-CS",
      mouza: "Tejgaon",
      district: "Dhaka",
      upazila: "Tejgaon",
      totalArea: 10.5,
      currentOwner: "Mohammad Abdul Karim",
      status: "ACTIVE",
      deeds: {
        create: [
          {
            deedNumber: "DEED-2005-0912",
            sellerName: "Government Land Record Board",
            buyerName: "Rafiqul Islam",
            transferredArea: 10.5,
            deedDate: new Date("2005-03-15"),
            registrationOffice: "Dhaka Sadar Registry",
            deedType: "GRANT",
            serialOrder: 1,
            isVerified: true,
          },
          {
            deedNumber: "DEED-2015-4421",
            sellerName: "Rafiqul Islam",
            buyerName: "Mohammad Abdul Karim",
            transferredArea: 10.5,
            deedDate: new Date("2015-08-20"),
            registrationOffice: "Tejgaon Sub-Registry",
            deedType: "SALE",
            serialOrder: 2,
            isVerified: true,
          },
        ],
      },
      mutations: {
        create: [
          {
            caseNumber: "MUT-2016-0819",
            applicantName: "Mohammad Abdul Karim",
            mutatedArea: 10.5,
            khatianNumber: "KH-4029-MUT",
            approvalDate: new Date("2016-01-10"),
            officerName: "A. S. M. Rahman (AC Land)",
            status: "APPROVED",
          },
        ],
      },
    },
  });

  // 2. Double Selling Anomaly: PLOT-DH-2045 (Gulshan, Dhaka)
  const parcel2 = await prisma.parcel.create({
    data: {
      parcelNumber: "PLOT-DH-2045",
      khatianNumber: "KH-1102-SA",
      mouza: "Gulshan",
      district: "Dhaka",
      upazila: "Gulshan",
      totalArea: 15.0,
      currentOwner: "Contested / একাধিক দাবিদার",
      status: "FLAGGED",
      deeds: {
        create: [
          {
            deedNumber: "DEED-2018-1100",
            sellerName: "Abdur Rashid",
            buyerName: "Tariqul Alam",
            transferredArea: 15.0,
            deedDate: new Date("2018-05-12"),
            registrationOffice: "Gulshan Sub-Registry",
            deedType: "SALE",
            serialOrder: 1,
            isVerified: true,
          },
          {
            deedNumber: "DEED-2021-3948",
            sellerName: "Abdur Rashid", // Sold again!
            buyerName: "Farhana Yasmin",
            transferredArea: 15.0,
            deedDate: new Date("2021-11-04"),
            registrationOffice: "Gulshan Sub-Registry",
            deedType: "SALE",
            serialOrder: 2,
            isVerified: false,
          },
        ],
      },
      anomalies: {
        create: [
          {
            anomalyType: "DOUBLE_SELLING",
            severity: "CRITICAL",
            title: "Simultaneous / Subsequent Sale by Non-Titleholder (Double Selling)",
            description: "Abdur Rashid alienated 15.0 decimals to Tariqul Alam in 2018, but executed a subsequent deed (DEED-2021-3948) to Farhana Yasmin without title.",
            evidence: JSON.stringify({
              firstDeed: "DEED-2018-1100",
              secondDeed: "DEED-2021-3948",
              compromisedBuyer: "Farhana Yasmin",
              overlappingAreaDecimals: 15.0,
              dataOrigin: "Synthetic Demo Data / নমুনা সিন্থেটিক ডেটা",
            }),
            status: "OPEN",
          },
        ],
      },
    },
  });

  // 3. Ownership Chain Break: PLOT-SYL-5501 (Sylhet Sadar)
  const parcel3 = await prisma.parcel.create({
    data: {
      parcelNumber: "PLOT-SYL-5501",
      khatianNumber: "KH-3319-RS",
      mouza: "Kotwali",
      district: "Sylhet",
      upazila: "Sylhet Sadar",
      totalArea: 12.0,
      currentOwner: "Mahfuzur Rahman",
      status: "FLAGGED",
      deeds: {
        create: [
          {
            deedNumber: "DEED-2008-1011",
            sellerName: "Nazrul Islam",
            buyerName: "Kamal Uddin",
            transferredArea: 12.0,
            deedDate: new Date("2008-04-14"),
            registrationOffice: "Sylhet Sadar",
            deedType: "SALE",
            serialOrder: 1,
            isVerified: true,
          },
          {
            deedNumber: "DEED-2019-8802",
            sellerName: "Enamul Haque (Ghost Seller)", // Discontinuous grantor
            buyerName: "Mahfuzur Rahman",
            transferredArea: 12.0,
            deedDate: new Date("2019-10-02"),
            registrationOffice: "Sylhet Sadar",
            deedType: "SALE",
            serialOrder: 2,
            isVerified: false,
          },
        ],
      },
      anomalies: {
        create: [
          {
            anomalyType: "CHAIN_BREAK",
            severity: "CRITICAL",
            title: "Discontinuous Chain of Title (Ghost Grantor Break)",
            description: "Grantor 'Enamul Haque' in deed DEED-2019-8802 holds no preceding acquisition deed or inheritance record in the chain.",
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
      },
    },
  });

  // 4. Area Mismatch Anomaly: PLOT-CTG-3301 (Pahartali, Chattogram)
  const parcel4 = await prisma.parcel.create({
    data: {
      parcelNumber: "PLOT-CTG-3301",
      khatianNumber: "KH-9844-RS",
      mouza: "Pahartali",
      district: "Chattogram",
      upazila: "Pahartali",
      totalArea: 8.0,
      currentOwner: "Shamsul Huda",
      status: "FLAGGED",
      deeds: {
        create: [
          {
            deedNumber: "DEED-2012-7721",
            sellerName: "Kabir Hossain",
            buyerName: "Shamsul Huda",
            transferredArea: 14.5, // 14.5 exceeds 8.0
            deedDate: new Date("2012-04-10"),
            registrationOffice: "Chattogram Sadar",
            deedType: "SALE",
            serialOrder: 1,
            isVerified: false,
          },
        ],
      },
      anomalies: {
        create: [
          {
            anomalyType: "AREA_MISMATCH",
            severity: "HIGH",
            title: "Transferred Deed Area Exceeds Survey Khatian Record",
            description: "Deed DEED-2012-7721 purports to convey 14.5 decimals, whereas parent survey RS record KH-9844-RS only establishes 8.0 decimals total.",
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
      },
    },
  });

  // 5. Deed-Mutation Mismatch Anomaly: PLOT-RAJ-4402 (Boalia, Rajshahi)
  const parcel5 = await prisma.parcel.create({
    data: {
      parcelNumber: "PLOT-RAJ-4402",
      khatianNumber: "KH-6102-CS",
      mouza: "Boalia",
      district: "Rajshahi",
      upazila: "Boalia",
      totalArea: 6.0,
      currentOwner: "Zahid Hasan",
      status: "FLAGGED",
      deeds: {
        create: [
          {
            deedNumber: "DEED-2014-9912",
            sellerName: "Abdul Matin",
            buyerName: "Zahid Hasan",
            transferredArea: 4.0, // Deed transferred 4.0 decimals
            deedDate: new Date("2014-06-18"),
            registrationOffice: "Rajshahi Sadar",
            deedType: "SALE",
            serialOrder: 1,
            isVerified: true,
          },
        ],
      },
      mutations: {
        create: [
          {
            caseNumber: "MUT-2015-3391",
            applicantName: "Zahid Hasan",
            mutatedArea: 9.5, // Mutated 9.5 decimals (> deed 4.0!)
            khatianNumber: "KH-6102-MUT",
            approvalDate: new Date("2015-02-22"),
            officerName: "M. N. Islam (AC Land)",
            status: "APPROVED",
          },
        ],
      },
      anomalies: {
        create: [
          {
            anomalyType: "DEED_MUTATION_MISMATCH",
            severity: "HIGH",
            title: "Discrepancy Between Mutated Area and Registered Deed",
            description: "Namjari mutation MUT-2015-3391 mutated 9.5 decimals, whereas originating deed DEED-2014-9912 only conveyed 4.0 decimals.",
            evidence: JSON.stringify({
              registeredDeedArea: 4.0,
              approvedMutationArea: 9.5,
              unsupportedAcres: 5.5,
              dataOrigin: "Synthetic Demo Data / নমুনা সিন্থেটিক ডেটা",
            }),
            status: "OPEN",
          },
        ],
      },
    },
  });

  // 6. Suspicious Rapid Transfer / Timing Anomaly: PLOT-KHL-6610 (Khulna)
  const parcel6 = await prisma.parcel.create({
    data: {
      parcelNumber: "PLOT-KHL-6610",
      khatianNumber: "KH-7711-SA",
      mouza: "Khalishpur",
      district: "Khulna",
      upazila: "Khalishpur",
      totalArea: 7.5,
      currentOwner: "Golam Mustafa",
      status: "FLAGGED",
      deeds: {
        create: [
          {
            deedNumber: "DEED-2023-1101",
            sellerName: "Fazlul Haque",
            buyerName: "Middleman Syndicate",
            transferredArea: 7.5,
            deedDate: new Date("2023-08-01"),
            registrationOffice: "Khulna Sadar",
            deedType: "SALE",
            serialOrder: 1,
            isVerified: true,
          },
          {
            deedNumber: "DEED-2023-1145",
            sellerName: "Middleman Syndicate",
            buyerName: "Golam Mustafa",
            transferredArea: 7.5,
            deedDate: new Date("2023-08-03"), // 48 hours later!
            registrationOffice: "Khulna Sadar",
            deedType: "SALE",
            serialOrder: 2,
            isVerified: false,
          },
        ],
      },
      anomalies: {
        create: [
          {
            anomalyType: "TIMING_ANOMALY",
            severity: "MEDIUM",
            title: "Suspicious Rapid Flip (Under 48 Hours Without Interim Mutation)",
            description: "Parcel was resold in deed DEED-2023-1145 within 2 days of acquisition without obtaining Namjari/Khatian clearance.",
            evidence: JSON.stringify({
              holdingIntervalDays: 2,
              priorDeed: "DEED-2023-1101",
              rapidDeed: "DEED-2023-1145",
              dataOrigin: "Synthetic Demo Data / নমুনা সিন্থেটিক ডেটা",
            }),
            status: "OPEN",
          },
        ],
      },
    },
  });

  // 7. Multiple Simultaneous Contradictions: PLOT-BAR-7703 (Barishal)
  const parcel7 = await prisma.parcel.create({
    data: {
      parcelNumber: "PLOT-BAR-7703",
      khatianNumber: "KH-8800-RS",
      mouza: "Kotwali",
      district: "Barishal",
      upazila: "Kotwali",
      totalArea: 5.0,
      currentOwner: "Syed Mokhlesur Rahman",
      status: "FLAGGED",
      deeds: {
        create: [
          {
            deedNumber: "DEED-2010-001",
            sellerName: "Original Titleholder",
            buyerName: "Salim Ahmed",
            transferredArea: 5.0,
            deedDate: new Date("2010-01-10"),
            registrationOffice: "Barishal Sadar",
            deedType: "SALE",
            serialOrder: 1,
            isVerified: true,
          },
          {
            deedNumber: "DEED-2016-042",
            sellerName: "Unrecorded Party X", // Chain Break
            buyerName: "Intermediary Buyer",
            transferredArea: 12.0, // Area Mismatch (> 5.0)
            deedDate: new Date("2016-05-15"),
            registrationOffice: "Barishal Sadar",
            deedType: "SALE",
            serialOrder: 2,
            isVerified: false,
          },
          {
            deedNumber: "DEED-2019-109",
            sellerName: "Unrecorded Party X", // Double Selling
            buyerName: "Syed Mokhlesur Rahman",
            transferredArea: 12.0,
            deedDate: new Date("2019-11-20"),
            registrationOffice: "Barishal Sadar",
            deedType: "SALE",
            serialOrder: 3,
            isVerified: false,
          },
        ],
      },
      anomalies: {
        create: [
          {
            anomalyType: "CHAIN_BREAK",
            severity: "CRITICAL",
            title: "Discontinuous Custody Chain (Unverified Grantor)",
            description: "Grantor 'Unrecorded Party X' possesses no preceding root in title register.",
            evidence: JSON.stringify({
              unverifiedGrantor: "Unrecorded Party X",
              priorOwner: "Salim Ahmed",
            }),
            status: "OPEN",
          },
          {
            anomalyType: "AREA_MISMATCH",
            severity: "HIGH",
            title: "Exorbitant Deed Area Beyond Khatian Bounds",
            description: "Deeds claim 12.0 decimals against 5.0 decimals surveyed plot.",
            evidence: JSON.stringify({
              surveyArea: 5.0,
              claimedArea: 12.0,
            }),
            status: "OPEN",
          },
          {
            anomalyType: "DOUBLE_SELLING",
            severity: "CRITICAL",
            title: "Double Selling by Fraudulent Grantor",
            description: "Unrecorded Party X executed two contradictory conveyances for same parcel.",
            evidence: JSON.stringify({
              deedA: "DEED-2016-042",
              deedB: "DEED-2019-109",
            }),
            status: "OPEN",
          },
        ],
      },
    },
  });

  // Initial Audit Log
  await prisma.auditLog.create({
    data: {
      parcelId: parcel1.id,
      officerName: "Automated Decision Support System",
      action: "SYNTHETIC_DATA_INITIALIZED",
      details: "Seeded 7 deterministic synthetic demonstration parcels covering all 5 P3 fraud vectors. No real citizen data used.",
    },
  });

  console.log("Synthetic data seeded successfully across all 7 demonstration parcels!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
