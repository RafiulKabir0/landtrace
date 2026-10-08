import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding synthetic LandTrace data...");

  // Clear existing demo records
  await prisma.auditLog.deleteMany();
  await prisma.fraudAnomaly.deleteMany();
  await prisma.mutationRecord.deleteMany();
  await prisma.deedRecord.deleteMany();
  await prisma.parcel.deleteMany();

  // 1. Clean Verified Parcel: PLOT-DH-1001 (Tejgaon, Dhaka)
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
      currentOwner: "Contested (Multiple Claimants)",
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
            sellerName: "Abdur Rashid", // Sold again by previous seller!
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
            title: "Simultaneous / Subsequent Sale by Non-Titleholder",
            description: "Abdur Rashid alienated 15.0 decimals to Tariqul Alam in 2018, but executed a subsequent deed (DEED-2021-3948) to Farhana Yasmin without title.",
            evidence: JSON.stringify({
              firstDeed: "DEED-2018-1100",
              secondDeed: "DEED-2021-3948",
              compromisedParty: "Farhana Yasmin",
              overlappingAreaDecimals: 15.0,
            }),
            status: "OPEN",
          },
        ],
      },
    },
  });

  // 3. Area Mismatch Anomaly: PLOT-CTG-3301 (Pahartali, Chattogram)
  const parcel3 = await prisma.parcel.create({
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
            transferredArea: 14.5, // Exceeds parcel boundary of 8.0 decimals
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
              unit: "decimals",
            }),
            status: "INVESTIGATING",
          },
        ],
      },
    },
  });

  // Add initial Audit Log
  await prisma.auditLog.create({
    data: {
      parcelId: parcel1.id,
      officerName: "System Automated Verifier",
      action: "INITIAL_INTEGRITY_SCAN",
      details: "Synthetic dataset seeded and scanned against LandTrace integrity verification engine.",
    },
  });

  console.log("Synthetic data seeded successfully!");
  console.log({
    parcelsCreated: 3,
    anomaliesGenerated: 2,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
