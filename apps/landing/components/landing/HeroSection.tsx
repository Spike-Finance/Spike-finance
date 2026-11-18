"use client";

import React from "react";
import { Hero3DShowcase } from "./Hero3DShowcase";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Apple,
  Star,
  Smartphone,
} from "lucide-react";

interface HeroSectionProps {
  onOpenDownloadModal?: () => void;
}

export function HeroSection({ onOpenDownloadModal }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute top-24 right-1/4 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Clean PiggyVest-style Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* ₦100 Bonus Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm font-semibold mb-6 shadow-2xs hover:bg-emerald-100/80 transition-colors cursor-default">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2cb42c]" />
              </span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Claim your free ₦100 welcome bonus in under 3 minutes</span>
            </div>

            {/* Main Headline (PiggyVest Inspired) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
              The Better Way to Save & Invest Your Spare Change.
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mb-8">
              SPIKE helps thousands of Nigerians save and invest effortlessly. Automated round-ups, high-yield mutual funds, instant zero-fee transfers, and cashback on everyday spending.
            </p>

            {/* Primary Action Button & App Store Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-10">
              <button
                type="button"
                onClick={onOpenDownloadModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 cursor-pointer"
              >
                <span>Create free account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onOpenDownloadModal}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-slate-300 hover:border-slate-800 text-slate-800 hover:text-black font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Apple className="w-4 h-4 fill-current" />
                  <span>App Store</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenDownloadModal}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-slate-300 hover:border-slate-800 text-slate-800 hover:text-black font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Google Play</span>
                </button>
              </div>
            </div>

            {/* PiggyVest-style Social Trust Strip */}
            <div className="pt-6 border-t border-slate-200 w-full flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-slate-800">4.9/5 from 10,000+ ratings</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bank-grade 256-bit encryption</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>NDIC insured partner banks</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Asset Showcase with Gold Coin, Obsidian Card & Smart Vault */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Hero3DShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
