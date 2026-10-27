# Smart Kisan (స్మార్ట్ కిసాన్) — Production Web App

Smart Kisan (స్మార్ట్ కిసాన్) is a high-reliability, mobile-first, Telugu-first web application designed for farmers across Andhra Pradesh, Telangana, and all of India. Built with a Node.js 18+ Express backend and a zero-build vanilla JS single-page frontend, it delivers deterministic crop profitability accounting, expense diary management, produce sales tracking, batch traceability, Open-Meteo live weather, and AGMARKNET mandi price feeds.

---

## 🌟 Key Features

1. **Telugu-First Bilingual Interface**:
   - Native Telugu default language with a seamless English toggle on every screen (`public/i18n.js`).
   - Clean, accessible typography using Google Fonts **Noto Sans Telugu** with native system fallbacks.
   - High-contrast **Light and Dark theme modes** with instant toggle and persistence.
2. **Crop Cycles Management**:
   - Bilingual catalog of **40+ common Indian crops** (Paddy, Turmeric, Cotton, Chilli, Groundnut, Maize, Pulses, Vegetables, Fruits, Cash Crops) plus custom crop entry.
   - Farmer sets start date, end date, planted area in acres, and notes.
3. **15-Category Tap-to-Pick Expense Diary**:
   - Mobile-first tap tiles: Seeds (విత్తనాలు), Fertilizer (ఎరువులు), Pesticides (పురుగుమందులు), Labour (కూలీలు), Water/Irrigation (నీటిపారుదల), Electricity/Diesel (కరెంటు), Tractor Ploughing (ట్రాక్టర్), Machinery Hire (యంత్రాలు), Harvest & Threshing (కోత), Transport (రవాణా), Drying & Cleaning (ఆరబెట్టడం), Packing & Bags (ప్యాకింగ్), Land Lease (కౌలు), Loan Interest (వడ్డీ), and Other (ఇతర).
   - Instant amount keypad, date picker, and notes.
4. **Sales & Deductions Accounting**:
   - Gross sale amount, mandi/trader deductions (commission, hamali, moisture cuts), quantity, unit (Quintal, Kg, Bag, Ton), buyer name, and date.
   - Calculates net cash realized by the farmer.
5. **Deterministic Profit & Loss Intelligence**:
   - Formula: $\text{Net Profit} = (\text{Gross Sales} - \text{Total Deductions}) - \text{Total Cost}$.
   - Calculates per-acre net profit/loss, per-acre cost, and per-acre gross yield realization.
   - Visual category cost breakdown with percentage progress bars.
   - Intelligent warnings when expenses or sales records are missing.
   - **Previous Season Comparison**: Compares cost change, profit change, and per-acre differential against the previous cycle of the same crop.
   - **Printable Crop Statement View**: Clean, printable summary with farmer details, crop summary, and itemized accounts (`window.print()` / PDF export).
6. **Live Weather Intelligence (Open-Meteo)**:
   - Free, no-API-key Open-Meteo feed.
   - Geocodes farmer's village within their state, with automatic fallback to district when village coordinates are unavailable.
   - Displays current temperature, apparent temperature, humidity, wind speed, rain millimeters, plus a 5-day daily forecast with rain probability.
   - 10-minute in-memory cache to conserve bandwidth.
7. **Live Mandi Rates (data.gov.in AGMARKNET)**:
   - Direct integration with data.gov.in resource `9ef84268-d588-465a-a308-a864a43d0070`.
   - Filters by state and commodity; sorts the farmer's home district first.
   - Displays modal, minimum, and maximum prices with market yard and arrival dates.
   - Mandatory wholesale reference price disclaimer (not a guaranteed farm-gate price).
   - 30-minute in-memory cache.
   - Transparent error states: Never shows fabricated numbers.
8. **Buyer Procurement Offers**:
   - Displays buyer requests with net price calculation ($\text{Price} - \text{Deduction}$), sorting by highest net return.
   - Automatic expiration flagging.
   - Non-coercive disclaimer: Informational only; farmers retain 100% freedom to sell anywhere.
