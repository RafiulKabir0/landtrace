# Round 1 Submission Verification Checklist
## Project: LandTrace | Problem Statement P3 — Fraud & Double-Selling Detection
### Team ID: LA-73

---

### Team & Mentor Verification Checklist
- [x] **Team ID**: `LA-73` verified against official competition registration.
- [x] **Team Leader**: Rafiul Kabir — Department of Software Engineering; Student ID: `253-35-162`.
- [x] **Team Member**: Mst Maimuna Mim — Department of Software Engineering; Student ID: `253-35-103`.
- [x] **Faculty Mentor**: Ms. Subarna Akter Liza — Lecturer, Department of Computer Science & Engineering (CSE), `subarna.cse@diu.edu.bd` (Assigned by Organizing Committee).
- [x] **Industry Support Mentor**: MD. Tahamid Hassan Sadib — CSE-TECH, `251-15-084@diu.edu.bd` (Assigned by Organizing Committee).
- [x] **Privacy & Public Safety**: Personal phone numbers omitted from public downloadable documents; institutional emails preserved.

---

### Core Verification Checklist

- [x] **ONE GitHub Repository**: `https://github.com/RafiulKabir0/landtrace`
- [x] **ONE Main Branch**: Default and production branch is `main`.
- [x] **Clean Repository**: Unnecessary agent/temporary files removed.
- [x] **No Secrets Committed**: `.env*` excluded by `.gitignore`, `.env.example` provided.
- [x] **Professional README**: Fully updated with P3 problem, solution, 5 capabilities, 3 roles, and setup steps.
- [x] **P3 Clearly Stated**: Fraud & Double-Selling Detection prominently defined.
- [x] **Five Detection Capabilities**:
  1. Double Selling (দ্বৈত বিক্রয়)
  2. Ownership Chain Break (মালিকানা ধারাবাহিকতা বিচ্ছিন্ন)
  3. Area Mismatch (খতিয়ান বনাম দলিল পরিমাপ অসঙ্গতি)
  4. Deed–Mutation Mismatch (দলিল ও নামজারি অমিল)
  5. Wrong Transfer Timing / Rapid Transfer (সময়ানুক্রমিক অসঙ্গতি / দ্রুত হস্তান্তর)
- [x] **Recommended Human-Review Actions**: Explicit guidance for officers for every detected anomaly.
- [x] **Authentication & Role Management**:
  - **Citizen Role**: Accesses permitted records and public verification; cannot access officer or admin tools.
  - **Land Official Role**: Audits records, inspects chains, records notes/inquiries, and prints dossiers.
  - **Admin Role**: System administration and user role management (`/api/admin/users`).
  - **Server-Side Authorization**: HMAC-SHA256 session cookies with bcrypt password hashing.
  - **1-Click Demo Role Switcher**: Instant evaluation of all 3 roles without manual typing.
  - **Strict Registration Policy**: Public registration can only create Citizen accounts; privilege escalation blocked.
  - **Initial Admin Method**: Documented setup with `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD`.
- [x] **Cadastral Data Model**:
  - CS, SA, RS, BS survey record support.
  - Dag number, khatian number, mouza, district, upazila, total area (decimals).
  - Owners and ownership shares (co-owners and percentage).
  - Deeds, sellers, buyers, execution dates, and mutation relationships.
  - Cadastral provenance and historical chain roots.
- [x] **Synthetic Data**: Labeled clearly in English (*Synthetic Demo Data*) and বাংলা (*নমুনা/সিন্থেটিক ডেটা*).
- [x] **Bilingual UI**: বাংলা (default) with small `বাংলা | English` toggle and persistent `localStorage` preference.
- [x] **Government-Style UI**: Clean, official, authoritative white/slate-50 aesthetic.
- [x] **Dedicated Investigation Dossier View**: Separates simple dashboard from deep title analysis.
- [x] **Interactive Ownership Chain Timeline**: Chronological visual node progression mapping root to current titleholder.
- [x] **Forensic Parameters & Evidence**: Expandable technical inspection panel detailing deed serials, dates, and discrepancies.
- [x] **Topological Risk Score**: Calibrated 0–100 heuristic based on contradiction severity.
- [x] **Transfer Risk Check**: Pre-registration audit simulator for Sub-Registrars.
- [x] **Persistent Officer Actions**: Mark for review, field inquiry, notes, forwarding, and dossier printing with prototype buffer notice.
- [x] **Tests Passing**: 26 automated unit tests executed with 100% pass rate (`npm test`).
- [x] **Production Build Clean**: Next.js 16 Turbopack production build succeeds with 0 errors (`npm run build`).
- [x] **Concept Note**: Available in `concept-note.md` and `concept-note.html`.
- [x] **Concept Note <= 4 Pages**: Verified PDF (`LandTrace-Concept-Note.pdf`) is exactly 4 pages.
- [x] **Demo Script <= 3 Minutes**: Available in `demo-script.md` with 2.5 minute target duration.
- [x] **AI Disclosure**: Truthful disclosure in `ai-disclosure.md`.
- [x] **Architecture Documentation**: Detailed component and ER diagram in `architecture.md`.
- [x] **Countrywide Implementation Plan**: Covered in Concept Note Section 10.
- [x] **ONE Vercel Project**: `landtrace` on Vercel.
- [x] **ONE Stable Production URL**: `https://landtrace.vercel.app`.
- [x] **ONE Neon Project/Database**: Serverless PostgreSQL on Neon.
- [x] **GitHub → Vercel Automatic Deployment**: Live on every git push to `main`.
