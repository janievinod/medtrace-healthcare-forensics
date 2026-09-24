# MEDTRACE — Healthcare Digital Forensics & SIEM Platform

MEDTRACE is an AI-driven digital forensics and real-time security monitoring platform engineered to detect insider threats, prevent unauthorized EHR data exfiltration, and ensure immutable audit integrity across healthcare systems.

Developed for high-stakes clinical environments, MEDTRACE combines **Isolation Forest machine learning**, **SHA-256 block hash verification**, **Neo4j-style entity graph analysis**, and **Gemini 3 Flash AI** to provide automated incident analysis and HIPAA-compliant forensic reporting.

---

## 🌟 Key Features

* **SHA-256 Record Audit State:** Continuous cryptographic verification of patient records (dosage, diagnostic, and prescription logs) to detect retroactively tampered data.
* **Isolation Forest Anomaly Engine:** Unsupervised ML behavior modeling that flags off-hours bulk exports and privilege misuse without reliance on static rules.
* **Gemini AI Incident Reports:** Automated generation of technical incident breakdowns, root cause analysis, HIPAA compliance impact assessments, and mitigation steps.
* **Neo4j Entity Relationship Graph:** Visual correlation mapping across Doctors, Devices, IP Nodes, and Sensitive Patient Files.
* **Dual Operational Modes:**
  * **Security Administrator SIEM:** Real-time alert triage, timeline reconstruction, and forensic analysis.
  * **Hospital Clinical Staff Simulator:** Live action testing for bulk exports, SHA tampering, and restricted VIP file access.

---

## 🏗️ Architecture & Tech Stack

* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React
* **Data Visualization:** Recharts (Area Charts, Pie Charts, Radar)
* **AI Engine:** Google Gemini API (`gemini-3-flash-preview`)
* **Build Tooling:** Vite

---

## 🚀 Getting Started

### Prerequisites

* **Node.js:** `v18.0.0` or higher
* **npm:** `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/medtrace-forensics.git](https://github.com/your-username/medtrace-forensics.git)
   cd medtrace-forensics
