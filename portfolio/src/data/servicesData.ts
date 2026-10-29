import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: "data-cleaning",
    number: "01",
    title: "Data Cleaning & Preparation",
    shortDescription: "Turn messy, inconsistent spreadsheets and raw exports into structured, audit-ready data tables.",
    businessValue: "Garbage in equals garbage out. Clean data prevents costly operational mistakes, eliminates reporting discrepancies, and ensures decisions are based on accurate figures.",
    deliverables: [
      "De-duplicated, normalized dataset in clean CSV or Excel format",
      "Resolution of missing values with clear imputation documentation",
      "Standardized dates, currencies, phone numbers, and categorical text",
      "Data Quality Audit Report highlighting anomalies and edge cases fixed"
    ],
    icon: "Sparkles",
    suggestedPackage: "Starter Analytics",
    basePrice: "₹1,500 – ₹3,000"
  },
  {
    id: "excel-reporting",
    number: "02",
    title: "Excel Reporting & KPI Summaries",
    shortDescription: "Dynamic, repeatable Excel reporting templates built with advanced formulas and interactive Pivot Tables.",
    businessValue: "Empowers small business owners to monitor weekly and monthly sales without paying expensive monthly software subscriptions.",
    deliverables: [
      "Automated Excel workbook with dynamic XLOOKUP & SUMIFS logic",
      "Interactive Pivot Tables and Slicers for quick drill-down analysis",
      "One-page Executive KPI Summary sheet with clear conditional formatting",
      "Video or text instructions on how to paste new monthly data into the template"
    ],
    icon: "Table",
    suggestedPackage: "Starter Analytics",
    basePrice: "₹2,000 – ₹4,000"
  },
  {
    id: "sql-analysis",
    number: "03",
    title: "SQL Analysis & Business Queries",
    shortDescription: "Custom SQL scripts and queries to extract insights from your transaction tables, databases, and customer records.",
    businessValue: "Answers complex business questions that basic spreadsheets cannot handle, such as customer cohort retention, repeat purchase cycles, and regional margin trends.",
    deliverables: [
      "Well-commented SQL queries (MySQL / PostgreSQL / standard SQL)",
      "Multi-table JOINs, aggregations, CTEs, and window functions",
      "Exported summary datasets answering agreed business questions",
      "Query documentation explaining assumptions and column logic"
    ],
    icon: "Database",
    suggestedPackage: "Business Insights",
    basePrice: "₹3,500 – ₹6,000"
  },
  {
    id: "python-analytics",
    number: "04",
    title: "Python Analytics & EDA",
    shortDescription: "In-depth Exploratory Data Analysis using Python (Pandas, NumPy, Matplotlib, Seaborn) to uncover hidden patterns.",
    businessValue: "Validates business hunches with empirical statistical evidence. Pinpoints high-value customer clusters, seasonality dips, and operational bottlenecks.",
    deliverables: [
      "Comprehensive Jupyter Notebook with clean code and explanations",
      "Statistical summaries (distributions, correlations, IQR anomaly detection)",
      "Publication-grade charts (heatmaps, boxplots, trendlines)",
      "Written summary explaining what the data proves and disproves"
    ],
    icon: "Code",
    suggestedPackage: "Business Insights",
    basePrice: "₹4,000 – ₹8,000"
  },
  {
    id: "power-bi-dashboards",
    number: "05",
    title: "Power BI Dashboards & Monitoring",
    shortDescription: "Visual, interactive Power BI dashboards with drill-down filters, clean star-schema modeling, and real-time feel.",
    businessValue: "Replaces 20-page confusing reports with a single visual control tower that executives can review in 30 seconds to make quick, confident decisions.",
    deliverables: [
      "Structured Power BI (.pbix) file with clean star-schema data model",
      "Custom DAX measures (Total Revenue, YoY Growth, Margin %, Rolling Averages)",
      "Interactive slicers for dates, products, sales reps, and geographic regions",
      "Walkthrough session and documentation for team self-service"
    ],
    icon: "LayoutDashboard",
    suggestedPackage: "Dashboard Solution",
    basePrice: "₹6,000 – ₹15,000"
  },
  {
    id: "business-insights",
    number: "06",
    title: "Business Insights & Executive Summaries",
    shortDescription: "Translating numbers into plain-English findings, risk warnings, and actionable commercial recommendations.",
    businessValue: "Data without action is overhead. This service gives leadership an unvarnished, objective appraisal of what's working, what's failing, and where to focus next.",
    deliverables: [
      "Executive Summary PDF or Slide Deck (5–10 slides)",
      "Key findings categorized by Revenue Drivers, Leakages, and Opportunities",
      "Prioritized matrix of recommendations with expected business impact",
      "30-minute question-and-answer handover call to discuss findings"
    ],
    icon: "TrendingUp",
    suggestedPackage: "Business Insights",
    basePrice: "₹4,000 – ₹8,000"
  }
];
