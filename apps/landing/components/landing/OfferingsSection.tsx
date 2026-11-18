"use client";

import React from "react";
import {
  ChevronRight,
  ChevronLeft,
  Info,
  Lock,
  Target,
  Sparkles,
  Zap,
  Home,
  Check,
} from "lucide-react";

interface OfferingsSectionProps {
  onOpenWaitlistModal?: () => void;
}

export function OfferingsSection({ onOpenWaitlistModal }: OfferingsSectionProps) {
  const cards = [
    {
      id: "automated",
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="7" r="3" fill="#2563EB" />
            <path d="M5 19C5 15.5 8 13 12 13C16 13 19 15.5 19 19" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
        </div>
      ),
      title: "Automated Savings",
      description: "Build a dedicated savings faster on your terms, automatically on every spend or manually.",
      linkText: "Join waitlist",
      phoneTheme: {
        bg: "bg-[#1B59F8]",
        text: "text-white",
        header: "PiggyBank",
        pill: "16% per annum",
        label: "Auto Round-Up Balance",
        amount: "₦720,842.31",
        footerPill: "RoundUp: Nearest ₦500 ✓",
      },
    },
    {
      id: "fixed",
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
          <Lock className="w-5 h-5 text-[#0089FF]" />
        </div>
      ),
      title: "Fixed Savings",
      description: "Lock money away for a fixed duration without having access to it until maturity.",
      linkText: "Join waitlist",
      phoneTheme: {
        bg: "bg-[#0584FE]",
        text: "text-white",
        header: "SafeLock Vault",
        pill: "15% – 19.5% p.a.",
        label: "Total Locked Savings",
        amount: "₦1,000,000.00",
        footerPill: "SEC Mutual Fund Sweep ✓",
      },
    },
    {
      id: "goal",
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Target className="w-5 h-5 text-[#059669]" />
        </div>
      ),
      title: "Goal-oriented Savings",
      description: "Save towards multiple goals on your own or with a group with automated daily debits.",
      linkText: "Join waitlist",
      phoneTheme: {
        bg: "bg-[#067A52]",
        text: "text-white",
        header: "Target Savings",
        pill: "🟡 16% per annum",
        label: "Target Balance",
        amount: "₦928,500.00",
        footerPill: "December Holiday Target ✓",
      },
    },
    {
      id: "cashback",
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#9333EA]" />
        </div>
      ),
      title: "Found Money Cashback",
      description: "Shop or recharge with 350+ partner brands and get 1% to 2% cash invested back into your vault.",
      linkText: "Join waitlist",
      phoneTheme: {
        bg: "bg-[#7E22CE]",
        text: "text-white",
        header: "Earn Cashback",
        pill: "1% – 2% Invested",
        label: "Cashback Invested",
        amount: "₦84,200.00",
        footerPill: "MTN • Chowdeck • Glovo ✓",
      },
    },
    {
      id: "flex",
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
          <Zap className="w-5 h-5 text-[#E11D48]" />
        </div>
      ),
      title: "Emergency & Flex Savings",
      description: "Dedicated virtual NUBAN wallet for emergency funds with free withdrawals and 2-tap bills.",
      linkText: "Join waitlist",
      phoneTheme: {
        bg: "bg-[#BE123C]",
        text: "text-white",
        header: "Flex Wallet",
        pill: "Zero-fee Transfers",
        label: "Emergency Balance",
        amount: "₦315,650.00",
        footerPill: "@jhonpatrick • Instant NIP ✓",
      },
    },
    {
      id: "rent",
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
          <Home className="w-5 h-5 text-[#EA580C]" />
        </div>
      ),
      title: "Rent Savings",
      description: "Plan and protect your rent payments in advance so landlord notices never catch you off guard.",
      linkText: "Join waitlist",
      phoneTheme: {
        bg: "bg-[#C2410C]",
        text: "text-white",
        header: "House Rent Vault",
        pill: "Locked till Dec 2026",
        label: "Rent Accumulated",
        amount: "₦1,250,000.00",
        footerPill: "Rent Target: 100% Achieved ✓",
      },
    },
  ];

  return (
    <section id="offerings" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PiggyVest Exact Header Style */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight mb-3">
            Diverse ways to save & invest
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Earn up to <strong className="text-slate-900 font-bold">16.5% interest per annum</strong> when you save with any of these SPIKE plans.
          </p>
        </div>

        {/* 6-Card Grid Matching PiggyVest Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card) => {
            const isFloatingCloud = card.id === "fixed";

            return (
              <div
                key={card.id}
                className="group rounded-[32px] bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-all duration-300 border border-slate-200/60 p-7 sm:p-8 pb-0 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md"
              >
                {/* Top Info Area */}
                <div>
                  {/* Colorful Icon */}
                  <div className="mb-4">
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2.5">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed mb-4 min-h-[44px]">
                    {card.description}
                  </p>

                  {/* Action Link */}
                  <button
                    type="button"
                    onClick={onOpenWaitlistModal}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors mb-7 cursor-pointer"
                  >
                    <span>{card.linkText}</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                {/* Bottom UI Frame (Exact PiggyVest Phone Mockup / Cloud Visual) */}
                <div className="h-56 sm:h-60 w-full flex items-end justify-center overflow-hidden pt-2">
                  {isFloatingCloud ? (
                    /* Fixed Savings Cloud Visual (Matching Screenshot Card 2) */
                    <div className="relative w-full h-full flex flex-col items-center justify-end">
                      {/* Floating Cloud Graphic Backdrop */}
                      <div className="absolute inset-x-0 bottom-0 h-40 flex items-end justify-center pointer-events-none opacity-40">
                        <svg viewBox="0 0 300 120" className="w-full h-full text-slate-300 fill-current">
                          <circle cx="50" cy="90" r="35" />
                          <circle cx="100" cy="80" r="45" />
                          <circle cx="160" cy="75" r="50" />
                          <circle cx="220" cy="80" r="45" />
                          <circle cx="265" cy="95" r="30" />
                        </svg>
                      </div>

                      {/* Floating Card */}
                      <div className={`relative z-10 w-[88%] rounded-2xl p-4 shadow-xl mb-6 text-white ${card.phoneTheme.bg} transition-transform duration-300 group-hover:-translate-y-2`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-white">
                            {card.phoneTheme.pill}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <Lock className="w-3 h-3 text-white" />
                          </div>
                        </div>

                        <p className="text-[10px] text-white/80 font-medium">{card.phoneTheme.label}</p>
                        <p className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
                          {card.phoneTheme.amount}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* App Screen Mockup Top Frame (Matching Screenshot Cards 1 & 3) */
                    <div
                      className={`w-[90%] sm:w-[86%] h-full rounded-t-[28px] border-[3px] border-b-0 border-slate-800 shadow-2xl p-3 sm:p-3.5 flex flex-col justify-between text-white ${card.phoneTheme.bg} transition-transform duration-300 group-hover:-translate-y-2`}
                    >
                      {/* App Header Inside Frame */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold pb-2 border-b border-white/15 mb-3">
                          <ChevronLeft className="w-4 h-4 cursor-pointer" />
                          <span className="tracking-wide">{card.phoneTheme.header}</span>
                          <Info className="w-3.5 h-3.5 opacity-80" />
                        </div>

                        {/* Interest Badge */}
                        <div className="text-center mb-2">
                          <span className="inline-block text-[10px] font-bold bg-white/15 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                            {card.phoneTheme.pill}
                          </span>
                        </div>

                        {/* Balance Content */}
                        <div className="text-center">
                          <p className="text-[10px] text-white/80 font-medium">
                            {card.phoneTheme.label}
                          </p>
                          <p className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                            {card.phoneTheme.amount}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Micro Pill */}
                      <div className="mt-auto pt-2">
                        <div className="bg-white/15 backdrop-blur-xs rounded-xl py-1 px-2 text-center text-[9px] font-semibold text-white/95 truncate">
                          {card.phoneTheme.footerPill}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
