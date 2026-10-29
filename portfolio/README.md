# Sudheer | Data Analytics & Business Intelligence Portfolio

A premium, futuristic, 3D animated personal portfolio website for **Sudheer Kumar Reddy Ankireddypalli**, an aspiring Data Analyst and freelance analytics consultant based in Hyderabad, Telangana, India.

---

## 🌟 Key Highlights & Architecture

- **Cinematic 3D Experience:** WebGL Three.js interactive particle node network with mouse parallax, dynamic proximity links, reduced-motion fallbacks, and floating 3D dashboard cards.
- **Deep Space / Cyber Aesthetics:** Deep black (`#030712`) and midnight navy background, electric purple (`#a855f7`) and cyan (`#06b6d4`) accents, subtle glowing borders, and glassmorphism.
- **Embedded Interactive BI Dashboard:** A fully working client-side retail sales business intelligence dashboard with interactive slicers (Year, Region, Category), dynamic KPI metric cards, responsive SVG monthly sales and profit margin charts, category progress bars, and a searchable, sortable, paginated data explorer table.
- **4 Comprehensive Analytics Case Studies:**
  1. **Walmart Customer Behavior & Sales Trend Analysis:** 45-store seasonal volatility, holiday impact (+68.4% Thanksgiving surge), macroeconomic correlation, cleaning methodology, SQL window queries, and Python scripts.
  2. **E-commerce Customer Journey & Conversion Funnel Analysis:** Public clickstream events, 3-stage funnel breakdown (3.12% macro conversion, 91.8% view-to-cart drop-off, 38.2% cart-to-purchase), and evidence-based retention recommendations.
  3. **Interactive Retail Sales Performance Dashboard:** Multi-year commercial transactions, profit margin modeling, category and regional performance.
  4. **Smart Kisan Agriculture Analytics Concept:** Agricultural technology concept for Telangana & Andhra Pradesh, Telugu and English support, crop cultivation cost breakdown (42% labor), break-even pricing calculators, and authentic prototype screenshots from the workspace.
- **6 Freelance Analytics Services:**
  1. Data Cleaning & Preparation
  2. Excel Reporting & KPI Summaries
  3. SQL Analysis & Business Queries
  4. Python Analytics & EDA
  5. Power BI Dashboards & Monitoring
  6. Business Insights & Executive Summaries
- **Indicative INR Pricing:** Starter Analytics (₹1,500–₹3,000), Business Insights (₹4,000–₹8,000), Dashboard Solution (₹6,000–₹15,000) with honest scope disclaimers.
- **8-Step Delivery Process:** Animated timeline detailing Discovery → Scope → Data Audit → Analysis → Visualization → QA → Delivery → Handover.
- **Technical Skills Showcase:** Programming (Python, SQL), Data Manipulation (Pandas, NumPy), Visualization (Power BI, Excel, Matplotlib, Seaborn), Analytics (EDA, Data Wrangling, Feature Engineering, Hypothesis Testing), and Tools (MySQL, Git, GitHub, Jupyter Notebook, VS Code).
- **Interactive Lead Generation & Contact:** Functional project inquiry form with validation, local lead persistence, celebratory confetti, and one-click direct email (mailto) and WhatsApp generation.
- **Curriculum Vitae Preview Modal:** Clean printable/downloadable resume view with instant print stylesheet (`window.print()`).

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Bundler:** Vite 5 (with optimized vendor and Three.js chunking)
- **Styling:** Tailwind CSS (custom cyber palette & glassmorphism)
- **3D & Particles:** Three.js (WebGL with low-power preference and reduced-motion support)
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti

---

## 📂 Project Folder Structure

