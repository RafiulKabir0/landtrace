# LandTrace

## LandTech 2026
## Problem Statement P3 — Fraud & Double-Selling Detection

### One-Line Idea
Ownership-chain analysis to detect land fraud, double-selling, and record contradictions in Bangladesh land administration.

---

### The Problem
Land administration in Bangladesh faces severe vulnerability to fraudulent conveyances, overlapping deeds, and unauthorized transfers. Because Sub-Registry deed registration records and Assistant Commissioner (Land) mutation (নামজারি / খারিজ) khatians have historically operated in departmental silos, fraudulent actors exploit information gaps to:
- Sell the same parcel multiple times to unsuspecting buyers (**Double Selling**).
- Execute deeds through phantom sellers with broken chains of custody (**Chain Break**).
- Transfer inflated acreage that exceeds the actual cadastral survey boundary (**Area Mismatch**).
- Mutate land without matching registered acquisition deeds (**Deed-Mutation Mismatch**).
- Rapidly flip land repeatedly within hours or execute anachronistic deeds (**Suspicious Timing**).

These contradictions tie citizens in decades of civil litigation, overburden land tribunals, and create land insecurity.

---

### The Solution
**LandTrace** introduces an **Ownership Chain Contradiction Detection Engine** that models land records as a directed chain of title. By analyzing topological custody flows from the root survey record (CS / SA / RS / BS) down to the latest transfer, LandTrace detects mathematical and logical contradictions on demand, equipping land officers with actionable forensic evidence.

---

### Five Core Detection Capabilities & Recommended Human Review Actions

1. **Double Selling (দ্বৈত বিক্রয়)**: Detects subsequent conveyances by grantors who already alienated their recorded title without verified re-acquisition.
   - *Recommended Action*: Order Sub-Registry volume register inspection and on-site physical possession inquiry.
2. **Ownership Chain Break (মালিকানা ধারাবাহিকতা বিচ্ছিন্ন)**: Identifies grantors who possess no preceding recorded acquisition deed or inheritance title in the chain of custody.
   - *Recommended Action*: Withhold mutation pending verification of root CS/SA records and legal heirship certificates.
3. **Area Mismatch (খতিয়ান বনাম দলিল পরিমাপ অসঙ্গতি)**: Flags conveyances where deed acreage exceeds the parent cadastral survey khatian acreage.
   - *Recommended Action*: Depute Kanungo / Surveyor for digital cadastral map verification and physical boundary demarcation.
4. **Deed–Mutation Mismatch (দলিল ও নামজারি অমিল)**: Flags discrepancies where mutated namjari acreage contradicts the underlying registered deed or where the mutation applicant has no matching deed of title.
   - *Recommended Action*: Summon AC (Land) case records and Sub-Registry volume register for comparative hearing.
5. **Wrong Transfer Timing / Suspicious Rapid Transfer (সময়ানুক্রমিক অসঙ্গতি / দ্রুত হস্তান্তর)**: Flags anachronistic deeds executed before the grantor acquired title, as well as rapid successive resales (< 7 days) without interim namjari clearance.
   - *Recommended Action*: Investigate potential fraudulent collusion or anachronistic conveyance prior to legitimate acquisition.

---

### Simple, Secure Authentication & Role Management

LandTrace features server-side session management with signed HMAC-SHA256 tokens and bcrypt password hashing.

#### Three Distinct User Roles:
1. **Citizen (নাগরিক)**:
   - Accesses permitted citizen-facing features and designated land records.
   - Uses the Pre-Registration Risk Check Simulator to verify prospective deeds prior to purchase.
   - Cannot access officer investigation actions or administrative user management.
2. **Land Official (ভূমি কর্মকর্তা — AC Land / Sub-Registrar)**:
   - Searches and audits all land records.
   - Inspects full ownership chains, forensic parameters, and discrepancy metrics.
   - Records investigation actions: Mark for Review, Request Field Inquiry, Add Note, Forward to Higher Authority.
   - Generates and prints official Forensic Investigation Dossiers.
   - Cannot modify system administrator settings or user roles.
