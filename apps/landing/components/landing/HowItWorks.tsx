"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Lock,
  ArrowUpRight,
  UtensilsCrossed,
  Smartphone,
  Car,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface HowItWorksProps {
  onOpenWaitlistModal?: () => void;
}

export function HowItWorks({ onOpenWaitlistModal }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#070D18] text-white relative overflow-hidden">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (Matching PiggyVest Top Style) */}
        <div className="max-w-3xl mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2">
            How SPIKE Works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
            Simple, automated wealth building for everyone
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            SPIKE offers automated spare change round-ups and pre-vetted, SEC-regulated mutual fund opportunities with yields of up to 16.5% p.a.
          </p>
        </div>

        {/* 3 Large Showcase Cards (Matching Uploaded Screenshot 1:1) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ================= CARD 1: VIBRANT PURPLE ================= */}
          <div className="flex flex-col">
            {/* Visual Box */}
            <div className="aspect-[1/1] sm:aspect-[0.95/1] rounded-[32px] bg-[#6B21A8] p-5 sm:p-6 flex flex-col justify-center space-y-3 shadow-xl overflow-hidden relative group">
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

              {/* Stacked White Card 1 */}
              <div className="bg-white rounded-2xl p-3 shadow-md flex items-center gap-3 transition-transform duration-300 group-hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-6 h-6 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">Chicken Republic order</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">16.5% Return in 6 months</p>
                  <div className="flex items-center justify-between text-[11px] mt-0.5">
                    <span className="font-extrabold text-slate-900">₦2,600 spent</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">+₦400 saved</span>
                  </div>
                </div>
              </div>

              {/* Stacked White Card 2 */}
              <div className="bg-white rounded-2xl p-3 shadow-md flex items-center gap-3 transition-transform duration-300 group-hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">MTN Data recharge</p>
                  <p className="text-[10px] text-purple-600 font-semibold">Found Money 2% Cashback</p>
                  <div className="flex items-center justify-between text-[11px] mt-0.5">
                    <span className="font-extrabold text-slate-900">₦5,000 unit</span>
                    <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">+₦100 bonus</span>
                  </div>
                </div>
              </div>

              {/* Stacked White Card 3 */}
              <div className="bg-white rounded-2xl p-3 shadow-md flex items-center gap-3 transition-transform duration-300 group-hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Car className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">Bolt ride to Ikeja</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Nearest ₦500 rule</p>
                  <div className="flex items-center justify-between text-[11px] mt-0.5">
                    <span className="font-extrabold text-slate-900">₦4,200 spent</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">+₦300 saved</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Content Under Card 1 */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-2">
                Flexible round-up options
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Choose from a variety of round-up tiers (nearest ₦100 to ₦1,000) designed to fit your spending habits, whether you prefer gradual micro-drops or fast capital buildup.
              </p>
            </div>
          </div>

          {/* ================= CARD 2: MINT SAGE GREEN ================= */}
          <div className="flex flex-col">
            {/* Visual Box */}
            <div className="aspect-[1/1] sm:aspect-[0.95/1] rounded-[32px] bg-[#D1F7E5] p-6 flex flex-col items-center justify-center shadow-xl overflow-hidden relative group">
              {/* Center Wavy Bush / Cloud Graphic */}
              <div className="w-full flex items-center justify-center relative">
                {/* Wavy Lime Green Cloud Silhouette */}
                <div className="flex items-center justify-center gap-1 opacity-90 scale-110">
                  <div className="w-10 h-10 rounded-full bg-[#86EFAC] -mr-3" />
                  <div className="w-14 h-14 rounded-full bg-[#4ADE80] -mr-3" />
                  <div className="w-20 h-20 rounded-full bg-[#22C55E]" />
                  <div className="w-16 h-16 rounded-full bg-[#4ADE80] -ml-4" />
                  <div className="w-12 h-12 rounded-full bg-[#86EFAC] -ml-3" />
                </div>

                {/* Floating Dark Emerald Badge in Center */}
                <div className="absolute z-10 bg-[#065F46] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/40 transition-transform duration-300 group-hover:scale-105">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                        16.50%
                      </span>
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                        ▲
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-200/90 font-semibold tracking-wide uppercase mt-1">
                      Annual Yield
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Content Under Card 2 */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-2">
                Competitive returns
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Benefit from high-yield SEC-regulated money market mutual funds that maximize your returns, helping you beat Nigerian inflation and reach your financial goals faster.
              </p>
            </div>
          </div>

          {/* ================= CARD 3: WARM AMBER GOLD ================= */}
          <div className="flex flex-col">
            {/* Visual Box */}
            <div className="aspect-[1/1] sm:aspect-[0.95/1] rounded-[32px] bg-[#F59E0B] p-5 sm:p-6 flex flex-col justify-end shadow-xl overflow-hidden relative group">
              {/* White In-App Mockup Frame (Sliding Up from Bottom) */}
              <div className="w-full bg-white rounded-t-3xl pt-3.5 px-4 pb-4 shadow-2xl text-slate-900 transition-transform duration-300 group-hover:-translate-y-2">
                {/* Header with Back Chevron */}
                <div className="flex items-center justify-between pb-2 mb-2 text-slate-600 text-xs">
                  <ChevronLeft className="w-4 h-4 cursor-pointer" />
                  <span className="font-bold text-slate-900">Mutual Fund Sweep</span>
                  <div className="w-4" />
                </div>

                {/* Blue Decorative Card with Padlock */}
                <div className="rounded-xl p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center mb-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-emerald-700 font-bold mb-1">
                  <span>SEC-Regulated Opportunity</span>
                  <span className="text-emerald-600">✓ Verified</span>
                </div>

                <h4 className="text-xs font-black text-slate-900 leading-tight">
                  MONEY MARKET MUTUAL FUND
                </h4>
                <p className="text-[10px] text-slate-500 mb-2.5">
                  Managed by Certified Trustees
                </p>

                {/* Invest CTA Button */}
                <button
                  type="button"
                  onClick={onOpenWaitlistModal}
                  className="w-full py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Auto-Sweep ₦5,000
                </button>

                <p className="text-[9px] text-slate-400 text-center mt-2">
                  Daily interest compounding • Zero lock-in penalty
                </p>
              </div>
            </div>

            {/* Bottom Content Under Card 3 */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-2">
                Expertly curated investments
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Save and invest in institutional money market portfolios managed by registered Nigerian asset managers to optimize your returns with minimal capital risk.
              </p>
            </div>
          </div>
        </div>

        {/* Section Bottom Waitlist CTA */}
        <div className="mt-14 pt-8 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onOpenWaitlistModal}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>Join the Waitlist & Claim ₦100</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
