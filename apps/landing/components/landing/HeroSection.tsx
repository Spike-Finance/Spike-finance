"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Apple,
  Smartphone,
  Home,
  Target,
  Percent,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface HeroSectionProps {
  onOpenWaitlistModal?: () => void;
}

export function HeroSection({ onOpenWaitlistModal }: HeroSectionProps) {
  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= TOP ROW: SPLIT HEADER (MATCHING SCREENSHOT) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 lg:mb-14">
          {/* Left: Giant Bold Headline with Playful Sparkle Glyph */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black text-slate-900 tracking-tight leading-[1.06]">
              The better way{" "}
              <span className="inline-flex items-center justify-center align-middle mx-1">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-emerald-500 inline-block animate-spin [animation-duration:14s]"
                >
                  <path
                    d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z"
                    fill="#10B981"
                  />
                  <circle cx="12" cy="12" r="3" fill="#047857" />
                </svg>
              </span>{" "}
              to save and invest.
            </h1>
          </div>

          {/* Right: Subtitle & Waitlist / App Badges (Matching Screenshot) */}
          <div className="lg:col-span-5 flex flex-col items-start lg:pl-4">
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-normal">
              SPIKE helps thousands of Nigerians achieve their financial goals by helping them save and invest their spare change with ease.
            </p>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

              {/* iPhone Badge */}
              <div
                onClick={onOpenWaitlistModal}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-black text-xs font-bold shadow-xs cursor-pointer hover:bg-blue-700 transition-colors  border border-slate-200 "
              >
                <Apple className="w-4 h-4 fill-current" />
                <span>Get on iPhone <span className="text-[10px] text-blue-200 font-normal ml-0.5">(Soon)</span></span>
              </div>

              {/* Android Badge */}
              <div
                onClick={onOpenWaitlistModal}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Get on Android <span className="text-[10px] text-slate-400 font-normal ml-0.5">(Soon)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN HERO BANNER VISUAL (MATCHING SCREENSHOT) ================= */}
        <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 aspect-[16/10] sm:aspect-[16/9] max-h-[580px] w-full">
          {/* Main Authentic Lifestyle Photograph */}
          <Image
            src="/images/spike-hero-lifestyle.jpg"
            alt="Young Nigerian friends saving with SPIKE in the park"
            fill
            priority
            className="object-cover object-[center_28%]"
          />

          {/* Subtle Gradient Overlays for Floating Card Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/15 pointer-events-none" />

          {/* ================= FLOATING CHIP 1: My House Rent (Left) ================= */}
          <div className="absolute top-[28%] sm:top-[38%] left-3 sm:left-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce [animation-duration:5s] hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                My House Rent
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Target Vault
              </p>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 ml-2 sm:ml-4">
              + ₦80,000
            </span>
          </div>

          {/* ================= FLOATING CHIP 2: Group trip to Cape Verde (Bottom Center) ================= */}
          <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-100 flex items-center gap-3 hover:scale-105 transition-transform duration-200 cursor-pointer max-w-[90%] sm:max-w-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate">
                Group trip to Cape Verde
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Target Savings
              </p>
            </div>
            <span className="text-xs sm:text-sm font-black text-emerald-700 ml-2 sm:ml-4 shrink-0">
              + ₦15,000
            </span>
          </div>

          {/* ================= FLOATING CHIP 3: Interest for July (Right) ================= */}
          <div className="absolute top-[32%] sm:top-[42%] right-3 sm:right-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce [animation-duration:6s] hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0 font-bold">
              <Percent className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Interest for July
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Mutual Fund Sweep
              </p>
            </div>
            <span className="text-xs sm:text-sm font-black text-blue-600 ml-2 sm:ml-4">
              + ₦305,000
            </span>
          </div>

          {/* ================= FLOATING CHIP 4: Chicken Republic Round-Up (Top Right - Little Difference) ================= */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-12 z-20 bg-slate-950/90 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-xl border border-emerald-500/30 hidden sm:flex items-center gap-2.5 text-white">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400/50 shadow-xs shrink-0">
              <Image
                src="/images/spike-3d-coin.jpg"
                alt="3D Naira Coin"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">
                Chicken Republic Round-Up
              </p>
              <p className="text-[9px] text-emerald-400 leading-tight">
                Spare Change Saved
              </p>
            </div>
            <span className="text-xs font-black text-emerald-400 ml-2">
              + ₦400
            </span>
          </div>

          {/* ================= FLOATING CHIP 5: ₦100 Welcome Bonus (Top Left - Little Difference) ================= */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-12 z-20 bg-emerald-950/90 backdrop-blur-md rounded-full px-3.5 py-1.5 shadow-xl border border-emerald-500/40 hidden sm:flex items-center gap-2 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-emerald-200">
              ₦100 Bonus Reserved
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