3. **Administrator (সিস্টেম অ্যাডমিন)**:
   - Full access to all official features plus User Management (`/api/admin/users`).
   - Activates/deactivates user accounts and assigns permitted roles.
   - Safeguarded against self-deactivation.

#### Demo Accounts for Competition Evaluation:
The application includes a **1-Click Demo Role Switcher** on the top header and login modal for instant evaluation:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Citizen** | `citizen@demo.landtrace.gov.bd` | `Citizen@LandTrace2026!` | Designated plot `PLOT-DH-1001` + Pre-Registration Check |
| **Land Official** | `officer@demo.landtrace.gov.bd` | `Officer@LandTrace2026!` | Full record search, forensic dossier, officer actions |
| **Administrator** | `admin@demo.landtrace.gov.bd` | `Admin@LandTrace2026!` | All features + User & Security Management |

#### Initial Admin Provisioning Method:
To securely provision a custom initial administrator without hardcoded credentials, define these environment variables:
```bash
INITIAL_ADMIN_EMAIL="admin@yourdomain.gov.bd"
INITIAL_ADMIN_PASSWORD="YourStrongPassword2026!"
```
Upon running `npm run seed`, LandTrace will securely hash the password with bcrypt and upsert the administrator record.

---

### Data Model & Ownership Chain Architecture

The database model (`prisma/schema.prisma`) represents:
- **Surveys**: Cadastral survey types (CS, SA, RS, BS/BRS, City Survey).
- **Parcels**: Mouza, district, upazila, khatian number, dag (plot) number, total area in decimals (শতাংশ), current owner, ownership shares (co-owners and percentage), and cadastral provenance.
- **Deeds**: Registration office, deed serial, grantor (seller), grantee (buyer), transferred area, execution date, deed type (Sale/Grant/Inheritance).
- **Mutations**: Case number, applicant name, mutated area, approved khatian number, approval date, approving officer (AC Land).
- **Anomalies**: Anomaly type, severity (Critical/High/Medium/Low), technical forensic parameters, and detected timestamps.
- **Audit Logs**: Officer name, user ID, parcel ID, action type, persistent details, and timestamps.

---

### Five-Layer User Experience Architecture

1. **Layer 1: Public Homepage (পাবলিক হোমপেজ)**
   - First-time visitors immediately grasp the platform's purpose within 10–15 seconds.
   - LandTrace branding, Problem P3 badge, and primary action: **“জমির রেকর্ড যাচাই করুন”**.
   - **Public Quick Search**: Instant verification by Dag, Khatian, Mouza, or Deed with 6 sample query chips.
   - Three-step verification process cards (Search → Title Chain Matching → Fraud Detection).
   - Five compact P3 detection capability summary cards with automated test metrics (24/24 passing).
   - Three Role Entry Portals (নাগরিক, ভূমি কর্মকর্তা, প্রশাসক) with 1-click test triggers.
   - Synthetic demonstration data notice and government-service style 4-column footer.

2. **Layer 2: Authentication (নিরাপদ প্রবেশদ্বার)**
   - Clear entry points: **নাগরিক লগইন**, **ভূমি কর্মকর্তা লগইন**, **প্রশাসক লগইন**.
   - Role-switching demo credential auto-fill for evaluation speed.
   - Password visibility control (`Eye` / `EyeOff` toggle).
   - Public self-registration is strictly restricted to Citizen accounts on both client and server (`/api/auth/register`).
   - Server-side HMAC-SHA256 session token cookies and bcrypt password hashing.

3. **Layer 3: Role-Based Dashboards (ভূমিকাভিত্তিক ড্যাশবোর্ড)**
   - **Citizen (নাগরিক)**: Restricted strictly to designated parcel `PLOT-DH-1001` and the Pre-Registration Risk Check Simulator. Server-side API protection prevents unauthorized record access.
   - **Land Official (ভূমি কর্মকর্তা)**: Complete registry search, forensic dossier inspection, and decision-support actions (Mark for Review, Field Inquiry, Investigation Notes, Forward to Higher Authority).
   - **Administrator (সিস্টেম অ্যাডমিন)**: Account lifecycle management, role assignment, and security audit trail oversight.

