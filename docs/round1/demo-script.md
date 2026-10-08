# LandTrace: Round 1 Video Demonstration Script
## Target Duration: 2 Minutes 30 Seconds (Max: 3 Minutes)

---

### Segment 1: Introduction & Login (0:00 – 0:25)
- **Visual**: Show the LandTrace landing dashboard with the official government header banner, AC-Land badge, and Neon PostgreSQL live connection chip.
- **Narrator**:
  > *"Welcome to LandTrace — an automated Ownership Chain Contradiction and Fraud Detection System built for LandTech 2026 Problem Statement P3. Land disputes account for over 70% of civil litigation in Bangladesh, largely due to double-selling, phantom grantors, and deed-mutation discrepancies. Today, we demonstrate how LandTrace provides Assistant Commissioners (Land) and Sub-Registrars with an automated decision-support engine. Notice that our interface defaults to Bangla, aligning with administrative field terms, with an instant English toggle. All data displayed is 100% synthetic demonstration data."*

---

### Segment 2: Dashboard Overview & Plot Search (0:25 – 0:50)
- **Visual**: Show summary statistics (7 Audited Land Parcels, Clean Custody Chains, Active Anomalies, Contested Decimals). Type in the search box: `PLOT-DH-2045` (Gulshan, Dhaka).
- **Narrator**:
  > *"On the officer dashboard, we see real-time metrics pulled directly from our Neon serverless PostgreSQL database. Let's inspect parcel PLOT-DH-2045 in Gulshan. As we filter, the registry dynamically highlights the plot with a compromised title status."*

---

### Segment 3: Ownership Chain & Risk Analysis (0:50 – 1:20)
- **Visual**: Click on `PLOT-DH-2045`. Show the title dossier opening on the right side with a Risk Score of **85/100 (Critical Risk)**.
- **Narrator**:
  > *"When we select this parcel, the LandTrace engine evaluates the topological custody graph. Notice the risk score: 85 out of 100. The engine flags a critical contradiction: Double Selling. Grantor Abdur Rashid transferred 15.0 decimals to Tariqul Alam in May 2018. However, in November 2021, the same grantor executed a second sale deed to Farhana Yasmin without possessing legitimate title."*

---

### Segment 4: Forensic Evidence & Deed Chronology Timeline (1:20 – 1:45)
- **Visual**: Scroll down through the Deed Timeline, pointing out the red flashing node on deed DEED-2021-3948, and inspect the JSON evidence payload.
- **Narrator**:
  > *"In the Deed Timeline, LandTrace contrasts the verified node with the compromised node. The Forensic Evidence box highlights both deed serials, dates, and the unverified alienation. The officer can instantly review the evidence and click 'Send for Field Inquiry' or 'Mark for Review', recording the action into an immutable audit trail."*

---

### Segment 5: Pre-Registration Transfer Risk Check (1:45 – 2:10)
- **Visual**: Click on the 'Pre-Registration Risk Check' tab. Select `PLOT-SYL-5501` (Sylhet Sadar). Enter seller `Enamul Haque` and proposed area `12.0 decimals`. Click 'Run Transfer Risk Audit'. Show the red warning modal flagging **Ownership Chain Break**.
- **Narrator**:
  > *"Beyond auditing historical records, LandTrace empowers Sub-Registrars before deed execution. In our Pre-Registration Risk Check, an officer enters a proposed transfer. Here, the engine flags an Ownership Chain Break: grantor Enamul Haque does not exist as a legitimate prior grantee in the title history. Registration can be paused before fraud occurs."*

---

### Segment 6: Clean Case Comparison & Closing (2:10 – 2:30)
- **Visual**: Switch back to the dashboard. Select `PLOT-DH-1001` (Tejgaon, Dhaka). Show Risk Score **0/100 (Clean)**, green verified nodes from 2005 grant down to 2016 namjari mutation.
- **Narrator**:
  > *"Conversely, on legitimate parcel PLOT-DH-1001, LandTrace confirms a 100% verified custody chain with perfect area alignment and namjari clearance. By bridging Sub-Registry deeds with AC-Land mutations, LandTrace creates a transparent, tamper-evident foundation for digital land administration in Bangladesh. Thank you."*
