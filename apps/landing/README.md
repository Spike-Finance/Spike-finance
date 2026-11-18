# SPIKE — Marketing Landing Page

Official marketing landing page for **SPIKE** (*"Small drops make an ocean"*), Nigeria's modern automated micro-investing and financial services platform, designed with a clean, friendly PiggyVest-inspired layout.

## Design & Architecture
- **Framework:** Next.js (App Router, `app/page.tsx`) with strict TypeScript.
- **Styling:** Tailwind CSS (v4) mobile-first responsive design (`375px` to `1440px`).
- **Brand Identity:**
  - Official SPIKE Logo (Dark on light surfaces & Crisp White on dark surfaces) with the signature green spike on the 'K'.
  - Colors: Deep Emerald (`#0F766E`), Teal (`#059669`), Vibrant Spike Green (`#2cb42c`), Warm Amber (`#F59E0B`), and Deep Slate (`#0F172A`).
  - 3D Visuals: Photorealistic 3D Gold Naira Coin, 3D Translucent Frosted Glass Vault, 3D Obsidian Titanium Visa Card, and 3D Compounding Yield Growth chart.

## Page Layout (PiggyVest.com Structure)
1. **Navbar (`Navbar.tsx`):** Clean header with SPIKE logo, Save, Invest, Stories, FAQs, "Sign in", and "Create free account" primary button.
2. **Hero Section (`HeroSection.tsx` & `PhoneMockup.tsx`):**
   - Headline: *"The Better Way to Save & Invest Your Spare Change."*
   - Sub-headline and *"Claim your free ₦100 welcome bonus"* badge.
   - High-converting CTAs: *"Create free account"* + App Store & Google Play buttons.
   - Code-rendered phone mockup with 3D Naira coin floating, 3D Obsidian Titanium card toggle, live transaction feeds, Chicken Republic round-up toast, and auto-sweep progress pill.
3. **Security & Trust Strip (`TrustBar.tsx`):** Bank-grade 256-bit encryption, NDIC insured partner banks, SEC-regulated mutual funds, BVN identity protection.
4. **Offerings Section (`OfferingsSection.tsx`):**
   - *"5 ways to save, invest & grow with SPIKE"*:
     1. **Automated Round-Ups** (Spare change on autopilot via Mono, Paystack, Stitch with 3D Smart Vault).
     2. **SafeLock & Mutual Funds** (Up to 16.5% p.a. yield with automatic ₦5,000 sweep & 3D Yield Chart).
     3. **Target Vaults** (Goal-oriented savings with automated daily/weekly debits for rent, tuition, business).
     4. **Found Money Cashback** (1%–2% bonus invested across 350+ brands including MTN, Chowdeck, Glovo, DSTV with 3D Naira Coin).
     5. **Spike Flex & Instant Bills** (Dedicated NUBAN account, free @tag transfers, 2-tap airtime, data & power tokens with 3D Titanium Visa Card).
5. **How It Works (`HowItWorks.tsx`):** 3-step onboarding journey completed in under 3 minutes with instant BVN verification.
6. **Customer Stories (`CustomerStories.tsx`):** Real, authentic saver stories and testimonials from Lagos and Abuja.
7. **Security & FAQs (`SecurityAndFaq.tsx`):** Trust guarantee and 5 collapsible FAQ accordions.
8. **App Download Banner (`AppDownloadBanner.tsx`):** Callout banner inviting users to join 10,000+ Nigerians saving on SPIKE with their ₦100 welcome bonus.
9. **Footer (`Footer.tsx`):** 5-column footer with regulatory disclosures, legal terms, and store buttons.
10. **Interactive Modal (`DownloadModal.tsx`):** Direct QR code scan and Nigerian SMS download link (+234).

## Running Locally

```bash
# Start development server on port 3001
pnpm run dev:landing

# Production build via Turborepo
pnpm run build:landing
```
