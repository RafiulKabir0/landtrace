# LandTrace: Concept Note
## Problem Statement P3 — Fraud & Double-Selling Detection
### LandTech Hackathon 2026

---

### 1. Selected Problem Statement
**P3: Fraud & Double-Selling Detection**
*Objective*: Build an automated ownership-chain analysis engine to detect land fraud, double-selling, chain discontinuity, and deed-mutation contradictions across historical and ongoing land conveyances in Bangladesh.

---

### 2. Bangladesh Context & Administrative Background
Land ownership in Bangladesh is historically governed through a dual-channel administrative architecture across two separate ministries:
1. **Deed Registration**: Administered by the Directorate of Registration under the Ministry of Law, Justice and Parliamentary Affairs (Sub-Registry offices), governing the execution and archiving of registered deeds (দলিল).
2. **Record of Rights & Mutation (নামজারি / খতিয়ান)**: Administered by Upazila Land Offices (Assistant Commissioner - Land) under the Ministry of Land, governing cadastral survey records (CS, SA, RS, BS/City Survey) and mutation khatians.

Because these registries historically operated in administrative silos without automated cross-verification, opportunistic syndicates exploit procedural gaps between deed execution and mutation approval to execute unauthorized transactions.

---

### 3. Problem Analysis
The absence of automated title custody cross-verification enables recurring fraud patterns in land transfers:
- **Double Selling (দ্বৈত বিক্রয়)**: Predatory resale of previously alienated land to secondary buyers before the primary buyer completes the mutation process.
- **Ownership Chain Breaks (ধারাবাহিকতা বিচ্ছিন্ন)**: Execution of deeds by unverified or fictitious grantors who possess no legitimate predecessor title in the recorded chain of custody.
- **Area Inflation & Mismatches (পরিমাপের অসঙ্গতি)**: Transfer deeds claiming acreage in excess of the parent cadastral survey khatian boundary or cumulative plot shares.
- **Deed–Mutation Discrepancies (দলিল-নামজারি অমিল)**: Mutations sanctioned for acreage or applicants inconsistent with underlying registered deeds.
- **Judicial Backlog**: Land title contradictions and fraudulent conveyances constitute a predominant driver of protracted civil litigation and tribunal case backlogs across Bangladesh.

---

### 4. Proposed Solution: LandTrace
**LandTrace** is an automated **Ownership Chain Contradiction Detection Engine** designed as a **Decision-Support System (DSS)** for Sub-Registrars and Assistant Commissioners (Land).

Instead of treating land transactions as isolated paper entries, LandTrace models land holdings as directed title custody graphs, evaluating mathematical, spatial, and chronological integrity across five core fraud vectors on demand.

```text
Land Records (Deeds & Khatians) ➔ Data Normalization ➔ Directed Ownership Chain Engine
     ➔ Five-Vector Contradiction Audit ➔ Risk Scoring (0–100) ➔ Officer Decision Support
```

*Decision-Support Distinction*: LandTrace equips land officers with structured forensic discrepancy findings; it does not adjudicate legal ownership or replace judicial authority.

---

### 5. System Architecture & Information Flow

LandTrace operates as a modular full-stack web application with decoupled engine services, deployed on serverless cloud infrastructure:
- **Presentation Layer**: Bilingual administrative portal (বাংলা default / English) built with Next.js 16 App Router and Tailwind CSS v4.
- **Application & Logic Layer**: Server Components and route handlers executing a pure TypeScript topological contradiction engine with sub-second on-demand evaluation.
- **Data Persistence Layer**: Neon Serverless PostgreSQL 16 with SSL pooling, managed by Prisma 6 ORM.
- **Continuous Deployment**: Git-driven automated pipeline via GitHub and Vercel.

```text
Officer Web App (Bilingual: বাংলা | English)
     ↓
Next.js App Router API & Server Components
     ↓
Ownership Chain Contradiction Engine (Pure TypeScript)
     ↓
PostgreSQL on Neon Serverless (Prisma 6 Client)
     ↓
Calibrated Risk Score (0–100) + Forensic Evidence Dossier
```

---

### 6. Technology Stack
- **Web Application & APIs**: Next.js 16 (React 19, Server Components, TypeScript 5)
- **Styling**: Tailwind CSS v4 (Government-style bilingual interface)
- **Database Engine**: PostgreSQL 16 on Neon Serverless (SSL-encrypted, pooled + unpooled architecture)
- **ORM & Data Modeling**: Prisma 6 Client
- **Detection Engine**: Pure TypeScript topological contradiction analyzer
- **Hosting & CI/CD**: Vercel Serverless (Automated Git integration from GitHub `main`)
- **Testing**: Node Native Test Runner (`tsx --test`)

---

### 7. Key Features
1. **Bilingual Administrative Interface**: Default বাংলা (Bangla) aligned with official land terminology (খতিয়ান, দাগ, মৌজা, নামজারি) with instant English toggle.
2. **Interactive Title Timeline**: Chronological visual flow of every conveyance from root survey grant down to current claimant.
3. **Pre-Registration Risk Check**: Interactive simulation tool allowing Sub-Registrars to audit proposed deeds *before* formal registration.
4. **Forensic Evidence Dossier**: Generates detailed, printable evidentiary findings citing conflicting deed numbers, acreage variances, dates, and parties.
5. **Persistent Officer Action Trail**: Action logging for recording officer reviews, dispatching field inquiries, and adding inspection notes.