9. **Crop-Stage Reminders & Agronomic Calendar**:
   - Data-driven cultural calendars based on days elapsed since planting ($0$ to $240+$ days).
   - Comprehensive stage-by-stage guide for **Turmeric (పసుపు)**, **Paddy (వరి)**, **Cotton (పత్తి)**, and **Chilli (మిరప)**.
   - Mandatory advisory disclaimer: Cultural guidance only; no medical or chemical prescriptions.
10. **Local Agricultural Service Directory**:
    - Directory of local Drone spraying crews, Machinery/Tractor operators, Labour groups, and Agri-Transport.
    - Displays rates, ratings, verified badge, and one-tap phone dialer (`tel:`).
11. **Produce Batch Traceability**:
    - Generates unique batch codes (`SK-{CROP}-{YEAR}-{RANDOM}`).
    - Tracks harvest date, weight (kg), moisture %, quality grade, and processing status (`received` → `dried` → `milled` → `packed` → `sold`).
    - Mandatory statutory disclosure: Claims like 'Organic' require formal accreditation (NPOP/APEDA/Jaivik Bharat).
12. **Privacy, Security & Strict Tenant Isolation**:
    - Custom phone number + bcrypt password authentication (no Supabase Auth).
    - Session JWT in HTTP-only, `sameSite=lax` secure cookie.
    - Rate-limiting on login/signup endpoints.
    - Zero collection of Aadhaar, PAN, or bank credentials.
    - "Delete my account and all my data": Permanently wipes all farmer cycles, expenses, sales, and batches via SQL cascading delete (`ON DELETE CASCADE`).

---

## 🗄️ Database Architecture (Supabase Postgres)

The application uses **Supabase PostgreSQL** via the native Node.js `pg` connection pool.

### 1. Creating Your Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **New project**.
2. Select an organization, name your project (e.g. `smart-kisan`), set a strong database password, and choose a region close to your users (e.g. `ap-south-1` Mumbai).
3. Wait for the database provisioning to complete.

### 2. Finding Your Connection String (Pooler)
1. In your Supabase dashboard, navigate to **Project Settings** (gear icon at the bottom left) > **Database**.
2. Scroll to the **Connection string** section.
3. Select the **Transaction** or **Session** pooler mode (port `6543`).
4. Copy the connection URI:
   ```text
   postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```
5. Paste this into your `.env` file as `DATABASE_URL`.

### 3. Running `schema.sql` in the Supabase SQL Editor
1. In your Supabase dashboard, click on the **SQL Editor** tab in the left sidebar.
2. Click **New query**.
3. Open [`schema.sql`](file:///c:/Users/ankir/Downloads/smart%20kisan/schema.sql) from this repository, copy the full contents, and paste them into the SQL editor.
4. Click **Run** (or press Ctrl+Enter).
5. All 8 tables (`users`, `cycles`, `expenses`, `sales`, `offers`, `providers`, `batches`, `audit`), indexes, and Row Level Security configurations will be created.

### 4. Row Level Security (RLS) Policy
Every table has Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) with **zero public policies**. This ensures that direct PostgREST or Supabase anonymous/public API calls (`anon_key`) cannot read or mutate any farmer records. Only our backend Node.js server connecting with the database connection pooler has access to query the tables using parameterized queries.

### 5. Running Migrations Programmatically
You can also run migrations directly from the command line:
```bash
npm run migrate
```
This executes `migrations/migrate.js`, which reads numbered `.sql` files in `migrations/` and records applied versions inside a `migrations_meta` table.

---

## 🔑 Getting a Free data.gov.in API Key

