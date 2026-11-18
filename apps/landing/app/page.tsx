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
import { WaitlistModal } from "@/components/landing/WaitlistModal";

export default function LandingPage() {
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);

  const handleOpenWaitlist = () => {
    setWaitlistModalOpen(true);
  };

  const handleCloseWaitlist = () => {
    setWaitlistModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Sticky Navigation Bar */}
      <Navbar onOpenWaitlistModal={handleOpenWaitlist} />

      <main className="flex-1">
        {/* 2. Hero Section (PiggyVest Layout with 3D Assets & Waitlist CTA) */}
        <HeroSection onOpenWaitlistModal={handleOpenWaitlist} />

        {/* 3. Security & Trust Strip */}
        <TrustBar />

        {/* 4. Core Offerings: 5 Ways to Save, Invest & Grow */}
        <OfferingsSection onOpenWaitlistModal={handleOpenWaitlist} />

        {/* 5. How It Works — Fast 3-Step Journey */}
        <HowItWorks onOpenWaitlistModal={handleOpenWaitlist} />

        {/* 6. Customer Stories / Savers of the Month */}
        {/* <CustomerStories /> */}

        {/* 7. Security Trust & Frequently Asked Questions */}
        <SecurityAndFaq />

        {/* 8. Waitlist Banner Callout */}
        <AppDownloadBanner onOpenWaitlistModal={handleOpenWaitlist} />
      </main>

      {/* 9. Official Footer */}
      <Footer onOpenWaitlistModal={handleOpenWaitlist} />

      {/* Interactive Waitlist Modal (First Name, Last Name, Email, Phone) */}
      <WaitlistModal
        isOpen={waitlistModalOpen}
        onClose={handleCloseWaitlist}
      />
    </div>
  );
}
