import { PricingPackage } from '../types';

export const pricingPackages: PricingPackage[] = [
  {
    id: "starter-analytics",
    name: "Starter Analytics",
    priceRange: "₹1,500 – ₹3,000",
    duration: "Estimated 2–4 Business Days",
    tagline: "Ideal for small datasets needing cleaning, validation, and a quick summary report.",
    bestFor: "Small business owners, students, or solo entrepreneurs with an exported CSV/Excel sheet.",
    features: [
      "1 small dataset (up to ~25,000 rows)",
      "Systematic data cleaning & deduplication",
      "Missing value resolution & validation",
      "Exploratory summary (distributions & trends)",
      "Set of 4–6 clear visual charts",
      "Cleaned CSV/Excel export + 2-page PDF summary",
      "1 round of clarification feedback"
    ],
    highlighted: false
  },
  {
    id: "business-insights",
    name: "Business Insights",
    priceRange: "₹4,000 – ₹8,000",
    duration: "Estimated 4–7 Business Days",
    tagline: "Comprehensive analytical investigation to answer core business questions and uncover growth opportunities.",
    bestFor: "Growing businesses seeking to understand customer behavior, product sales drivers, and margin leaks.",
    features: [
      "Medium dataset or multi-table relational data",
      "Deep Exploratory Data Analysis (EDA) in Python / SQL",
      "Statistical profiling & anomaly detection",
      "Correlation analysis & cohort breakdown",
      "Rich visualization deck (8–12 charts)",
      "Evidence-based business recommendations",
      "Executive summary slide deck / report (PDF)",
      "45-minute walkthrough & discussion call"
    ],
    highlighted: true
  },
  {
    id: "dashboard-solution",
    name: "Dashboard Solution",
    priceRange: "₹6,000 – ₹15,000",
    duration: "Estimated 7–12 Business Days",
    tagline: "Turn messy raw data into a live, interactive Power BI control center for continuous decision making.",
    bestFor: "Operations managers & business leaders requiring continuous KPI tracking with interactive slicers.",
    features: [
      "KPI architecture planning & measure definition",
      "Data extraction, cleaning, and star-schema modeling",
      "Custom DAX calculations (YoY growth, margins, ratios)",
      "Interactive Power BI dashboard with multi-level filters",
      "Mobile / tablet optimized report layouts",
      "Complete handover (.pbix file + documentation)",
      "Team walkthrough & video recording guide",
      "14 days post-handover support for bug fixes"
    ],
    highlighted: false
  }
];

export const pricingDisclaimer = {
  heading: "Transparent, Honest Pricing Guidelines",
  points: [
    "Indicative Starting Rates: Prices displayed above are proposed starting estimates for standard project scopes, not fixed or guaranteed market rates.",
    "Scope-Driven Quotes: Final pricing is confirmed in writing after reviewing your dataset format, data quality, specific questions to answer, and required deliverables.",
    "Realistic Timelines: Quality analytical work requires thoughtful verification. I do not promise unrealistic overnight turnaround times or sacrifice data accuracy.",
    "Confidentiality Guaranteed: All business data shared is held under strict professional confidentiality and will never be shared or used elsewhere without explicit written consent."
  ]
};
