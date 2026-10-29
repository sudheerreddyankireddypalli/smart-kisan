# Deployment & Custom Domain Guide for Sudheer Kumar Reddy Ankireddypalli

This guide provides end-to-end instructions for deploying your futuristic 3D analytics portfolio to the web for free and connecting your custom domain **`sudheerkumarreddy.com`** (or alternative **`sudheeranalytics.com`**).

---

## 1. Free Deployment Options

### Option A: Deploy to Vercel (Recommended - Fastest & Zero Config)

Vercel natively supports Vite + React single-page applications with automated SSL and edge performance.

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Complete Sudheer Data Analytics 3D Portfolio"
   git push origin main
   ```
2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
   - Click **Add New...** → **Project**.
   - Select your repository (`smart-kisan` or your dedicated portfolio repository).
   - In the **Root Directory** setting, click **Edit** and select `portfolio` (or leave as root if you deployed the portfolio repo directly).
   - Framework Preset will auto-detect as **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**.
3. **Your free live preview URL:**
   - Vercel will immediately generate a free live URL such as `https://sudheer-analytics.vercel.app`.

---

### Option B: Deploy to Netlify

1. Go to [netlify.com](https://www.netlify.com/) and connect your GitHub repository.
2. Configure build settings:
   - **Base directory:** `portfolio`
   - **Build command:** `npm run build`
   - **Publish directory:** `portfolio/dist`
3. Netlify will use the included `portfolio/netlify.toml` which already configures Single Page App rewrites and asset caching.
4. Your free preview URL will be ready at `https://sudheer-analytics.netlify.app`.

---

### Option C: Deploy to GitHub Pages

1. In `portfolio/vite.config.ts`, if your repository is hosted at `https://<username>.github.io/<repo>/`, set `base: '/<repo>/'`. If using a custom domain directly, leave `base: '/'`.
2. Run `npm run build`.
3. Push the contents of the `portfolio/dist` folder to your `gh-pages` branch.
4. In GitHub repository settings → **Pages**, select the `gh-pages` branch. The pre-configured `portfolio/public/CNAME` will configure GitHub Pages for `sudheerkumarreddy.com`.

---

## 2. Connecting Your Custom Domain (`sudheerkumarreddy.com`)

When you purchase or configure your domain on your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare Registrar, Google Domains/Squarespace):

### Vercel Custom Domain Configuration:
1. In your Vercel project dashboard, navigate to **Settings** → **Domains**.
2. Type `sudheerkumarreddy.com` and click **Add**.
3. Also add `www.sudheerkumarreddy.com` and select the option to redirect `www` to the apex domain `sudheerkumarreddy.com`.
4. Vercel will display the exact DNS records to add. Log in to your domain registrar's DNS Management console and add:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (or blank) | `76.76.21.21` | Automatic / 300 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Automatic / 300 |

5. **SSL Certificate:** Vercel will automatically provision a free, auto-renewing Let's Encrypt SSL/TLS certificate. Propagation typically takes between 2 to 30 minutes.

---

## 3. Free Professional Custom Domain Email Setup

To receive inquiries at **`contact@sudheerkumarreddy.com`** forwarded to your primary inbox (**`sudheerkumarreddy.analytics@gmail.com`**) completely free without paying for Google Workspace:

### Using Cloudflare Free Email Routing:
1. Add `sudheerkumarreddy.com` to Cloudflare (Free plan).
2. Go to **Email** → **Email Routing** in your Cloudflare dashboard.
3. Click **Add custom address**:
   - Custom address: `contact` (creates `contact@sudheerkumarreddy.com`)
   - Destination: `sudheerkumarreddy.analytics@gmail.com`
4. Verify your Gmail destination address via the confirmation link sent to your inbox.
5. Cloudflare will automatically add the required MX and TXT records to your domain DNS. Any inquiry sent to your custom domain will instantly forward to your personal Gmail!

---

## 4. Contact Form Configuration (Connecting Backend)

The portfolio currently implements:
1. **Local Lead Persistence:** Inquiries are stored in browser `localStorage` (`sudheer_inquiries`) with zero data loss.
2. **Instant Delivery Actions:** Once submitted, users can click **"Send via Email Client"** (pre-formats a complete mailto email) or **"Send via WhatsApp"** (pre-formats a message directly to your WhatsApp).

### Optional: Enabling Automatic Email Notifications via Formspree (Free)
If you want every form submission to automatically email you without opening an email client:
1. Sign up for free at [formspree.io](https://formspree.io).
2. Create a new form and copy your unique Form ID (e.g., `xpznqkly`).
3. In `portfolio/src/components/Contact.tsx`, update the `handleSubmit` function:
   ```typescript
   await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(formData)
   });
   ```

---

## 5. Customizing Your Resume & Personal Information

### Uploading Your Own Resume PDF:
1. Prepare your resume in PDF format.
2. Name the file: `resume.pdf`
3. Place it in: `portfolio/public/resume.pdf`
4. Run `npm run portfolio:build`. The "Download My Resume" button and Resume Preview modal will automatically serve your real PDF file!

### Editing Personal Information & Social Links:
Open `portfolio/src/data/personalInfo.ts`:
- Update `contact.whatsappNumber` with your actual phone number.
- Update `contact.email` or `contact.linkedin` with your exact profile URLs.
- All components automatically update instantly!

### Editing Case Studies & Projects:
Open `portfolio/src/data/projectsData.ts`:
- Update GitHub repository URLs, live demo links, dataset descriptions, or add new projects.

### Editing Pricing & Services:
Open `portfolio/src/data/pricingData.ts` and `portfolio/src/data/servicesData.ts`:
- Adjust rates, deliverables, or turnaround estimates at any time.
