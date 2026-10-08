# LandTrace

## LandTech 2026
## P3 — Fraud & Double-Selling Detection

### One-Line Idea
Ownership-chain analysis to detect land fraud, double-selling, and record contradictions in Bangladesh land administration.

---

### Problem
Land administration in Bangladesh faces severe vulnerability to fraudulent conveyances, overlapping deeds, and unauthorized transfers. Because Sub-Registry deed registration records and Assistant Commissioner (Land) mutation (নামজারি / খারিজ) khatians have historically operated in departmental silos, fraudulent actors exploit information gaps to:
- Sell the same parcel multiple times to unsuspecting buyers (**Double Selling**).
- Execute deeds through phantom sellers with broken chains of custody (**Chain Break**).
- Transfer inflated acreage that exceeds the actual cadastral survey boundary (**Area Mismatch**).
- Mutate land without matching registered acquisition deeds (**Deed-Mutation Mismatch**).
- Rapidly flip land repeatedly within hours or execute anachronistic deeds (**Suspicious Timing**).

These contradictions tie citizens in decades of civil litigation, overburden land tribunals, and create land insecurity.

---

### Solution
**LandTrace** introduces an **Ownership Chain Contradiction Detection Engine** that models land records as an immutable directed chain of title. By analyzing topological custody flows from the root survey record (CS / SA / RS / City Survey) down to the latest transfer, LandTrace flags mathematical and logical contradictions in real time, equipping land officers with actionable forensic evidence.

---

### Five Detection Capabilities

1. **Double Selling (দ্বৈত বিক্রয়)**: Detects subsequent conveyances by grantors who already alienated their recorded title without verified re-acquisition.
2. **Ownership Chain Break (মালিকানা ধারাবাহিকতা বিচ্ছিন্ন)**: Identifies grantors who possess no preceding recorded acquisition deed or inheritance title in the chain of custody.
3. **Area Mismatch (খতিয়ান বনাম দলিল পরিমাপ অসঙ্গতি)**: Flags conveyances where deed acreage exceeds the parent cadastral survey khatian acreage.
4. **Deed–Mutation Mismatch (দলিল ও নামজারি অমিল)**: Flags discrepancies where mutated namjari acreage contradicts the underlying registered deed or where the mutation applicant has no matching deed of title.
5. **Wrong Transfer Timing / Suspicious Rapid Transfer (সময়ানুক্রমিক অসঙ্গতি / দ্রুত হস্তান্তর)**: Flags anachronistic deeds executed before the grantor acquired title, as well as rapid successive resales (< 7 days) without interim namjari clearance.

---

### How It Works

```text
Land Records
     ↓
Ownership Chain Construction
     ↓
Integrity & Contradiction Detection
     ↓
Risk Scoring (0–100)
     ↓
Forensic Evidence Dossier
     ↓
Officer Review & Field Inquiry
```

---

### System Architecture

```text
Officer Web App (Bilingual: বাংলা | English)
     ↓
Next.js Application / App Router API
     ↓
Ownership Chain Engine
     ↓
Fraud Detection Engine
     ↓
PostgreSQL (Neon Serverless) via Prisma ORM
     ↓
Risk Score + Forensic Evidence
```

---

### Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS v4
- **Language**: TypeScript 5
- **ORM**: Prisma 6
- **Database**: PostgreSQL (Neon Serverless)
- **Deployment**: Vercel (Automatic GitHub CI/CD)
- **Testing**: Node / TSX Native Test Suite
- **Icons**: Lucide React

---

### Synthetic Data
> **Notice**: All demonstration records across the 7 test parcels are **100% synthetic/dummy data**. No real citizen names, real land records, or personal identifying information are stored or used.

---

### Privacy & Security
- **No real citizen land records are used.**
- **No government portal is scraped.**
- **No live government system is accessed without authorization.**

---

### Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Configure local environment variables
cp .env.example .env.local
# Edit .env.local with your database connection string

# 3. Generate Prisma client
npx prisma generate

# 4. Synchronize database schema
npx prisma db push

# 5. Seed synthetic demonstration data
npm run seed

# 6. Start local development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

### Testing

Run the full P3 detection engine test suite (covering all 8 scenarios):

```bash
npm test
```

---

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

---

### Deployment

The project is connected to Vercel via GitHub:
- **Repository**: [https://github.com/RafiulKabir0/landtrace](https://github.com/RafiulKabir0/landtrace)
- **Production URL**: [https://landtrace-rafiul-kabir.vercel.app](https://landtrace-rafiul-kabir.vercel.app)

Every push to the `main` branch triggers an automated build and deployment on Vercel.

---

### Future Government Integration

```text
Existing Government Systems (e-Mutation / e-Registration)
     ↓
Authorized API / Data Integration Layer
     ↓
LandTrace
     ↓
Contradiction Detection Engine
     ↓
Officer Decision Support
```

*Note: LandTrace does not claim current government API access; this illustrates the planned architecture upon government integration.*

---

### AI Tools Disclosure
This project was developed with the assistance of **Google Antigravity (Gemini)** for pair programming, test case design, bilingual interface localization, and architecture documentation review. All code, schemas, and detection logic were verified and tested.

---

### Project Limitations
- **Synthetic Data**: Operates on deterministic synthetic test datasets for Round 1 demonstration.
- **Prototype**: Prototype decision-support system designed for hackathon demonstration.
- **Decision-Support Only**: LandTrace assists Assistant Commissioners (Land) and Sub-Registrars with forensic contradiction analysis; it **does not legally determine ownership** or issue judicial decrees.

---

### Team
**LandTrace** — LandTech 2026 Hackathon
