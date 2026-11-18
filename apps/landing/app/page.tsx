"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { OfferingsSection } from "@/components/landing/OfferingsSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CustomerStories } from "@/components/landing/CustomerStories";
import { SecurityAndFaq } from "@/components/landing/SecurityAndFaq";
import { AppDownloadBanner } from "@/components/landing/AppDownloadBanner";
import { Footer } from "@/components/landing/Footer";
import { DownloadModal } from "@/components/landing/DownloadModal";

export default function LandingPage() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const handleOpenDownload = () => {
    setDownloadModalOpen(true);
  };

  const handleCloseDownload = () => {
    setDownloadModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Sticky Navigation Bar */}
      <Navbar onOpenDownloadModal={handleOpenDownload} />

      <main className="flex-1">
        {/* 2. Hero Section (PiggyVest Layout with 3D Coin & Phone Mockup) */}
        <HeroSection onOpenDownloadModal={handleOpenDownload} />

        {/* 3. Security & Trust Strip */}
        <TrustBar />

        {/* 4. Core Offerings: 5 Ways to Save, Invest & Grow */}
        <OfferingsSection onOpenDownloadModal={handleOpenDownload} />

        {/* 5. How It Works — Fast 3-Step Journey */}
        <HowItWorks />

        {/* 6. Customer Stories / Savers of the Month */}
        <CustomerStories />

        {/* 7. Security Trust & Frequently Asked Questions */}
        <SecurityAndFaq />

        {/* 8. App Download Banner Callout */}
        <AppDownloadBanner onOpenDownloadModal={handleOpenDownload} />
      </main>

      {/* 9. Official Footer */}
      <Footer onOpenDownloadModal={handleOpenDownload} />

      {/* Interactive Download Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={handleCloseDownload}
      />
    </div>
  );
}
