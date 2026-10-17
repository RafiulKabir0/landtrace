# LandTrace: Round 1 Video Demonstration Script
## Target Duration: 2 Minutes 30 Seconds (Strict Limit: Under 3 Minutes)

---

### Segment 1: Introduction & System Identity (0:00 – 0:30)
- **Visual**: Show LandTrace live at `https://landtrace.vercel.app` with the clean, professional white/slate-50 theme, government header, AC-Land badge, and Neon PostgreSQL chip.
- **Action**: Point out that the interface defaults to **বাংলা (Bangla)** for field officers and citizens. Click the `বাংলা | English` toggle in the header to show instant bilingual switching, then return to Bangla.
- **Narrator**:
  > *"Welcome to LandTrace — an automated Ownership Chain Contradiction and Fraud Detection System built for LandTech 2026, Problem Statement P3. Land title disputes tie citizens in decades of civil litigation in Bangladesh due to departmental silos between Sub-Registry deeds and AC-Land mutation khatians. Today, we demonstrate how LandTrace unifies these records into an auditable title graph. Our application defaults to natural Bangla with an instant English toggle. All data displayed is 100% synthetic demonstration data."*

---

### Segment 2: Simple Dashboard & Record Search (0:30 – 0:55)
- **Visual**: Show the uncluttered main dashboard: search bar, primary action button (*"ভূমি রেকর্ড যাচাই করুন"*), summary metrics (Total, Clean, Flagged).
- **Action**: Type `PLOT-DH-2045` or `Gulshan` in the search box and press Enter or click the verification button.
- **Narrator**:
  > *"The main dashboard provides an uncluttered operational overview. We see verified summary metrics derived dynamically from our database. As an officer searches by Dag number, Khatian number, or Mouza, LandTrace instantly filters the registry and highlights compromised parcels. Let's inspect parcel PLOT-DH-2045 in Gulshan by clicking 'পূর্ণাঙ্গ তদন্ত রিপোর্ট ও ধারাবাহিকতা দেখুন'."*

---

### Segment 3: Dedicated Forensic Investigation Dossier & 5 Detection Rules (0:55 – 1:35)
- **Visual**: The dedicated Investigation View opens with Cadastral Particulars (Dag 1105, SA Survey, 15.0 decimals, Contested Owner, Co-owner shares).
- **Action**:
  - Point to the **Decision-Support Risk Score: 85/100 (Critical Risk)**.
  - Show the **Double Selling** anomaly explanation: what contradiction was detected, synthetic deeds involved, why triggered, and the **Recommended Human Review Action** (*উপজেলা সাব-রেজিস্ট্রারের তল্লাশ বালাম ও সরেজমিন দখল অনুসন্ধানের নির্দেশ দিন*).
  - Scroll down to the interactive **Chain of Title Timeline**: contrast verified deed nodes with the red compromised node where Abdur Rashid alienated title twice without legitimate reacquisition.
  - Point to the **Area Comparison** section showing survey khatian acreage vs. deed acreage.
- **Narrator**:
  > *"In this dedicated investigation view, LandTrace analyzes the parcel across all five P3 detection rules: Double Selling, Ownership Chain Breaks, Area Mismatches, Deed-Mutation Mismatches, and Timing Anomalies. Here, the engine flags a critical Double Selling contradiction: grantor Abdur Rashid alienated 15.0 decimals in 2018, and then executed a second sale in 2021 without title. Notice the explicit recommended action guiding the officer to inspect the registry volume and physical possession. The timeline visually pinpoints the contradictory deed node."*

---

### Segment 4: Officer Decision Actions & Dossier Export (1:35 – 2:00)
- **Visual**: Scroll to the Authorized Officer Actions panel.
- **Action**:
  - Click *"মাঠ তদন্তে প্রেরণ"* (Send for Field Inquiry). Show the immediate feedback banner confirming action was recorded in the prototype decision buffer.
  - Click *"তদন্ত নোট যোগ করুন"* (Add Note) and type: *"সরেজমিন দখলদারিত্ব অনুসন্ধানের জন্য কানুনগোকে নির্দেশ প্রদান করা হলো"*. Save the note and show it appearing in the recent action trail.
  - Click *"তদন্ত সারাংশ মুদ্রণ"* (Print Dossier) to display the official printable dossier modal, ready for AC-Land review.
- **Narrator**:
  > *"Every action button is fully functional. Officers can mark parcels for review, assign field inquiries to Kanungos, and record persistent investigation notes. Notice our transparent disclaimer: all actions are recorded in the prototype decision buffer rather than falsely claimed as transmitted to live government servers. Officers can also export or print the full forensic dossier with one click."*

---

### Segment 5: Pre-Registration Risk Check & 1-Click Role Switcher (2:00 – 2:30)
- **Visual**:
  - Click the **"রেজিস্ট্রেশন পূর্ববর্তী ঝুঁকি যাচাই"** tab. Select `PLOT-SYL-5501` (Sylhet), enter seller `Enamul Haque`, and click *"হস্তান্তর ঝুঁকি নিরীক্ষা করুন"*. Show the red warning flagging an **Ownership Chain Break** (seller does not exist in prior title history).
  - Use the **1-Click Demo Role Switcher** on the top header to switch to **"নাগরিক ডেমো (Citizen)"**. Show that the dashboard immediately adapts to citizen mode: restricting access to only permitted citizen records and disabling administrative officer actions.
  - Click **"সিস্টেম অ্যাডমিন ডেমো (Admin)"** to reveal the **ব্যবহারকারী ও নিরাপত্তা ব্যবস্থাপনা (User Management)** tab.
- **Narrator**:
  > *"Sub-Registrars can also prevent fraudulent conveyances before deed execution using our Pre-Registration Risk Check, detecting chain breaks before registry fees are paid. Finally, LandTrace features robust role-based access control. Evaluators can switch in one click between Citizen, Land Official, and Administrator modes to observe strict server-side authorization boundaries. By uniting cadastral surveys with digital registry chains, LandTrace establishes transparent, fraud-resilient land governance for Bangladesh. Thank you."*