```
portfolio/
├── dist/                      # Production build output
├── public/
│   ├── 404.html               # Custom 404 error page
│   ├── CNAME                  # Custom domain configuration (sudheerkumarreddy.com)
│   ├── favicon.svg            # Custom neon SVG favicon
│   ├── og-preview.svg         # High-resolution social share card
│   ├── resume.pdf             # Valid sample PDF resume ready for user replacement
│   └── projects/
│       └── smart-kisan/       # Authentic workspace prototype screenshots
├── src/
│   ├── components/
│   │   ├── About.tsx          # Professional intro & 6-step animated workflow
│   │   ├── CaseStudyModal.tsx # In-depth modal with problem, audit, methodology, findings, code & gallery
│   │   ├── Contact.tsx        # Lead generation form with preselection & direct WhatsApp/Email links
│   │   ├── Footer.tsx         # Branding, copyright year, links & back-to-top
│   │   ├── Hero.tsx           # 3D command deck, live KPIs, SQL/Python code snippet, action buttons
│   │   ├── InteractiveDashboard.tsx # Embedded live working BI sales dashboard
│   │   ├── Navbar.tsx         # Sticky glassmorphic header with active section spy & mobile drawer
│   │   ├── Pricing.tsx        # Indicative INR packages with transparent disclaimers
│   │   ├── Process.tsx        # 8-step client delivery timeline & trust guarantees
│   │   ├── Projects.tsx       # Filterable & searchable case studies gallery
│   │   ├── ResumeModal.tsx    # Live resume viewer with print & PDF download
│   │   ├── Services.tsx       # 6 freelance service cards with deliverables & preselect CTA
│   │   ├── Skills.tsx         # Categorized skills matrix with real-world applications
│   │   └── ThreeBackground.tsx# WebGL 3D data particle network with mouse parallax
│   ├── data/
│   │   ├── personalInfo.ts    # Centralized personal details, bio, links, and resume data
│   │   ├── pricingData.ts     # Indicative packages and scope disclaimers
│   │   ├── processData.ts     # 8 delivery steps and guarantees
│   │   ├── projectsData.ts    # Full structured data for the 4 case studies
│   │   ├── salesDashboardSampleData.ts # Multi-year retail transactions for the live BI dashboard
│   │   ├── servicesData.ts    # 6 freelance service offerings and deliverables
│   │   └── skillsData.ts      # Categorized technical skills and practical use cases
│   ├── types/
│   │   └── index.ts           # Strict TypeScript interfaces
│   ├── App.tsx                # Main coordinating application layout
│   ├── index.css              # Custom scrollbars, print styles, and Tailwind layers
│   └── main.tsx               # Application entry point
├── DEPLOYMENT.md              # Complete deployment and custom domain setup guide
├── index.html                 # SEO metadata, Open Graph, fonts, and title
├── netlify.toml               # Netlify configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Theme extensions, keyframes, and glows
├── tsconfig.json              # TypeScript configuration
├── vercel.json                # Vercel SPA rewrites and caching headers
└── vite.config.ts             # Vite build configuration with chunk splitting
```

---

## 🚀 Running Locally

From the root project directory:

```powershell
# Run the local development server (with hot reload)
npm run portfolio:dev

# Build for production
npm run portfolio:build

# Preview the production build
npm run portfolio:preview
```

Or navigating directly into the `portfolio/` directory:
```powershell
cd portfolio
npm run dev
```

---

## 🧪 Quality Assurance & Verification

- [x] **Zero TypeScript Errors:** Strict type checks passed across all components.
- [x] **Optimized Production Build:** Clean rollup chunking for `three`, `vendor`, and `lucide` modules.
- [x] **Working Slicers & BI Demo:** Real-time filter recalculation on Year, Region, and Category.
- [x] **Service Preselection:** Clicking "Discuss Your Project" from any service or package pre-fills the inquiry form and scrolls down.
- [x] **Authentic Prototype Screenshots:** Embedded actual captures from the local Smart Kisan project.
- [x] **Resume PDF Download & Print:** Interactive modal with custom `@media print` layout and valid PDF download link.
- [x] **Zero Synthetic Claims:** Fully honest positioning as an aspiring analyst; no fabricated work histories, fake client logos, or false 5-star ratings.
- [x] **Responsive & Accessible:** Tested across desktop and mobile layouts with accessible keyboard controls and reduced-motion detection.
