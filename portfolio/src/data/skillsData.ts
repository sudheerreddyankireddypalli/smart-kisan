import { SkillCategory } from '../types';

export const skillsData: SkillCategory[] = [
  {
    category: "Programming & Querying",
    description: "Core languages used to extract, query, manipulate, and model tabular business data.",
    skills: [
      {
        name: "Python",
        levelDescription: "Core data analysis stack (Pandas, NumPy, Matplotlib, Seaborn). Scripting automated cleaning pipelines, statistical profiling, and feature calculations.",
        tags: ["Scripting", "Data Structures", "Automation", "ETL"],
        useCase: "Building end-to-end EDA scripts, handling missing value imputations, and outlier detection routines."
      },
      {
        name: "SQL",
        levelDescription: "Writing structured queries, multi-table JOINs, GROUP BY aggregations, CTEs (Common Table Expressions), and window functions (RANK, ROW_NUMBER, LAG/LEAD).",
        tags: ["Joins", "CTEs", "Aggregations", "Window Functions"],
        useCase: "Querying relational databases to segment customer transaction logs and calculate rolling revenue metrics."
      }
    ]
  },
  {
    category: "Data Manipulation & Math",
    description: "Libraries and mathematical foundations for structuring, transforming, and validating datasets.",
    skills: [
      {
        name: "Pandas",
        levelDescription: "DataFrame manipulation, datetime indexing, groupby operations, pivot tables, string manipulations, and merge/concat operations on messy datasets.",
        tags: ["DataFrames", "Indexing", "Filtering", "Transformations"],
        useCase: "Restructuring raw POS retail sales files with inconsistent date formats and multi-currency inputs."
      },
      {
        name: "NumPy",
        levelDescription: "Vectorized array calculations, numerical transformations, matrix operations, conditional masking, and statistical dispersion calculations.",
        tags: ["Arrays", "Vectorization", "Mathematical Modeling"],
        useCase: "Fast standard deviation calculations, log-transforming skewed revenue values, and boolean indexing."
      }
    ]
  },
  {
    category: "Business Intelligence & Visualization",
    description: "Translating analytical queries into executive-ready dashboards, interactive reports, and intuitive visual stories.",
    skills: [
      {
        name: "Power BI",
        levelDescription: "Interactive dashboard creation, star-schema data modeling, DAX measures (CALCULATE, RELATED, time intelligence), slicers, and KPI cards.",
        tags: ["Data Modeling", "DAX", "KPI Cards", "Interactive Slicers"],
        useCase: "Building executive overview dashboards monitoring sales by region, category, and monthly margin trends."
      },
      {
        name: "Microsoft Excel",
        levelDescription: "Advanced formulas (XLOOKUP, INDEX/MATCH, SUMIFS, COUNTIFS), dynamic Pivot Tables, conditional formatting, what-if analysis, and clean KPI summaries.",
        tags: ["Pivot Tables", "XLOOKUP", "Conditional Formatting", "Formulas"],
        useCase: "Designing lightweight, repeatable financial summary spreadsheets for small business operators."
      },
      {
        name: "Matplotlib & Seaborn",
        levelDescription: "Exploratory charts, distributions (histograms, KDEs), correlation heatmaps, box plots for outlier detection, and categorical bar charts.",
        tags: ["Heatmaps", "Distributions", "Correlation", "Boxplots"],
        useCase: "Plotting customer basket size distributions and cross-correlating pricing vs conversion rates."
      }
    ]
  },
  {
    category: "Analytics & Applied Methodology",
    description: "Analytical rigor applied to answer specific business questions and uncover opportunities.",
    skills: [
      {
        name: "Exploratory Data Analysis (EDA)",
        levelDescription: "Univariate, bivariate, and multivariate analysis to identify distributions, skewness, missingness patterns, and anomalous data points.",
        tags: ["Univariate", "Bivariate", "Multivariate", "Skewness"],
        useCase: "Uncovering why e-commerce cart abandonment spikes between step 2 and step 3 of the checkout funnel."
      },
      {
        name: "Data Cleaning & Wrangling",
        levelDescription: "Systematic deduplication, missing data imputation strategies, type casting, text normalization, and sanity validation against business rules.",
        tags: ["Deduplication", "Imputation", "Normalization", "Validation"],
        useCase: "Eliminating duplicate customer records and standardizing inconsistent district codes across state datasets."
      },
      {
        name: "Feature Engineering",
        levelDescription: "Creating meaningful derived variables from raw inputs (e.g., customer tenure, average order frequency, profit margins, day-of-week markers).",
        tags: ["Derived Metrics", "Date Parts", "Ratios", "Encodings"],
        useCase: "Computing customer recency and basket diversity indicators to segment repeat vs single-purchase buyers."
      },
      {
        name: "Statistical Analysis & Hypothesis Testing",
        levelDescription: "Descriptive statistics (mean, median, IQR, variance), confidence intervals, and hypothesis evaluation (t-tests, chi-square) to avoid false conclusions.",
        tags: ["Descriptive Stats", "Hypothesis Testing", "Variance", "Significance"],
        useCase: "Testing whether weekend promotional discounts produced statistically significant changes in transaction count."
      }
    ]
  },
  {
    category: "Tools & Development Environment",
    description: "Everyday development tools ensuring version control, code reproducibility, and structured workflows.",
    skills: [
      {
        name: "MySQL",
        levelDescription: "Relational database schema navigation, index awareness, primary/foreign keys, and data export routines.",
        tags: ["RDBMS", "Schema Design", "Data Export"],
        useCase: "Hosting local database instances for business transaction analysis and schema validation."
      },
      {
        name: "Git & GitHub",
        levelDescription: "Version control, branching, clean commit documentation, open repository maintenance, and reproducible analytical codebases.",
        tags: ["Version Control", "Open Source", "Documentation"],
        useCase: "Publishing transparent project codebases with step-by-step Jupyter notebooks and documentation."
      },
      {
        name: "Jupyter Notebook",
        levelDescription: "Interactive literate programming combining markdown explanations, exploratory code cells, chart outputs, and business commentary.",
        tags: ["Interactive Computing", "Documentation", "Reproducibility"],
        useCase: "Documenting analytical findings step-by-step for peer review and client demonstration."
      },
      {
        name: "VS Code",
        levelDescription: "Primary IDE configured with Python linting, SQL formatters, Git extensions, and environment management.",
        tags: ["IDE", "Productivity", "Debugging"],
        useCase: "Writing modular Python scripts and building responsive web-based dashboards."
      }
    ]
  }
];
