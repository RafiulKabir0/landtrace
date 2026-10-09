import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  auditParcel,
  detectDoubleSelling,
  detectChainBreaks,
  detectAreaMismatch,
  detectDeedMutationMismatch,
  detectTimingAnomalies,
  ParcelRecord,
} from "../src/lib/detection-engine.js";

describe("LandTrace P3 Fraud Detection Engine Tests", () => {
  // Test 1: Valid Chain of Title
  it("Scenario 1: Valid clean chain of title should yield 0 anomalies and CLEAN risk", () => {
    const validParcel: ParcelRecord = {
      id: "p1",
      parcelNumber: "PLOT-TEST-1001",
      khatianNumber: "KH-1001",
      mouza: "Tejgaon",
      district: "Dhaka",
      upazila: "Tejgaon",
      totalArea: 10.0,
      currentOwner: "Mohammad Karim",
      deeds: [
        {
          id: "d1",
          deedNumber: "DEED-2005-01",
          sellerName: "Government Land Record Board",
          buyerName: "Rafiqul Islam",
          transferredArea: 10.0,
          deedDate: "2005-01-10",
          registrationOffice: "Dhaka Sadar",
          deedType: "GRANT",
        },
        {
          id: "d2",
          deedNumber: "DEED-2015-02",
          sellerName: "Rafiqul Islam",
          buyerName: "Mohammad Karim",
          transferredArea: 10.0,
          deedDate: "2015-06-20",
          registrationOffice: "Tejgaon",
          deedType: "SALE",
        },
      ],
      mutations: [
        {
          id: "m1",
          caseNumber: "MUT-2016-01",
          applicantName: "Mohammad Karim",
          mutatedArea: 10.0,
          khatianNumber: "KH-1001-MUT",
          approvalDate: "2016-01-15",
          officerName: "AC Land Tejgaon",
          status: "APPROVED",
        },
      ],
    };

    const audit = auditParcel(validParcel);
    assert.equal(audit.anomalies.length, 0);
    assert.equal(audit.chainIsValid, true);
    assert.equal(audit.riskLevel, "CLEAN");
    assert.equal(audit.riskScore, 0);
  });

  // Test 2: Double Selling Detection
  it("Scenario 2: Double selling detection when same seller sells to two buyers without reacquisition", () => {
    const deeds = [
      {
        id: "d1",
        deedNumber: "DEED-2018-01",
        sellerName: "Abdur Rashid",
        buyerName: "Tariqul Alam",
        transferredArea: 12.0,
        deedDate: "2018-05-10",
        registrationOffice: "Gulshan",
        deedType: "SALE",
      },
      {
        id: "d2",
        deedNumber: "DEED-2021-02",
        sellerName: "Abdur Rashid", // Sold again without holding title
        buyerName: "Farhana Yasmin",
        transferredArea: 12.0,
        deedDate: "2021-11-04",
        registrationOffice: "Gulshan",
        deedType: "SALE",
      },
    ];

    const anomalies = detectDoubleSelling(deeds);
    assert.equal(anomalies.length, 1);
    assert.equal(anomalies[0].anomalyType, "DOUBLE_SELLING");
    assert.equal(anomalies[0].severity, "CRITICAL");
  });

  // Test 3: Ownership Chain Break
  it("Scenario 3: Ownership chain break detection when grantor was never recorded in title history", () => {
    const deeds = [
      {
        id: "d1",
        deedNumber: "DEED-2000-01",
        sellerName: "Original Owner",
        buyerName: "Buyer Alpha",
        transferredArea: 8.0,
        deedDate: "2000-01-01",
        registrationOffice: "Sadar",
        deedType: "SALE",
      },
      {
        id: "d2",
        deedNumber: "DEED-2010-02",
        sellerName: "Ghost Seller Unrecorded", // Has no link to Buyer Alpha or Original Owner
        buyerName: "Buyer Beta",
        transferredArea: 8.0,
        deedDate: "2010-05-12",
        registrationOffice: "Sadar",
        deedType: "SALE",
      },
    ];

    const anomalies = detectChainBreaks(deeds);
    assert.equal(anomalies.length, 1);
    assert.equal(anomalies[0].anomalyType, "CHAIN_BREAK");
    assert.equal(anomalies[0].severity, "CRITICAL");
  });

  // Test 4: Area Mismatch
  it("Scenario 4: Area mismatch detection when deed acreage exceeds parent survey Khatian acreage", () => {
    const deeds = [
      {
        id: "d1",
        deedNumber: "DEED-2012-01",
        sellerName: "Kabir Hossain",
        buyerName: "Shamsul Huda",
        transferredArea: 16.5, // Exceeds survey acreage of 8.0
        deedDate: "2012-04-10",
        registrationOffice: "Chattogram Sadar",
        deedType: "SALE",
      },
    ];

    const anomalies = detectAreaMismatch(deeds, 8.0);
    assert.equal(anomalies.length, 1);
    assert.equal(anomalies[0].anomalyType, "AREA_MISMATCH");
    assert.equal(anomalies[0].severity, "HIGH");
  });

  // Test 5: Deed-Mutation Mismatch
  it("Scenario 5: Deed-Mutation mismatch detection when mutated acreage contradicts registered deed", () => {
    const deeds = [
      {
        id: "d1",
        deedNumber: "DEED-2014-01",
        sellerName: "Abdul Matin",
        buyerName: "Zahid Hasan",
        transferredArea: 5.0,
        deedDate: "2014-03-15",
        registrationOffice: "Rajshahi Sadar",
        deedType: "SALE",
      },
    ];

    const mutations = [
      {
        id: "m1",
        caseNumber: "MUT-2015-99",
        applicantName: "Zahid Hasan",
        mutatedArea: 9.5, // 9.5 decimals mutated vs 5.0 in deed!
        khatianNumber: "KH-4402-MUT",
        approvalDate: "2015-08-10",
        officerName: "AC Land",
        status: "APPROVED",
      },
    ];

    const anomalies = detectDeedMutationMismatch(deeds, mutations);
    assert.equal(anomalies.length, 1);
    assert.equal(anomalies[0].anomalyType, "DEED_MUTATION_MISMATCH");
    assert.equal(anomalies[0].severity, "HIGH");
  });

  // Test 6: Wrong Transfer Timing (Anachronistic Transfer)
  it("Scenario 6: Timing anomaly detection when sale deed date is before seller acquired title", () => {
    const deeds = [
      {
        id: "d1",
        deedNumber: "DEED-ACQ-2020",
        sellerName: "Seller One",
        buyerName: "Middleman Ali",
        transferredArea: 10.0,
        deedDate: "2020-05-01", // Acquired in May 2020
        registrationOffice: "Khulna",
        deedType: "SALE",
      },
      {
        id: "d2",
        deedNumber: "DEED-SALE-2019",
        sellerName: "Middleman Ali", // Sold in January 2019 before acquiring!
        buyerName: "Buyer Final",
        transferredArea: 10.0,
        deedDate: "2019-01-15",
        registrationOffice: "Khulna",
        deedType: "SALE",
      },
    ];

    const anomalies = detectTimingAnomalies(deeds);
    assert.ok(anomalies.some((a) => a.severity === "CRITICAL"));
  });

  // Test 7: Suspicious Rapid Transfer
  it("Scenario 7: Suspicious rapid flip (< 7 days) without namjari clearance", () => {
    const deeds = [
      {
        id: "d1",
        deedNumber: "DEED-ACQ-01",
        sellerName: "Original Owner",
        buyerName: "Flipper Trader",
        transferredArea: 10.0,
        deedDate: "2022-03-01",
        registrationOffice: "Dhaka",
        deedType: "SALE",
      },
      {
        id: "d2",
        deedNumber: "DEED-FLIP-02",
        sellerName: "Flipper Trader",
        buyerName: "Target Buyer",
        transferredArea: 10.0,
        deedDate: "2022-03-03", // 2 days later!
        registrationOffice: "Dhaka",
        deedType: "SALE",
      },
    ];

    const anomalies = detectTimingAnomalies(deeds);
    assert.ok(anomalies.some((a) => a.anomalyType === "TIMING_ANOMALY" && a.severity === "MEDIUM"));
  });

  // Test 8: Multiple Simultaneous Contradictions
  it("Scenario 8: Multiple contradictions on compromised parcel should trigger CRITICAL_RISK", () => {
    const compromisedParcel: ParcelRecord = {
      id: "comp1",
      parcelNumber: "PLOT-MULTI-CONTRA",
      khatianNumber: "KH-9999",
      mouza: "Barishal Sadar",
      district: "Barishal",
      upazila: "Kotwali",
      totalArea: 6.0,
      currentOwner: "Fraud Claimant",
      deeds: [
        {
          id: "d1",
          deedNumber: "DEED-ROOT-01",
          sellerName: "Government Grant",
          buyerName: "First Buyer",
          transferredArea: 6.0,
          deedDate: "2010-01-01",
          registrationOffice: "Barishal",
          deedType: "GRANT",
        },
        {
          id: "d2",
          deedNumber: "DEED-CHAINBREAK-02",
          sellerName: "Unknown Phantom", // Chain break
          buyerName: "Second Buyer",
          transferredArea: 15.0, // Area mismatch (> 6.0)
          deedDate: "2015-01-01",
          registrationOffice: "Barishal",
          deedType: "SALE",
        },
        {
          id: "d3",
          deedNumber: "DEED-DOUBLESELL-03",
          sellerName: "Unknown Phantom", // Double selling
          buyerName: "Third Buyer",
          transferredArea: 15.0,
          deedDate: "2018-01-01",
          registrationOffice: "Barishal",
          deedType: "SALE",
        },
      ],
      mutations: [
        {
          id: "m1",
          caseNumber: "MUT-999",
          applicantName: "Third Buyer",
          mutatedArea: 25.0, // Deed-mutation mismatch
          khatianNumber: "KH-9999-MUT",
          approvalDate: "2019-01-01",
          officerName: "AC Land",
          status: "APPROVED",
        },
      ],
    };

    const audit = auditParcel(compromisedParcel);
    assert.ok(audit.anomalies.length >= 3);
    assert.equal(audit.chainIsValid, false);
    assert.equal(audit.riskLevel, "CRITICAL_RISK");
    assert.ok(audit.riskScore >= 80);
  });
});