1. Visit [data.gov.in](https://data.gov.in) and register for a free account.
2. Complete your email verification and log in.
3. Click on **My Account** in the top navigation bar.
4. Copy your personal **API Key**.
5. Add it to your `.env` file:
   ```env
   DATA_GOV_KEY=your_copied_api_key_here
   ```
*Note: If the key is not set, Smart Kisan displays a transparent, friendly notice explaining how to configure the key, and never invents fake prices.*

---

## 💻 Local Installation & Run

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Step-by-Step Setup
```bash
# 1. Clone repository and navigate to folder
cd "smart kisan"

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env and fill in your values
cp .env.example .env

# 4. Run automated test suite
npm test

# 5. Start the production server
npm start
```
The server will start on port `3000`:
👉 Open `http://localhost:3000` in your smartphone or desktop browser.

---

## 🧪 Automated Testing

Smart Kisan includes automated tests built with the **Node.js built-in test runner** (`node --test`), requiring zero external test libraries:

```bash
npm test
```

### What is tested:
1. [`test/auth.test.js`](file:///c:/Users/ankir/Downloads/smart%20kisan/test/auth.test.js):
   - Phone validation regex `/^[6-9]\d{9}$/` across valid and invalid Indian numbers.
   - Password hashing and verification with `bcryptjs`.
   - JWT token generation, expiration, and tampering prevention.
   - Privacy consent timestamp enforcement.
2. [`test/isolation.test.js`](file:///c:/Users/ankir/Downloads/smart%20kisan/test/isolation.test.js):
   - Multi-tenant data isolation: Farmer 1 (Ramesh) and Farmer 2 (Suresh).
   - Cross-tenant queries return 0 rows.
   - Unauthorized cross-tenant delete/update attempts return 0 modified rows.
   - Account deletion cascade: Removing Farmer 1 purges all their cycles, expenses, and sales, leaving Farmer 2 untouched.
3. [`test/profit.test.js`](file:///c:/Users/ankir/Downloads/smart%20kisan/test/profit.test.js):
   - Deterministic gross sales, deductions, total expenses, and net profit calculations.
   - Negative net profit (loss) handling.
   - Zero-acre and negative-acre divide-by-zero protection.
   - Percentage breakdown of categories.
   - Missing data warning flags (`NO_EXPENSES`, `NO_SALES`).
   - Previous cycle season-on-season comparative analytics.
4. [`test/features.test.js`](file:///c:/Users/ankir/Downloads/smart%20kisan/test/features.test.js):
   - Buyer offers net price formula and expiration sorting.
   - Turmeric agronomy stage selection based on days elapsed.
   - Traceability batch code format validation (`SK-{CROP}-{YEAR}-{RANDOM}`).
   - Mandi rate disclosure validation.

---

## 🚀 Production Deployment

### 1. Deploying to Render
1. Create a **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `JWT_SECRET`: `[GENERATE_A_64_CHARACTER_RANDOM_STRING]`
   - `DATABASE_URL`: `[YOUR_SUPABASE_POOLER_CONNECTION_STRING]`
   - `DATA_GOV_KEY`: `[YOUR_DATA_GOV_KEY]`
5. Click **Deploy Web Service**.

### 2. Deploying to Railway
1. Create a **New Project** on [Railway](https://railway.app) from your GitHub repo.
2. In **Variables**, add `DATABASE_URL`, `JWT_SECRET`, `DATA_GOV_KEY`, and `NODE_ENV=production`.
3. Railway automatically detects `npm start` and exposes your service with HTTPS.

### 3. Deploying to a Linux VPS (Ubuntu / Debian)
```bash
# Update system & install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx

# Clone app and install
cd /var/www
git clone <repo-url> smart-kisan
cd smart-kisan
npm install --omit=dev

# Setup PM2 process manager
sudo npm install -g pm2
pm2 start server.js --name "smart-kisan"
pm2 save
pm2 startup

# Configure Nginx as reverse proxy to http://127.0.0.1:3000
# Obtain free SSL certificate with Let's Encrypt:
sudo certbot --nginx -d smartkisan.yourdomain.com
```

---

## 🔒 HTTPS & Security Best Practices

- Always run behind **HTTPS** in production. When `NODE_ENV=production`, the application automatically enables the `secure: true` flag on HTTP-only authentication cookies (`sk_token`), preventing token transmission over unencrypted HTTP.
- Parameterized SQL queries are strictly enforced across all routes to prevent SQL injection.
- UI strings are escaped using `escapeHtml()` prior to DOM insertion to prevent Cross-Site Scripting (XSS).

---

## 💾 Backups & Disaster Recovery

### Supabase Automated Backups
- Supabase provides automated daily backups in **Project Settings > Database > Backups**.
- **Important Warning for Real Farmers**: Free-tier Supabase projects automatically pause after 7 days of inactivity. For real farmers using this app in production, **upgrade to the Supabase Pro Plan** to ensure 24/7 database availability, point-in-time recovery (PITR), and daily automated backups.

### Manual `pg_dump` Backup Command
To take an immediate offsite backup of your entire database:
```bash
pg_dump "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require" \
  --format=custom \
  --file="smart_kisan_backup_$(date +%Y%m%d_%H%M%S).dump"
```

To restore from a backup:
```bash
pg_restore --clean --no-acl --no-owner \
  --dbname="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require" \
  smart_kisan_backup_20261027.dump
```

---

## 📁 Repository Structure

```text
smart kisan/
├── server.js              # Express app entry point & route registration
├── db.js                  # PostgreSQL connection pool with SSL & parameterized query runner
├── schema.sql             # Complete PostgreSQL schema with 8 tables, indexes, and RLS
├── package.json           # Node.js dependencies & test scripts
├── .env.example           # Environment template with zero real secrets
├── .gitignore             # Git ignore file protecting .env and node_modules
├── README.md              # Comprehensive production setup & operational guide
├── migrations/
│   ├── 001_initial_schema.sql  # Initial schema migration
│   ├── 002_seed_initial_data.sql # Service directory & initial buyer offers
│   └── migrate.js         # Transactional migration runner
├── middleware/
│   └── auth.js            # JWT verification & tenant isolation middleware
├── routes/
│   ├── health.js          # Database connection & service health check
│   ├── auth.js            # Signup, login, logout, and account deletion with audit
│   ├── cycles.js          # 40+ crop cycles CRUD with tenant isolation
│   ├── expenses.js        # 15-category expense diary CRUD
│   ├── sales.js           # Harvest sales, deductions, and buyer tracking
│   ├── profit.js          # Deterministic net profit, per-acre, & seasonal comparison
│   ├── weather.js         # Open-Meteo geocoding, district fallback, & 5-day forecast
│   ├── mandi.js           # data.gov.in AGMARKNET feed with district sorting & cache
│   ├── offers.js          # Buyer offers comparison by net price
│   ├── reminders.js       # Data-driven crop calendars (Turmeric, Paddy, Cotton, Chilli)
│   ├── services.js        # Agri service directory (Drone, Labour, Machinery, Transport)
│   └── batches.js         # Produce batch traceability & status flow
├── constants/
│   └── crops.js           # Bilingual catalog of 40+ Indian crops
├── public/
│   ├── index.html         # Single page application markup
│   ├── app.js             # Mobile-first vanilla JS client & offline handlers
│   ├── i18n.js            # Complete Telugu (default) and English translation dictionary
│   └── styles.css         # Responsive mobile-first CSS with Noto Sans Telugu & dark mode
└── test/
    ├── mock_db.js         # In-memory database emulator with cascading deletes
    ├── auth.test.js       # Phone regex, bcrypt, JWT, and consent test suite
    ├── isolation.test.js  # Cross-tenant data isolation & account wipe test suite
    ├── profit.test.js     # Deterministic accounting & zero-division safety suite
    └── features.test.js   # Offers, reminders, batches, and mandi tests
```

---

## 📄 License & Ethical Disclosures

- **General Guidance Only**: Crop calendars and stage reminders provide cultural guidance. Farmers should always consult their local Agricultural Extension Officer (AEO/AO) for specific soil and pest prescriptions.
- **Wholesale Price Transparency**: Live mandi prices from data.gov.in reflect wholesale APMC yard modal arrivals, not guaranteed farm-gate procurement prices.
- **Traceability Transparency**: Batch traceability records post-harvest processing. Official commercial claims of "Organic" legally require accredited certification from NPOP/APEDA/Jaivik Bharat.