4. **Layer 4: Land Record Verification & Forensic Investigation (রেকর্ড যাচাই ও তদন্ত)**
   - **Survey Record History (CS, SA, RS, BS)**: Dedicated cadastral survey card with clear disclaimer: *Cadastral surveys recorded physical possession at the time of survey; they do not automatically prove continuous legal ownership title.*
   - **Ownership Transfer Chain**: Distinct chronological chain of registered sale deeds, transfer acreages, and approved AC (Land) mutation orders.
   - Real-time contradiction analysis across all five P3 algorithmic rules.

5. **Layer 5: Reports & Decision-Support Audit History (তদন্ত রিপোর্ট ও অডিট ট্রেইল)**
   - Printable official dossier with explicit area units (শতক/decimals) and survey provenance.
   - Timestamped officer action trail stored in the prototype decision-support buffer.

---

### User Experience & Localization
- **Default Language**: বাংলা (Bangla) by default across all pages, forms, validation messages, and reports.
- **Instant Language Toggle**: Small `বাংলা | English` toggle in header with instant transition and persistent preference via `localStorage`.
- **Light Theme**: Clean, authoritative, government-service-inspired white/slate-50 aesthetic with restrained emerald/teal accents.
- **Responsive Layout**: Fluid design tailored for mobile phones, tablets, and desktop workstations.

---

### Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS v4
- **Language**: TypeScript 5
- **ORM**: Prisma 6
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: HMAC-SHA256 Signed Sessions & `bcryptjs`
- **Deployment**: Vercel (Automatic GitHub CI/CD)
- **Testing**: Node.js / TSX Native Test Suite (24 automated tests passing)
- **Icons**: Lucide React

---

### Synthetic Data
> **Notice**: All demonstration records across the 7 test parcels are **100% synthetic/dummy data**. No real citizen names, real NID numbers, or confidential government documents are stored or scraped.

---

### Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Configure local environment variables
cp .env.example .env.local
# Edit .env.local with your database connection string and optional initial admin credentials

# 3. Generate Prisma client
npx prisma generate

# 4. Synchronize database schema (when database is connected)
npx prisma db push

# 5. Seed synthetic demonstration data and demo accounts
npm run seed

# 6. Start local development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

### Automated Testing

Run the full automated test suite covering all 5 detection rules, authorization checks, and localization formatters:

```bash
npm test
```
*Current test status: 24 passing, 0 failing.*

---

### Production Build & Linting

```bash
npm run lint
npm run build
```

---

### Deployment

The project is connected to Vercel via GitHub:
- **Repository**: [https://github.com/RafiulKabir0/landtrace](https://github.com/RafiulKabir0/landtrace)
- **Production URL**: [https://landtrace.vercel.app](https://landtrace.vercel.app)

Every push to the `main` branch triggers an automated build and deployment on Vercel.

---

### AI Tools Disclosure
This project was developed with the assistance of **Google Antigravity (Gemini)** for pair programming, test case design, bilingual interface localization, and architecture documentation review. All code, schemas, and detection logic were independently verified and tested.

---

### Decision-Support Prototype Limitations
- **Synthetic Data**: Operates on deterministic synthetic test datasets for Round 1 demonstration.
- **Prototype State**: Investigation actions (Mark for review, field inquiries, notes) are stored inside the prototype decision-support buffer; they are not transmitted to external government servers.
- **Decision-Support Only**: LandTrace assists Assistant Commissioners (Land) and Sub-Registrars with forensic contradiction analysis; it **does not legally determine ownership** or issue judicial decrees.

---

### Team & Mentor Details
- **Project**: LandTrace
- **Problem Category**: P3 — Fraud & Double-Selling Detection
- **Hackathon**: LandTech 2026
- **Team**: Team LandTrace
- **Lead Developer**: Rafiul Kabir ([@RafiulKabir0](https://github.com/RafiulKabir0))
- **Mentor**: [Items requiring participant input: Official mentor assignment if designated by LandTech 2026 organizers]
- **Live Production URL**: [https://landtrace.vercel.app](https://landtrace.vercel.app)
- **Repository**: [https://github.com/RafiulKabir0/landtrace](https://github.com/RafiulKabir0/landtrace)
