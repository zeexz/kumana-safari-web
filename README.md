# 🦁 Kumana Safari Sri Lanka — Wings & Roars

[![Website](https://img.shields.io/badge/Website-gokumana.com-2ea44f?style=for-the-badge&logo=google-chrome&logoColor=white)](https://gokumana.com)
[![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=for-the-badge)](#)

Official website for **Kumana Wings & Roars**, premier private safari tour operators located at Okanda Gate, Kumana National Park (Yala East), Sri Lanka. Offering specialized leopard tracking, bird watching at Kumana Villu, and private 4x4 jeep safaris departing directly from Arugam Bay, Panama, and Pottuvil.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [SEO, Performance & Security](#seo-performance--security)
- [Getting Started (Local Development)](#getting-started-local-development)
- [Deployment](#deployment)
- [Customization Guide](#customization-guide)
- [Contact & Support](#contact--support)

---

## 🌿 Overview

**Kumana National Park** (historically known as *Yala East*) is renowned for its tranquil environment, thriving Sri Lankan leopard population, sloth bears, wild elephants, and world-famous wetland avifauna at Kumana Villu.

This website is a modern, high-converting, mobile-first static web application engineered to drive safari inquiries directly to the team via instant WhatsApp messaging and direct calling.

---

## ✨ Key Features

- **Hero & Trust Badges**: Compelling headline, authentic Google Reviews pill rating (★ 4.9 from 138+ reviews), and reassurance points (100% private 4x4, certified naturalist guides, door-to-door hotel transfers).
- **Interactive Safari Packages**:
  - **Half Day Safari (~4–5 hrs)**: Exploration of Kumana Villu swamp for bird watching and diverse wildlife.
  - **Full Day Safari (Dawn to Dusk / ~10–12 hrs)**: Deep wilderness tracking for leopards, elephants, and bears with packed breakfast and traditional Sri Lankan lunch.
- **Dynamic WhatsApp Booking Widget**:
  - Automatically restricts past dates.
  - Pre-fills customizable options (Date, Guests including 1–7 and 8+ group tours, Tour type, Hotel pickup area).
  - Interactive click suggestions and live typing feature for custom booking requests and special notes.
  - Encodes the user's booking choices and typed request notes into a structured WhatsApp message sent directly to reservations.
- **Filterable Wildlife Gallery & Lightbox**:
  - Category filters: Birds, Mammals, Landscape, Safari Jeeps.
  - Smooth fade and transition animations.
  - Fully keyboard-accessible Lightbox viewer with Next/Previous navigation and counter (`Esc`, `ArrowLeft`, `ArrowRight`).
- **Google Reviews Showcase**:
  - Real guest testimonials with reviewer photos, rating badges, and review date.
  - Interactive photo attachments opening high-res guest sighting photos in the modal lightbox.
- **Interactive FAQ Accordion**:
  - Answers to the most common guest questions (clothing, best seasons, child suitability, comparisons with Yala).
  - W3C ARIA compliant (`aria-expanded`, dynamic `max-height` transitions).
- **Mobile-Optimized Conversions**:
  - Floating WhatsApp action button.
  - Persistent sticky mobile CTA bar that smoothly appears when scrolling past the hero section.
  - Responsive hamburger drawer navigation with keyboard navigation.

---

## 🛠 Tech Stack

Built without unnecessary framework bloat for instantaneous load times and 100/100 Lighthouse performance:

- **HTML5**: Semantic tags, schema.org JSON-LD microdata, Open Graph & Twitter cards, accessibility tags.
- **Vanilla CSS3**:
  - CSS Custom Properties (Theme tokens: Forest Greens `#1A3626`, Ochre `#C27803`, Sand `#FAF8F5`).
  - Fluid typography (`clamp()`) and responsive grid/flexbox layouts.
  - Hardware-accelerated transitions and subtle micro-animations.
- **Vanilla JavaScript (ES6+)**:
  - Zero third-party runtime dependencies.
  - Intersection Observer / scroll-triggered reveal animations.
  - Modal lightbox state management with keyboard navigation.
  - Dynamic WhatsApp URL generator and form formatting.
- **Assets**:
  - Modern image delivery using `<picture>` with responsive WebP and JPEG fallbacks.
  - Google Fonts: *Playfair Display* (luxury editorial serif) & *Outfit* (clean modern geometric sans).

---

## 📂 Project Structure

```text
Kumana-Safari-main/
├── assets/
│   ├── favicon.svg               # Vector brand favicon
│   ├── favicon-16x16.png         # Legacy standard 16px favicon
│   ├── favicon-32x32.png         # Legacy standard 32px favicon
│   ├── apple-touch-icon.png      # iOS home-screen icon (180x180)
│   ├── icon-192.png              # PWA manifest web icon (192x192)
│   ├── icon-512.png              # PWA manifest web icon (512x512)
│   └── images/
│       ├── hero.webp / .png      # Main hero visual (responsive sizes: 400w, 800w, 1200w)
│       ├── leopard.webp / .png   # Full-day safari & wildlife imagery
│       ├── birds.webp / .png     # Half-day & bird watching imagery
│       ├── landscape.webp / .png # Park wetlands and scenic photography
│       ├── vehicle*.webp / .jpg  # Fleet photos (modified 4x4 safari jeeps)
│       └── real/                 # Authentic guest and review photos
├── index.html                    # Main landing page with full structured data & markup
├── style.css                     # Primary stylesheet containing complete design system
├── script.js                     # Core application logic, gallery lightbox, booking form
├── site.webmanifest              # Progressive Web App manifest
├── sitemap.xml                   # XML sitemap for search engines
├── robots.txt                    # Search crawler instructions
├── CNAME                         # Custom domain mapping (gokumana.com)
├── _headers                      # Security & caching headers (Cloudflare Pages / Netlify)
├── .htaccess                     # Apache server configuration & gzip/headers
└── README.md                     # Documentation
```

---

## 🔒 SEO, Performance & Security

### 1. Structured Data (JSON-LD)
Includes rich schema markup to improve search appearance:
- `TravelAgency`: Contact details, coordinates, opening hours, pricing tier.
- `OfferCatalog` & `TouristTrip`: Structured listings for Half Day and Full Day safaris.
- `FAQPage`: Rich snippet answers eligible for Google Search FAQ dropdowns.
- `AggregateRating`: Google Reviews score (4.9 / 5.0) and review count.

### 2. Security Headers
Both network-level `_headers` and `.htaccess` configure:
- **Content-Security-Policy (CSP)**: Blocks unauthorized external scripts, framing, and data injections.
- **HTTP Strict Transport Security (HSTS)**: Forces HTTPS with 1-year max-age and preload.
- **X-Frame-Options: DENY**: Protects against clickjacking.
- **X-Content-Type-Options: nosniff**: Prevents MIME-confusion attacks.
- **Referrer-Policy: strict-origin-when-cross-origin**.
- **Permissions-Policy**: Disables unnecessary browser APIs (camera, microphone, geolocation, usb).

### 3. Asset Caching
Static media, stylesheets, and scripts are aggressively cached (`max-age=31536000, immutable`), while `index.html` uses `no-cache, no-store, must-revalidate` to ensure immediate deployment updates.

---

## 🚀 Getting Started (Local Development)

Because the project is built with vanilla web technologies, no build step or `npm install` is required.

### Option 1: VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Click **"Go Live"** in the bottom status bar or right-click `index.html` → **"Open with Live Server"**.

### Option 2: Python HTTP Server
Run from your terminal in the project root:
```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Node.js `npx serve`
```bash
npx serve .
```

---

## 🌐 Deployment

### GitHub Pages
1. Push this repository to GitHub.
2. In your repository settings, go to **Pages**.
3. Under **Build and deployment**, select `Deploy from a branch` and choose `main` / `root`.
4. Ensure the `CNAME` file contains your custom domain:
   ```text
   gokumana.com
   ```
5. Configure your DNS provider:
   - **Apex (`@`)**: Point ALIAS / ANAME or `A` records to GitHub's IPs (`185.199.108.153`, etc.).
   - **Subdomain (`www`)**: Point `CNAME` to `<your-username>.github.io`.

### Cloudflare Pages / Netlify
- Drag-and-drop the directory or link to your Git repository.
- **Build command**: *(leave blank)*
- **Publish directory**: `.` or `/`
- The `_headers` file will automatically be applied for security and caching rules.

### Apache Web Server
- The provided `.htaccess` file provides preconfigured gzip compression, rewrite rules, and security headers.

---

## ⚙️ Customization Guide

| Item to Change | File | Search For |
| :--- | :--- | :--- |
| **WhatsApp Number** | `index.html`, `script.js` | `94716716802` |
| **Phone Number / Email** | `index.html` | `+94 71 671 6802` / `bookings@gokumana.com` |
| **Domain Name** | `CNAME`, `index.html`, `sitemap.xml` | `gokumana.com` |
| **Safari Pricing & Details** | `index.html` | Section `#safaris` (`.safari-card`) |
| **Gallery Photos** | `index.html`, `assets/images/` | Section `#gallery` (`.gallery-card`) |
| **Google Reviews** | `index.html` | Section `#reviews` (`.google-review-card`) |
| **Brand Colors / Styles** | `style.css` | `:root` CSS variables at the top of file |

---

## 📞 Contact & Support

- **Operator**: Kumana Wings & Roars
- **Location**: Okanda Gate, Kumana National Park, Panama / Arugam Bay, Sri Lanka
- **Website**: [gokumana.com](https://gokumana.com)
- **WhatsApp**: [+94 71 671 6802](https://wa.me/94716716802) / [+94 70 170 3228](https://wa.me/94701703228)

---
*© 2026 Kumana Wings & Roars. All rights reserved.*
