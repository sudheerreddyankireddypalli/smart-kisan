import { ProcessStep } from '../types';

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery & Problem Alignment",
    duration: "Day 1",
    description: "I clarify your core business problem, identify key stakeholders, discuss existing hypotheses, and determine the exact decisions this analysis needs to guide.",
    deliverable: "Initial Discovery Notes & Identified Business Questions"
  },
  {
    step: 2,
    title: "Scope & Agreement",
    duration: "Day 1–2",
    description: "We confirm the exact project scope, data availability, required deliverables, timeline milestones, pricing, and confidentiality commitments in writing.",
    deliverable: "Scope Agreement & Acceptance Criteria Document"
  },
  {
    step: 3,
    title: "Data Audit & Quality Inspection",
    duration: "Day 2–3",
    description: "I inspect the raw dataset for missing fields, inconsistent data types, duplicates, and outliers. I document any anomalies before modifying the data.",
    deliverable: "Data Quality Audit Report & Cleaning Roadmap"
  },
  {
    step: 4,
    title: "Analysis & Statistical Investigation",
    duration: "Day 3–5",
    description: "Using Python (Pandas/NumPy) and SQL, I perform exploratory data analysis, compute descriptive statistics, calculate key ratios, and test analytical questions.",
    deliverable: "Exploratory Code Scripts & Statistical Summaries"
  },
  {
    step: 5,
    title: "Visualization & Insights Synthesis",
    duration: "Day 5–7",
    description: "I build clear visual charts in Power BI / Matplotlib and translate analytical findings into plain-English business takeaways and practical recommendations.",
    deliverable: "Draft Visual Charts, KPI Cards & Findings Summary"
  },
  {
    step: 6,
    title: "Quality Assurance & Math Validation",
    duration: "Day 7–8",
    description: "Every metric, total, formula, and chart is cross-checked against raw numbers to eliminate calculation errors, false correlations, and biased assumptions.",
    deliverable: "QA Reconciliation Checklist & Calculation Proof"
  },
  {
    step: 7,
    title: "Delivery & Documentation",
    duration: "Day 8–9",
    description: "All project artifacts (cleaned data files, Jupyter notebooks, Power BI files, executive summary PDF) are packaged neatly with readable documentation.",
    deliverable: "Final Deliverable Package & Executive Report"
  },
  {
    step: 8,
    title: "Client Handover & Walkthrough",
    duration: "Day 9–10",
    description: "We conduct a walkthrough session where I explain the findings, demonstrate how to navigate the dashboard/spreadsheets, and answer your team's questions.",
    deliverable: "Recorded Walkthrough Session & Handover Q&A"
  }
];

export const processGuarantees = [
  {
    title: "Data Confidentiality",
    text: "Your business numbers and customer records are never shared, published, or stored beyond the project scope. Non-Disclosure Agreements (NDAs) respected."
  },
  {
    title: "Transparent Assumptions",
    text: "Every calculation, filter rule, and statistical test is clearly documented so your internal team can independently verify and replicate the numbers."
  },
  {
    title: "Realistic Milestones",
    text: "No misleading overnight promises. Timelines are agreed upon upfront and adhered to with proactive status updates at each milestone."
  },
  {
    title: "Clean Communication",
    text: "Complex statistics translated into actionable commercial language so non-technical decision-makers can take immediate action."
  }
];
