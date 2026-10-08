# LandTrace: Concept Note
## Problem Statement P3 — Fraud & Double-Selling Detection
### LandTech Hackathon 2026

---

### 1. Selected Problem Statement
**P3: Fraud & Double-Selling Detection**
*Objective*: Build an automated ownership-chain analysis engine to detect land fraud, double-selling, chain discontinuity, and deed-mutation contradictions across historical and ongoing land conveyances in Bangladesh.

---

### 2. Bangladesh Context
Land ownership in Bangladesh is historically governed through a dual-channel administrative architecture:
1. **Deed Registration**: Administered by the Directorate of Registration under the Ministry of Law, Justice and Parliamentary Affairs (Sub-Registry offices).
2. **Record of Rights & Mutation (নামজারি / খতিয়ান)**: Administered by Upazila Land Offices (Assistant Commissioner - Land) under the Ministry of Land.

Because these registries operated independently without automated topological validation, fraudulent individuals routinely exploit archival gaps between deed execution and mutation approval to execute unauthorized transactions.

---

### 3. Problem
The lack of real-time title chain contradiction detection results in severe systemic issues:
- **Double Selling**: A seller executes a transfer to Buyer A, and then re-sells the identical or overlapping interest to Buyer B before Buyer A can mutate the khatian.
- **Ghost Grantors (Chain Breaks)**: Deeds executed by individuals who hold no legitimate predecessor in the chain of title.
- **Area Inflation**: Conveyances claiming acreage greater than the parent cadastral survey record (CS, SA, RS, BS/City Survey).
- **Deed-Mutation Mismatches**: Unscrupulous namjari approvals that contradict deed stipulations.
- **Litigation Crisis**: Over 70% of pending civil litigations in Bangladesh courts originate from fraudulent and contradictory land records.

---

### 4. Proposed Solution: LandTrace
**LandTrace** is an automated **Ownership Chain Contradiction Detection Engine** designed as a **Decision-Support System (DSS)** for Sub-Registrars and Assistant Commissioners (Land). 

Instead of treating land transactions as isolated paper entries, LandTrace constructs a **directed acyclic ownership graph** for every cadastral plot, continuously verifying mathematical, spatial, and chronological integrity across five core fraud vectors.

---

### 5. System Architecture & Information Flow

```text
[ Cadastral Records & Khatians ] + [ Sub-Registry Deeds ]
                     ↓
        [ Data Normalization Layer ]
                     ↓
      [ Directed Ownership Chain Engine ]
                     ↓
     [ Five-Vector Contradiction Audit ]
  ┌───────────────┬───────────────┬────────────────┐
  │ Double-Sell   │ Chain Break   │ Area Overflow  │
  ├───────────────┼───────────────┴────────────────┘
  │ Deed-Mutation │ Rapid Flip / Anachronism       │
  └───────────────┴────────────────────────────────┘
                     ↓
     [ Forensic Risk Score (0–100) ]
                     ↓
[ Bilingual Officer Dashboard (AC-Land / Sub-Registrar) ]
```

---

### 6. Technology Stack
- **Web Application & APIs**: Next.js 16 (React 19, Server Components, TypeScript)
- **Styling**: Tailwind CSS v4 (Government-style bilingual interface)
- **Database Engine**: PostgreSQL on Neon Serverless (SSL-encrypted, pooled + unpooled architecture)
- **ORM & Data Modeling**: Prisma 6 Client
- **Detection Engine**: Native TypeScript topological contradiction analyzer
- **Hosting & CI/CD**: Vercel (Automated Git integration from GitHub `main`)

---

### 7. Key Features
1. **Bilingual Administrative Interface**: Default বাংলা (Bangla) with instant English toggle, tailored for field land officers.
2. **Interactive Title Timeline**: Chronological visual flow of every conveyance from root survey to current claimant.
3. **Pre-Registration Risk Check**: Real-time simulation tool allowing Sub-Registrars to audit proposed deeds *before* formal registration.
4. **Forensic Evidence Dossier**: Generates detailed, printable evidentiary findings citing conflicting deed numbers, acreage variances, and dates.
5. **Decision-Support Action Trail**: Enables officers to mark records for review, dispatch field inquiries, and add investigation notes.

---

### 8. The Five Detection Capabilities

| Detection Capability | Logic & Trigger Condition | Administrative Impact |
| :--- | :--- | :--- |
| **1. Double Selling** | Identifies subsequent alienation by a grantor who already transferred title without intervening re-acquisition. | Prevents predatory resale of sold plots to second buyers. |
| **2. Chain Break** | Detects deeds where the grantor has no preceding record as a grantee in parent deeds or inheritance khotians. | Eliminates forged deeds by phantom grantors. |
| **3. Area Mismatch** | Flags deeds where transferred area exceeds the parent surveyed khatian acreage. | Halts fraudulent acreage inflation beyond plot boundaries. |
| **4. Deed–Mutation Mismatch** | Cross-validates AC-Land namjari records against sub-registry deeds for area and applicant divergence. | Prevents unauthorized mutations conflicting with registered deeds. |
| **5. Wrong Timing / Rapid Flip** | Detects anachronistic deeds (sale before purchase) and flips under 7 days without namjari clearance. | Flags speculative syndicates and counterfeit backdated deeds. |

---

### 9. Synthetic Data & Privacy Compliance
- **Zero Real Citizen Data**: Round 1 strictly employs deterministic synthetic demo data.
- **Ethical Integrity**: No government portal was scraped, and no unauthorized databases were accessed.
- **Privacy First**: All names, plot numbers, and amounts are fictional constructs designed to rigorously test edge cases.

---

### 10. Countrywide Implementation Plan

```text
Phase 1 (Pilot — Months 1–4)
Deploy in 2 Upazilas (e.g., Tejgaon, Dhaka and Sylhet Sadar) in parallel with e-Mutation & e-Registration.

Phase 2 (Divisional Rollout — Months 5–10)
Integrate LandTrace API into divisional Land Commissionerates; train AC (Land) and Kanungo officers.

Phase 3 (Nationwide Deployment — Months 11–18)
Full nationwide rollout across all 64 districts with centralized Ministry of Land dashboards.
```

---

### 11. Team & Mentor Details
- **Project**: LandTrace
- **Problem Category**: P3 — Fraud & Double-Selling Detection
- **Hackathon**: LandTech 2026
- **Developed by**: Team LandTrace
- **Mentor**: Land Administration & Legal Domain Advisors
