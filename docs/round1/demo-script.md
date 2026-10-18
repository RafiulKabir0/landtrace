# LandTrace: Round 1 Video Demonstration Script
## LandTech 2026 | Problem Statement P3: Fraud & Double-Selling Detection
### Team: Team LandTrace | Team ID: LA-73
#### Target Duration: 2 Minutes 30 Seconds (Strict Limit: Under 3 Minutes)

---

### Segment 1: Introduction & Multi-Page Government Architecture (0:00 – 0:35)
- **Visual**: Show LandTrace live at `https://landtrace.vercel.app` with the clean, authoritative government-service aesthetic (white/slate-50 background, emerald/teal accents), government header with Team ID badge (`LA-73`), and Neon PostgreSQL indicator.
- **Action**:
  - Show that the entire website defaults to **বাংলা (Bangla)**. Click the compact `বাংলা | English` toggle in the navigation bar to demonstrate zero-lag language switching, then switch back to Bangla.
  - Scroll down the public homepage (`/`) to highlight the two prominent actions: **"জমির রেকর্ড যাচাই করুন"** and **"সেবাসমূহ দেখুন"**, followed by the 5 P3 detection capabilities, the 4-step workflow, and the 3 distinct role entry portals.
- **Narrator**:
  > *"Welcome to LandTrace — presented by Team LA-73 for LandTech 2026, Problem Statement P3: Fraud & Double-Selling Detection. In Bangladesh, land disputes generate protracted litigation because Sub-Registry deed archives and AC-Land mutation khatians operate in departmental silos. LandTrace addresses this through a dedicated, multi-page government service architecture inspired by land.gov.bd. The application defaults to natural Bangla with an instant English toggle. All records shown are 100% synthetic demonstration data."*

---

### Segment 2: Services Directory & Record Verification (0:35 – 1:00)
- **Visual**: Click **"সেবাসমূহ দেখুন"** to open `/services`, then click **"জমির রেকর্ড যাচাই করুন"** to open `/verify`.
- **Action**:
  - In `/verify`, demonstrate the unified cadastral search bar. Click the quick demo chip for **`PLOT-DH-2045`** (Gulshan, Dhaka) or type it in.
  - Click on the record card to open the selected record view (`/verify/PLOT-DH-2045`), showing the complete cadastral particulars (Dag 1105, SA Survey, 15.0 decimals, Contested Owner, Co-owner shares).
  - Note the clear distinction between historical survey records (CS, SA, RS, BS) and ownership transfer deeds.
- **Narrator**:
  > *"From our complete Services Directory at /services, officers or citizens navigate to the dedicated verification workspace at /verify. Searching by Dag, Khatian, or Mouza instantly retrieves verified synthetic parcels. Inspecting parcel PLOT-DH-2045 clearly separates physical survey records—CS, SA, RS, BS—from registered deeds of transfer, preventing the common mistake of treating possession surveys as continuous legal title."*

---

### Segment 3: Dedicated Forensic Investigation & 5 Detection Rules (1:00 – 1:40)
- **Visual**: Click **"পূর্ণাঙ্গ তদন্ত ডসিয়ার দেখুন"** to navigate to `/investigations/PLOT-DH-2045`.
- **Action**:
  - Point to the **Decision-Support Risk Score: 85/100 (Critical Risk)**.
  - Show the **Double Selling** anomaly explanation: what contradiction was detected, synthetic deeds involved, why triggered, and the **Recommended Human Review Action** (*উপজেলা সাব-রেজিস্ট্রারের তল্লাশ বালাম ও সরেজমিন দখল অনুসন্ধানের নির্দেশ দিন*).
  - Scroll down to the interactive **Chain of Title Timeline**: contrast verified deed nodes with the red compromised node where grantor Abdur Rashid alienated title in 2018, and then executed a second sale in 2021 without title.
  - Point to the **Area Comparison** section and the JSON forensic evidence inspector.
- **Narrator**:
  > *"The dedicated investigation view at /investigations analyzes the parcel across all five P3 detection rules: Double Selling, Ownership Chain Breaks, Area Mismatches, Deed-Mutation Mismatches, and Suspicious Transfer Timing. Here, our engine flags a critical Double Selling contradiction: grantor Abdur Rashid alienated 15.0 decimals in 2018, and executed an unauthorized secondary sale in 2021. Notice the actionable recommendation guiding the officer to inspect registry volumes and physical possession, backed by our interactive title timeline and raw forensic parameters."*

---

### Segment 4: Officer Decision Actions & Official Printable Dossier (1:40 – 2:05)
- **Visual**: Scroll to the Authorized Officer Actions panel on `/investigations/PLOT-DH-2045`.
- **Action**:
  - Click **"মাঠ তদন্তে প্রেরণ"** (Send for Field Inquiry). Point out the feedback banner confirming the action was stored in the prototype decision buffer.
  - Click **"তদন্ত নোট যোগ করুন"** (Add Note) and save a note: *"সরেজমিন দখলদারিত্ব অনুসন্ধানের জন্য কানুনগোকে নির্দেশ প্রদান করা হলো"*.
  - Click **"অফিসিয়াল রিপোর্ট দেখুন"** to open `/reports/PLOT-DH-2045`, displaying the complete printable forensic dossier with official seals, QR verification placeholder, and signature blocks. Press `Ctrl + P` to show the print preview.
- **Narrator**:
  > *"Every officer action is fully functional. Land officers can mark parcels for review, assign field inquiries to Kanungos, and record persistent notes. Transparent disclaimers confirm actions are preserved within the prototype decision buffer rather than claimed as live government transmissions. Officers can then navigate to /reports to review or print an official, forensic investigation dossier with complete evidentiary citations."*

---

### Segment 5: Multi-Role Portals & Pre-Registration Risk Check (2:05 – 2:35)
- **Visual**: Show the three dedicated login entry points: `/login/citizen`, `/login/official`, and `/login/admin`.
- **Action**:
  - Log in via `/login/citizen` using the 1-click test button. Show the dedicated **নাগরিক ড্যাশবোর্ড** (`/citizen/dashboard`), restricted strictly to designated plot `PLOT-DH-1001` and the **রেজিস্ট্রেশন পূর্ববর্তী ঝুঁকি যাচাই** (Pre-Registration Transfer Risk Simulator).
  - Test the simulator with parcel `PLOT-SYL-5501` and seller `Enamul Haque` to trigger a simulated Ownership Chain Break warning.
  - Log in via `/login/admin` to display the **প্রশাসক ড্যাশবোর্ড** (`/admin/dashboard`) with live account management, role assignment selectors, and system telemetry.
- **Narrator**:
  > *"LandTrace strictly enforces multi-role security across dedicated routes: /login/citizen, /login/official, and /login/admin. Citizens access /citizen/dashboard to verify permitted holdings and test proposed deeds in our Pre-Registration Risk Simulator before paying stamp duty. Administrators access /admin/dashboard to manage accounts and enforce role permissions. By unifying cadastral surveys with digital title graphs in an accessible, layer-by-layer architecture, LandTrace provides transparent, fraud-resilient land governance for Bangladesh. Thank you."*
