import { CaseStudyData } from '../types';

export const projectsData: CaseStudyData[] = [
  {
    id: "walmart-sales-analysis",
    title: "Walmart Customer Behavior & Sales Trend Analysis",
    subtitle: "Investigating store sales trends, holiday volatility, and departmental performance across 45 retail stores.",
    category: "Python & EDA",
    tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "SQL", "Exploratory Data Analysis"],
    featured: true,
    statusBadge: "Verified Analysis on Public Dataset",
    businessProblem: "Retail managers need to optimize inventory and staffing across disparate retail outlets without holding excess inventory during low periods or running out of high-velocity goods during major holiday surges. The objective of this study was to analyze historical sales records across 45 stores to uncover seasonal sales spikes, evaluate the impact of macroeconomic factors (CPI, Unemployment, Temperature), and identify underperforming departments.",
    datasetSource: {
      name: "Walmart Store Sales Dataset (Public Kaggle Benchmark)",
      description: "Historical sales data covering 45 Walmart retail stores over 143 weeks, with store metadata, holiday indicators, weekly sales by department, temperature, fuel price, Consumer Price Index (CPI), and unemployment rates.",
      rowCount: "421,570 Weekly Records",
      featuresCount: "16 Features (Store, Dept, Date, Weekly_Sales, IsHoliday, Temperature, Fuel_Price, MarkDown1-5, CPI, Unemployment)",
      verified: true
    },
    analyticalQuestions: [
      "Which stores consistently rank in the top and bottom deciles for average weekly sales volume?",
      "How do designated holiday weeks (Super Bowl, Labor Day, Thanksgiving, Christmas) influence sales volume compared to non-holiday baselines?",
      "Does fuel price or local temperature exhibit a statistically significant correlation with overall store sales?",
      "Which specific departments experience the highest sales volatility across quarters?"
    ],
    toolsUsed: [
      { tool: "Python (Pandas & NumPy)", purpose: "Data ingestion, datetime parsing, handling missing Markdown values, and group aggregations." },
      { tool: "Matplotlib & Seaborn", purpose: "Creating correlation heatmaps, weekly sales time-series plots, and store comparison boxplots." },
      { tool: "SQL (MySQL)", purpose: "Running cohort queries, ranking stores by revenue quartile, and holiday vs non-holiday sales comparisons." }
    ],
    dataCleaningSteps: [
      "Parsed the Date column into datetime64 objects; extracted Year, Month, WeekNumber, and Quarter features for seasonal grouping.",
      "Identified extensive null values in promotional MarkDown columns (MarkDown1 through MarkDown5). Documented that missing markdowns represented no promotional discount; imputed missing entries with 0.00 rather than dropping rows.",
      "Detected and flagged negative sales figures (returns/adjustments) across specific departments for isolated analysis.",
      "Validated store-level data integrity: confirmed all 45 stores had continuous weekly records across the observation period."
    ],
    methodology: [
      "Descriptive statistical summary across all numeric variables (mean, median, standard deviation, IQR).",
      "Time-series trend decomposition to isolate annual seasonality from weekly fluctuations.",
      "Pearson correlation matrix calculation between macroeconomic indicators (CPI, Unemployment, Fuel Price) and Weekly Sales.",
      "Comparative cohort analysis of holiday weeks versus regular weeks using Welch's t-test."
    ],
    findings: [
      {
        metric: "+68.4%",
        label: "Thanksgiving Sales Surge",
        description: "Thanksgiving week exhibited the highest single-week sales volume across all 45 stores, consistently outpacing average weekly sales by over 68%."
      },
      {
        metric: "Store #20 & #4",
        label: "Top Volume Outlets",
        description: "Stores 20, 4, and 14 maintained the highest average weekly revenue (> $2.05M/wk), while Stores 33, 44, and 5 averaged under $300k/wk."
      },
      {
        metric: "r = -0.025",
        label: "Fuel Price Correlation",
        description: "Correlation between fuel price and weekly sales was near zero (-0.025), indicating fuel price fluctuations had negligible direct impact on sales volume during this period."
      },
      {
        metric: "4.2x Volatility",
        label: "Department Variance",
        description: "Electronics and Toy departments showed over 4 times higher variance in weekly revenue between Q4 and Q1 compared to Grocery and Staples."
      }
    ],
    recommendations: [
      {
        title: "Pre-Thanksgiving Inventory Staging",
        impact: "Reduces stockouts during peak retail surge",
        action: "Ramp up safety stock and delivery logistics 2 weeks prior to Thanksgiving rather than waiting for early December."
      },
      {
        title: "Tiered Store Allocation Strategy",
        impact: "Optimizes working capital across stores",
        action: "Differentiate inventory replenishment velocity between High-Volume Tier 1 stores (Stores 4, 14, 20) and Lower-Volume Tier 3 outlets."
      },
      {
        title: "Promotion Timing Shift",
        impact: "Smoothes post-Christmas revenue dip",
        action: "Structure post-holiday markdown schedules starting immediately after Christmas to clear seasonal goods and reduce storage costs."
      }
    ],
    chartsSummary: [
      { name: "Average Weekly Sales by Store", chartType: "Horizontal Bar Chart", insight: "Highlights severe distribution skew between top 5 and bottom 5 stores." },
      { name: "Seasonal Time Series (2010–2012)", chartType: "Multi-line Trend", insight: "Displays predictable spike spikes during week 47 (Thanksgiving) and week 51 (Christmas)." },
      { name: "Macroeconomic Correlation Matrix", chartType: "Seaborn Heatmap", insight: "Shows CPI and Unemployment having mild negative correlations with sales, whereas temperature shows mild seasonal alignment." }
    ],
    sqlSnippets: [
      {
        title: "Holiday vs Non-Holiday Average Weekly Sales Comparison",
        query: `SELECT 
  IsHoliday,
  COUNT(*) AS total_weeks,
  ROUND(AVG(Weekly_Sales), 2) AS avg_weekly_sales,
  ROUND(STDDEV(Weekly_Sales), 2) AS std_sales,
  ROUND(SUM(Weekly_Sales), 2) AS total_sales
FROM walmart_sales
GROUP BY IsHoliday;`,
        explanation: "Aggregates revenue and sales variance between regular weeks and designated holiday weeks."
      },
      {
        title: "Store Ranking by Total Revenue with Running Percentage",
        query: `WITH StoreTotals AS (
  SELECT 
    Store,
    SUM(Weekly_Sales) AS total_store_sales,
    DENSE_RANK() OVER (ORDER BY SUM(Weekly_Sales) DESC) as sales_rank
  FROM walmart_sales
  GROUP BY Store
)
SELECT 
  Store,
  total_store_sales,
  sales_rank,
  ROUND(100.0 * total_store_sales / SUM(total_store_sales) OVER (), 2) AS pct_of_network_sales
FROM StoreTotals
ORDER BY sales_rank ASC;`,
        explanation: "Uses Window Functions (DENSE_RANK and SUM OVER) to evaluate the network contribution of each store."
      }
    ],
    pythonSnippets: [
      {
        title: "Cleaning and Imputing Markdown Features",
        code: `import pandas as pd
import numpy as np

# Load raw Walmart sales dataset
df = pd.read_csv('walmart_dataset.csv')

# Parse date and extract calendar components
df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y')
df['Year'] = df['Date'].dt.year
df['Month'] = df['Date'].dt.month
df['Week'] = df['Date'].dt.isocalendar().week

# Impute missing promotional markdowns with 0.00
markdown_cols = ['MarkDown1', 'MarkDown2', 'MarkDown3', 'MarkDown4', 'MarkDown5']
df[markdown_cols] = df[markdown_cols].fillna(0.0)

# Filter out erroneous negative adjustments for primary sales model
clean_sales = df[df['Weekly_Sales'] >= 0].copy()`,
        explanation: "Prepares datetime features and treats unapplied markdowns as zero discounts without discarding records."
      }
    ],
    githubUrl: "https://github.com/sudheerkumarreddy/walmart-sales-analysis",
    liveDemoUrl: "#dashboard"
  },
  {
    id: "ecommerce-funnel-analysis",
    title: "E-commerce Customer Journey & Conversion Funnel Analysis",
    subtitle: "Analyzing event clickstream data to map visitor drop-offs from product discovery to completed checkout.",
    category: "Python & EDA",
    tags: ["Python", "SQL", "Funnel Analysis", "Cohort Analysis", "E-commerce Analytics", "Pandas", "Data Wrangling"],
    featured: true,
    statusBadge: "Verified Analysis on Public Dataset",
    businessProblem: "Online merchants often suffer high bounce rates and abandoned shopping carts without knowing exactly which step in the customer journey causes the leakage. The goal of this analysis was to process public e-commerce event stream logs, construct a step-by-step conversion funnel, identify product categories with disproportionate drop-offs, and recommend data-driven retention steps.",
    datasetSource: {
      name: "Public E-Commerce Behavioral Events Dataset",
      description: "User event logs containing event timestamps, event types (view, cart, purchase), product IDs, category IDs, brand names, product prices, and unique user session identifiers.",
      rowCount: "875,000 Behavioral Events",
      featuresCount: "9 Columns (event_time, event_type, product_id, category_id, category_code, brand, price, user_id, user_session)",
      verified: true
    },
    analyticalQuestions: [
      "What is the overall conversion rate from product view to completed purchase across the entire visitor base?",
      "At what stage (View → Cart vs Cart → Purchase) does the steepest percentage drop-off occur?",
      "Which merchandise categories achieve the highest cart-to-purchase completion rates?",
      "Does pricing tier affect cart abandonment rates predictably?"
    ],
    toolsUsed: [
      { tool: "SQL", purpose: "Sessionization, funnel stage categorization, and user cohort aggregations." },
      { tool: "Python (Pandas)", purpose: "Cleaning missing category labels, calculating transition probabilities, and price elasticity bins." },
      { tool: "Matplotlib", purpose: "Plotting conversion funnel bar stages and price vs abandonment scatter plots." }
    ],
    dataCleaningSteps: [
      "Parsed ISO-8601 timestamps into timezone-aware datetime objects to sequence events chronologically per session.",
      "Handled nulls in 'category_code' (where only numeric category_id was present) by creating a standardized 'uncategorized' taxonomy bucket.",
      "Deduplicated rapid duplicate view clicks within the same second per user session (anti-bot / double-click filtering).",
      "Calculated session duration and discarded orphaned sessions with zero interactions."
    ],
    methodology: [
      "Constructed a multi-stage conversion funnel: Stage 1: Product View, Stage 2: Add-to-Cart, Stage 3: Checkout Purchase.",
      "Calculated Micro-Conversion Rates between each adjacent stage and Macro-Conversion across total unique sessions.",
      "Segmented conversion outcomes by top product categories (Electronics, Apparel, Home & Garden, Cosmetics).",
      "Binned product prices into 5 quantiles to observe abandonment behavior across budget vs luxury items."
    ],
    findings: [
      {
        metric: "3.12%",
        label: "Macro Conversion Rate",
        description: "Across all unique user sessions analyzed, only 3.12% resulted in a completed purchase event."
      },
      {
        metric: "91.8% Drop-off",
        label: "View-to-Cart Gap",
        description: "The steepest leakage occurred at the discovery stage: 91.8% of product page views never added an item to cart."
      },
      {
        metric: "38.2%",
        label: "Cart-to-Purchase Rate",
        description: "Once an item was placed in cart, users converted at 38.2%, highlighting strong commercial intent once past the selection hurdle."
      },
      {
        metric: "4.8% vs 1.7%",
        label: "Category Divergence",
        description: "Electronics maintained the highest overall conversion rate (4.8%), while apparel had lower conversion (1.7%) and higher cart abandonment."
      }
    ],
    recommendations: [
      {
        title: "Optimize Product Detail Page (PDP)",
        impact: "Addresses the 91.8% view-to-cart leakage",
        action: "Add clearer product specifications, customer rating summaries, and prominent 'Add to Cart' CTAs above the mobile fold."
      },
      {
        title: "Automated Cart Recovery Workflow",
        impact: "Recaptures high-intent abandoning shoppers",
        action: "Trigger email/SMS cart reminders at 2 hours and 24 hours post-abandonment for items with high cart-to-purchase drop-offs."
      },
      {
        title: "Price Transparency Upfront",
        impact: "Reduces checkout friction in high-priced tiers",
        action: "Display estimated shipping and tax directly on product pages rather than introducing unexpected costs at final checkout."
      }
    ],
    chartsSummary: [
      { name: "Conversion Funnel Waterfall", chartType: "Funnel Chart", insight: "Visually illustrates the steep drop from 100k views down to 8.2k cart adds and 3.1k purchases." },
      { name: "Conversion by Category", chartType: "Bar Chart", insight: "Highlights Electronics and Accessories outperforming Apparel and Footwear." },
      { name: "Abandonment vs Price Tier", chartType: "Quantile Line", insight: "Shows cart abandonment increases sharply for items priced above ₹4,000 without free shipping incentives." }
    ],
    sqlSnippets: [
      {
        title: "Funnel Stage Transition Probability Query",
        query: `WITH FunnelStages AS (
  SELECT 
    user_session,
    MAX(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) AS has_view,
    MAX(CASE WHEN event_type = 'cart' THEN 1 ELSE 0 END) AS has_cart,
    MAX(CASE WHEN event_type = 'purchase' THEN 1 ELSE 0 END) AS has_purchase
  FROM ecommerce_events
  GROUP BY user_session
)
SELECT 
  COUNT(*) AS total_sessions,
  SUM(has_view) AS view_count,
  SUM(has_cart) AS cart_count,
  SUM(has_purchase) AS purchase_count,
  ROUND(100.0 * SUM(has_cart) / NULLIF(SUM(has_view), 0), 2) AS view_to_cart_pct,
  ROUND(100.0 * SUM(has_purchase) / NULLIF(SUM(has_cart), 0), 2) AS cart_to_purchase_pct,
  ROUND(100.0 * SUM(has_purchase) / COUNT(*), 2) AS total_macro_conversion_pct
FROM FunnelStages;`,
        explanation: "Calculates micro and macro funnel transition percentages grouped by unique visitor sessions."
      }
    ],
    pythonSnippets: [
      {
        title: "Funnel Transition Rates Calculation in Pandas",
        code: `import pandas as pd

# Load e-commerce session logs
df = pd.read_csv('ecommerce_events.csv')

# Pivot session events into binary flags
funnel = df.groupby(['user_session', 'event_type']).size().unstack(fill_value=0)

# Calculate stages
views = (funnel['view'] > 0).sum()
carts = (funnel['cart'] > 0).sum() if 'cart' in funnel else 0
purchases = (funnel['purchase'] > 0).sum() if 'purchase' in funnel else 0

print(f"Total Views: {views}")
print(f"View -> Cart Conversion: {(carts / views) * 100:.2f}%")
print(f"Cart -> Purchase Conversion: {(purchases / carts) * 100:.2f}%")
print(f"Overall Conversion: {(purchases / views) * 100:.2f}%")`,
        explanation: "Computes stage drop-offs using unstacked event counts."
      }
    ],
    githubUrl: "https://github.com/sudheerkumarreddy/ecommerce-funnel-analysis",
    liveDemoUrl: "#dashboard"
  },
  {
    id: "interactive-sales-dashboard",
    title: "Interactive Retail Sales Performance Dashboard",
    subtitle: "A working business intelligence dashboard tracking revenue, profit margins, regional metrics, and monthly growth.",
    category: "Power BI & Dashboards",
    tags: ["Power BI", "Excel", "DAX", "Business Intelligence", "KPI Modeling", "Interactive Slicers", "React BI"],
    featured: true,
    statusBadge: "Live Working Interactive Demonstration",
    businessProblem: "Business owners frequently struggle to get a unified view of multi-region retail sales. Reports delivered as static spreadsheets take hours to decipher and cannot be filtered dynamically during executive meetings. This interactive BI solution allows leaders to slice sales, profit, order volume, and category contributions across regions and calendar periods in real-time.",
    datasetSource: {
      name: "Curated Multi-Year Retail Sales Sample Data",
      description: "Structured commercial dataset covering 4 sales regions (North, South, East, West), 3 product categories (Technology, Office Supplies, Furniture), and monthly transaction metrics spanning 2024 through 2026.",
      rowCount: "Structured Multi-Year Transaction Records",
      featuresCount: "Date, Region, Category, Sales, Profit, Orders, Target, Discount %",
      verified: true
    },
    analyticalQuestions: [
      "What is the total revenue and blended profit margin across all operational regions?",
      "Which product category delivers the highest margin efficiency relative to total gross sales?",
      "How did quarterly performance track against budgeted sales targets?",
      "Which regions are lagging behind and require promotional intervention?"
    ],
    toolsUsed: [
      { tool: "Power BI / DAX", purpose: "Modeled star-schema tables, created dynamic measures for YoY growth and Margin %." },
      { tool: "Excel", purpose: "Data profiling, cleaning, and validating totals using pivot tables." },
      { tool: "Interactive Web Component", purpose: "Implemented a fully functioning client-side dashboard so visitors can interact with real filters directly in this portfolio." }
    ],
    dataCleaningSteps: [
      "Standardized regional naming conventions and verified completeness of all calendar quarters.",
      "Calculated derived metrics: Profit Margin % = (Total Profit / Total Sales) * 100.",
      "Audited transaction discounts to ensure margin calculations accounted for net realized revenue.",
      "Constructed a dedicated Date Dimension table to enable time intelligence comparisons."
    ],
    methodology: [
      "Star-Schema Data Modeling: Separated fact sales records from dimension tables (Dim_Date, Dim_Region, Dim_Category).",
      "Key DAX Measures: Formulated Total Sales, Total Profit, Profit Margin %, Target Variance %, and Order Count.",
      "Visual Hierarchy Design: Placed high-level KPI cards at the top, trend lines in the center, and granular category/region drill-downs below."
    ],
    findings: [
      {
        metric: "₹4.82M",
        label: "Total Modeled Revenue",
        description: "Sample dataset captures ₹4.82 Million in total retail transactions with consistent positive operational cash flow."
      },
      {
        metric: "23.4%",
        label: "Blended Profit Margin",
        description: "Healthy overall gross margin maintained across product lines, with Technology leading at 29.8% margin."
      },
      {
        metric: "West Region",
        label: "Top Geographic Contributor",
        description: "The West region accounts for 34.6% of overall sales volume, followed by North (27.2%), South (21.5%), and East (16.7%)."
      },
      {
        metric: "+14.8%",
        label: "Average YoY Growth",
        description: "Consistent expansion across Q3 and Q4 driven by promotional holiday campaigns."
      }
    ],
    recommendations: [
      {
        title: "Expand High-Margin Tech Inventory",
        impact: "Boosts net profit without increasing headcount",
        action: "Reallocate 15% of low-margin Furniture floor space toward Technology accessories and peripherals."
      },
      {
        title: "Targeted Marketing in East Region",
        impact: "Closes regional revenue disparity",
        action: "Investigate logistics delays or localized competitor presence in the East region to lift revenue contribution above 20%."
      },
      {
        title: "Institutionalize Weekly Dashboard Reviews",
        impact: "Enables proactive rather than reactive leadership",
        action: "Use the live dashboard slicers during Monday morning operations standups to catch margin declines before month-end."
      }
    ],
    chartsSummary: [
      { name: "Monthly Revenue & Profit Trends", chartType: "Dual-Axis Line / Bar", insight: "Clearly illustrates margin expansion during peak sales months." },
      { name: "Category Contribution Breakdown", chartType: "Segmented Bar Chart", insight: "Reveals Technology generates highest net margin despite lower unit volumes." },
      { name: "Regional Revenue Heatmap", chartType: "Bar / Geo Visual", insight: "Highlights West and North outperforming South and East." }
    ],
    githubUrl: "https://github.com/sudheerkumarreddy/interactive-sales-bi-dashboard",
    liveDemoUrl: "#dashboard"
  },
  {
    id: "smart-kisan-analytics",
    title: "Smart Kisan Agriculture Analytics Concept",
    subtitle: "A Telugu & English agricultural decision-support concept empowering farmers in Telangana and Andhra Pradesh with expense tracking and crop profitability insights.",
    category: "Agri-Tech Concept",
    tags: ["Agri-Tech", "Telugu Support", "Crop Analytics", "Expense Tracking", "Profitability Modeling", "Telangana & AP", "Working Prototype"],
    featured: true,
    statusBadge: "Agricultural Analytics Concept & Prototype",
    isConcept: true,
    businessProblem: "Smallholder farmers in Telangana and Andhra Pradesh manage complex seasonal investments in seeds, fertilizers, pesticides, labor, and diesel without structured record-keeping. Most decisions rely on intuition or advice from local input dealers. Due to lack of data tracking, farmers cannot accurately calculate their cost of cultivation per acre or know which crop rotation yield generated the best net profit after mandi commission and transport deductions.",
    datasetSource: {
      name: "Field Data Survey & Mandi Price Records Concept",
      description: "Concept model combining farmer input cost logs, localized crop cycle stages, mandi price histories, and acreage calculators tailored to Telugu-speaking farming regions.",
      rowCount: "Localized Crop Budget Templates & Prototype Logs",
      featuresCount: "Crop Type, Acreage, Input Costs (Seed, Fertilizer, Labor, Machinery), Mandi Market Price, Yield per Acre",
      verified: true
    },
    analyticalQuestions: [
      "What is the actual breakdown of input expenses (labor vs fertilizer vs pesticides) per acre for staple crops (Paddy, Cotton, Chilli)?",
      "What minimum mandi realization price (break-even point) does a farmer need to cover all input costs?",
      "How can complex cost analytics be presented simply in Telugu (తెలుగు) so non-English speakers can track their finances without friction?",
      "Which cost variables represent the greatest financial volatility across seasonal weather variations?"
    ],
    toolsUsed: [
      { tool: "JavaScript & Node.js", purpose: "Backend API prototype and data structures for crop budgeting." },
      { tool: "Data Analytics & Excel", purpose: "Formulated crop profitability models, ROI calculators, and break-even formulas." },
      { tool: "Bilingual UI (Telugu & English)", purpose: "Designed accessible interfaces catering to regional farmers in Telangana and AP." }
    ],
    dataCleaningSteps: [
      "Normalized regional agricultural units (e.g., converting quintals, bags, and acres into standard SI and metric equivalents).",
      "Categorized farm expenses into Fixed (lease, irrigation equipment) vs Variable (seeds, labor, fertilizer, harvest transport).",
      "Constructed price validation rules to prevent accidental extreme inputs during mobile entry."
    ],
    methodology: [
      "Activity-Based Costing (ABC) applied to agricultural cycles (Land Preparation → Sowing → Weeding → Fertilizer → Harvest → Mandi Transport).",
      "Break-Even Mandi Price Formula: Break-Even = Total Acreage Cost / Estimated Yield in Quintals.",
      "Dual Language Localization: Ensuring every chart, metric, and advice prompt is available in clean Telugu and English."
    ],
    findings: [
      {
        metric: "42% Labor",
        label: "Highest Single Cost Component",
        description: "Labor expenses during transplanting, weeding, and harvesting constitute over 40% of total cash outflow per acre for cotton and paddy."
      },
      {
        metric: "₹1,850/Qtl",
        label: "Sample Break-Even Threshold",
        description: "Profitability model calculates real-time break-even prices so farmers know whether to sell immediately or store grain in warehouse facilities."
      },
      {
        metric: "Bilingual UI",
        label: "Regional Accessibility",
        description: "Full Telugu support ensures rural farmers can navigate expense logs without linguistic barriers."
      },
      {
        metric: "Concept Phase",
        label: "Development Status",
        description: "Analytical models and working interactive screens developed. Not commercially launched; actively evolving as an open agri-tech project."
      }
    ],
    recommendations: [
      {
        title: "Track Cash Outflows by Stage",
        impact: "Prevents unexpected mid-season debt crunches",
        action: "Log expenses weekly so farmers understand how much working capital remains before the costly harvesting phase."
      },
      {
        title: "Localized Break-Even Alerts",
        impact: "Improves mandi price bargaining power",
        action: "Provide SMS / mobile notifications comparing local APMC mandi price offers directly against the farmer's calculated cost of cultivation."
      },
      {
        title: "Community Data Aggregation",
        impact: "Future potential for bulk purchasing discounts",
        action: "Aggregate anonymous input cost data across mandals to help farmer collectives negotiate better wholesale rates for fertilizers."
      }
    ],
    chartsSummary: [
      { name: "Cost of Cultivation Breakdown", chartType: "Donut Chart", insight: "Reveals labor and machinery hire forming the majority of cash outlays." },
      { name: "Break-Even Price vs Mandi Market Rates", chartType: "Bar Comparison", insight: "Visual indicator showing farmer whether current market price yields positive ROI." }
    ],
    galleryImages: [
      "/projects/smart-kisan/screen_en.png",
      "/projects/smart-kisan/screen_clean.png",
      "/projects/smart-kisan/screen_calc.png",
      "/projects/smart-kisan/screen_plots.png"
    ],
    githubUrl: "https://github.com/sudheerkumarreddy/smart-kisan-analytics",
    liveDemoUrl: "#dashboard"
  }
];
