# AI Tools Disclosure Statement
## LandTech 2026 — Team LandTrace

---

### 1. Transparent Disclosure of AI Tools Used
During the research, development, and documentation of **LandTrace**, the following AI tool was utilized:

- **AI Platform**: **Google Antigravity (powered by Gemini models)**
- **Role**: AI Pair Programming and Engineering Assistant

---

### 2. Nature and Scope of AI Assistance

| Category | AI Assistance Provided | Human Validation & Engineering Oversight |
| :--- | :--- | :--- |
| **Code Implementation** | Assisting with boilerplate syntax for Next.js 16 App Router, TypeScript types, and Tailwind CSS utility classes. | All architectural choices, schema normalization, and React component structures were actively directed, reviewed, and tested. |
| **Algorithmic Logic** | Refining edge-case handling for the five P3 contradiction rules (double-selling chronological checks, graph traversal). | All detection algorithms were mathematically specified and validated using comprehensive automated unit test suites (`tests/engine.test.ts`). |
| **Synthetic Dataset Creation** | Formatting synthetic demonstration data payloads in JSON and seed scripts. | All data points were strictly verified to be 100% synthetic dummy data with zero real citizen information. |
| **Bilingual Localization** | Suggesting administrative Bangla phrasing for land terms (*খতিয়ান, নামজারি, মৌজা, দ্বৈত বিক্রয়*). | Terminology was cross-verified against official Bangladesh Ministry of Land practices. |
| **Documentation Review** | Structuring markdown drafts and checking compliance against the 4-page concept note limits. | All written claims, architectural diagrams, and project limits were authored and verified by the development team. |

---

### 3. Ethical and Academic Integrity Confirmation
- **Original Architecture**: The core idea of modeling land holdings as a directed custody graph to detect contradictions in dual-registry systems is original to this project.
- **Decision-Support Boundary**: AI was explicitly prompted to avoid hallucinated legal authority; LandTrace is positioned strictly as a decision-support system.
- **Zero Confidential Data**: No proprietary, private, or real citizen data was processed through any AI tool.