---

### 8. The Five Detection Capabilities

| Detection Capability | Logic & Mathematical Trigger Condition | Administrative Impact |
| :--- | :--- | :--- |
| **1. Double Selling (দ্বৈত বিক্রয়)** | Identifies subsequent alienation by a grantor who already transferred title without intervening re-acquisition: `Date(Sale B) > Date(Sale A) ∧ Title(S) == 0` | Prevents predatory resale of sold plots before mutation. |
| **2. Chain Break (ধারাবাহিকতা বিচ্ছিন্ন)** | Detects deeds where the grantor has no preceding record as a grantee in parent deeds, survey khatian, or inheritance records: `G ∉ ValidGranteeSet(N-1)` | Eliminates fraudulent conveyances by unverified or phantom grantors. |
| **3. Area Mismatch (পরিমাপের গরমিল)** | Flags deeds where transferred area exceeds the parent surveyed khatian acreage or cumulative shares: `Area(Deed) > Area(Khatian)` | Halts fraudulent acreage inflation beyond plot boundaries. |
| **4. Deed–Mutation Mismatch (দলিল-নামজারি অমিল)** | Cross-validates AC-Land namjari records against sub-registry deeds for area divergence (`\|Area(Mut) - Area(Deed)\| > 0.05`) or unlinked applicants. | Prevents unauthorized mutations conflicting with registered deeds. |
| **5. Wrong Timing / Rapid Flip (সময়ানুক্রমিক অসঙ্গতি)** | Detects anachronistic deeds (`Date(Sale) < Date(Acquisition)`) or rapid speculative flipping (`Interval < 7 days`) without interim namjari clearance. | Flags speculative syndicates and counterfeit backdated deeds. |

---

### 9. Current Prototype vs. Future Government Integration
- **Current Implementation (Round 1 Prototype)**: Standalone decision-support prototype evaluating deterministic synthetic datasets across 7 benchmark test parcels. It operates independently without connecting to live government databases, scrapes no public portals, and stores zero real citizen records or PII.
- **Benchmark Coverage**: Seven deterministic test parcels demonstrate valid chains (`PLOT-DH-1001`) and distinct fraud edge cases (`PLOT-DH-2045` double-selling, `PLOT-SYL-5501` chain break, `PLOT-CTG-3301` area mismatch, `PLOT-RAJ-4402` deed-mutation mismatch, `PLOT-KHL-6610` rapid flip, `PLOT-BAR-7703` multiple contradictions).
- **Ethical & Regulatory Compliance**: Strictly synthetic test scenarios reflecting authentic Bangladeshi deed and khatian structures without real personal data.

---

### 10. Countrywide Implementation Roadmap

```text
Phase 1 (Pilot — Months 1–4)
Deploy in 2 Upazilas (e.g., Tejgaon, Dhaka and Sylhet Sadar) in parallel with e-Mutation & e-Registration.

Phase 2 (Divisional Rollout — Months 5–10)
Integrate LandTrace API into divisional Land Commissionerates; train AC (Land), Sub-Registrars, and Kanungos.

Phase 3 (Nationwide Deployment — Months 11–18)
Full nationwide rollout across all 64 districts with centralized Ministry of Land dashboards.
```

---

### 11. Legal & Regulatory Boundary
**Decision-Support Notice**: LandTrace is designed strictly as an analytical decision-support tool for land officers. It does not issue judicial decrees, adjudicate legal ownership, or replace the statutory authority of Land Tribunals, Sub-Registrars, and Assistant Commissioners (Land) under the State Acquisition and Tenancy Act 1950 or Registration Act 1908.

---

### 12. Proposed Future Government Systems Integration Plan

```text
[ e-Registration (Sub-Registry) ] ───┐
                                      ├── Authorized Read-Only REST APIs ──➔ [ LandTrace Engine ]
[ e-Mutation (AC Land / Khatian) ] ──┘                                        │
                                                                               ▼
                                                                   [ Officer Review & Audit ]
```

*Note: Illustrates the proposed production target architecture upon formal government onboarding, distinct from the current standalone synthetic demonstration prototype.*

---

### 13. Team & Mentor Details
- **Project**: LandTrace
- **Problem Category**: P3 — Fraud & Double-Selling Detection
- **Hackathon**: LandTech Hackathon 2026
- **Team Name**: Team LandTrace
- **Lead Developer**: Rafiul Kabir (GitHub: [@RafiulKabir0](https://github.com/RafiulKabir0))
- **Mentor Details**: None assigned / Self-directed (Independent submission)
- **Live Production URL**: [https://landtrace.vercel.app](https://landtrace.vercel.app)
- **GitHub Repository**: [https://github.com/RafiulKabir0/landtrace](https://github.com/RafiulKabir0/landtrace)
