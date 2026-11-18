"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Coins,
  CalendarClock,
  TrendingUp,
  Gift,
  ArrowRightLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

interface OfferingsSectionProps {
  onOpenDownloadModal?: () => void;
}

export function OfferingsSection({ onOpenDownloadModal }: OfferingsSectionProps) {
  const [selectedOffer, setSelectedOffer] = useState<string>("roundups");

  const offerings = [
    {
      id: "roundups",
      badge: "SPARE CHANGE ON AUTOPILOT",
      title: "Automated Round-Ups",
      subtitle: "Save quietly every time you spend",
      description:
        "Every card spend or bank transfer rounds up quietly in the background. Link your account via Mono, Paystack, or Stitch. Every food order, Uber ride, or supermarket spend rounds up into your savings vault without disrupting your day-to-day lifestyle.",
      perks: [
        "Round up to nearest ₦100, ₦500, or ₦1,000",
        "Works seamlessly across all Nigerian bank cards",
        "Pause, resume, or approve round-ups with one tap",
      ],
      linkText: "Start Automated Round-Ups",
      colorTheme: {
        cardBg: "bg-emerald-50/50 hover:bg-emerald-50/80",
        border: "border-emerald-200/80",
        badgeBg: "bg-emerald-100 text-emerald-800",
        btnBg: "bg-emerald-700 hover:bg-emerald-800 text-white",
        accent: "text-emerald-700",
      },
      image3d: "/images/spike-3d-vault.jpg",
      imageCaption: "3D Frosted Glass Smart Vault",
    },
    {
      id: "safelock",
      badge: "UP TO 16.5% P.A. YIELD",
      title: "SafeLock & Mutual Funds",
      subtitle: "Automatic sweeps into high-interest funds",
      description:
        "Put discipline on autopilot and watch your money grow. Once your accumulated spare change reaches ₦5,000, our system automatically sweeps it into SEC-regulated Money Market Mutual Funds, earning daily compounding interest.",
      perks: [
        "Automatic ₦5,000 threshold sweeps",
        "Up to 16.5% per annum compounding yields",
        "Managed by SEC-regulated institutional trustees",
      ],
      linkText: "Lock Funds & Earn Yield",
      colorTheme: {
        cardBg: "bg-amber-50/50 hover:bg-amber-50/80",
        border: "border-amber-200/80",
        badgeBg: "bg-amber-100 text-amber-900",
        btnBg: "bg-amber-600 hover:bg-amber-700 text-white",
        accent: "text-amber-800",
      },
      image3d: "/images/spike-3d-growth.jpg",
      imageCaption: "3D Compounding Yield Growth",
    },
    {
      id: "targets",
      badge: "GOAL-ORIENTED DISCIPLINE",
      title: "Target Vaults",
      subtitle: "Save towards what truly matters",
      description:
        "Reach multiple savings targets with automated discipline. Schedule daily debits (e.g., ₦1,000/day) or weekly pledges (₦5,000/week) toward rent, tuition, car maintenance, or your December holiday fund.",
      perks: [
        "Customize your target amount & deadline",
        "Automated daily, weekly, or monthly auto-debits",
        "Withdraw with zero lock-in penalties on target completion",
      ],
      linkText: "Set Up a Target Vault",
      colorTheme: {
        cardBg: "bg-blue-50/50 hover:bg-blue-50/80",
        border: "border-blue-200/80",
        badgeBg: "bg-blue-100 text-blue-900",
        btnBg: "bg-blue-600 hover:bg-blue-700 text-white",
        accent: "text-blue-800",
      },
      image3d: "/images/spike-3d-coin.jpg",
      imageCaption: "3D Goal Achievement Coins",
    },
    {
      id: "earn",
      badge: "SPEND & GET REWARDED",
      title: "Found Money Cashback",
      subtitle: "Free money invested as you shop",
      description:
        "Shop or pay across 350+ partner brands—including MTN, Glovo, Chowdeck, DSTV, Airtel, and Bolt—and receive 1% to 2% of your spend invested directly into your savings vault as a free bonus.",
      perks: [
        "1%–2% instant bonus credited straight to savings",
        "Over 350+ top Nigerian partner brands",
        "No coupons or promo codes needed—strictly automatic",
      ],
      linkText: "Explore Partner Brands",
      colorTheme: {
        cardBg: "bg-purple-50/50 hover:bg-purple-50/80",
        border: "border-purple-200/80",
        badgeBg: "bg-purple-100 text-purple-900",
        btnBg: "bg-purple-600 hover:bg-purple-700 text-white",
        accent: "text-purple-800",
      },
      image3d: "/images/spike-3d-coin.jpg",
      imageCaption: "3D Nigerian Naira Coin",
    },
    {
      id: "flex",
      badge: "FREE TRANSFERS & 2-TAP BILLS",
      title: "Spike Flex & Instant Bills",
      subtitle: "A modern virtual account for everyday life",
      description:
        "Get your own dedicated Nigerian NUBAN virtual account for instant funding. Send zero-fee peer-to-peer transfers via @tag, and buy airtime, data, Cable TV, and electricity tokens in 2 taps.",
      perks: [
        "Instant dedicated NUBAN account in your name",
        "Free instant transfers to friends using @tag",
        "Immediate meter token & airtime pin delivery",
      ],
      linkText: "Get Your Spike Virtual Account",
      colorTheme: {
        cardBg: "bg-teal-50/50 hover:bg-teal-50/80",
        border: "border-teal-200/80",
        badgeBg: "bg-teal-100 text-teal-900",
        btnBg: "bg-teal-700 hover:bg-teal-800 text-white",
        accent: "text-teal-800",
      },
      image3d: "/images/spike-3d-card.jpg",
      imageCaption: "3D Obsidian Titanium Visa Card",
    },
  ];

  return (
    <section id="offerings" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PiggyVest-inspired Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 mb-3">
            5 Ways to Build Your Wealth
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Diverse ways to save, invest & grow
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Earn up to <strong className="text-emerald-700">16.5% p.a.</strong> effortlessly. Choose one offering or combine all five to reach your financial goals faster.
          </p>
        </div>

        {/* 5 Offering Cards (PiggyVest Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((item, index) => {
            const isWide = index === 0 || index === 1; // Top two featured offerings
            return (
              <div
                key={item.id}
                className={`rounded-3xl p-7 sm:p-8 border transition-all duration-300 flex flex-col justify-between group hover:shadow-lg ${
                  item.colorTheme.cardBg
                } ${item.colorTheme.border} ${
                  isWide ? "lg:col-span-1" : "lg:col-span-1"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${item.colorTheme.badgeBg}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500 mb-4">
                    {item.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* 3D Asset Preview Box */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs mb-6 bg-slate-950">
                    <Image
                      src={item.image3d}
                      alt={item.title}
                      width={400}
                      height={240}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-white/90 font-medium bg-slate-950/75 backdrop-blur-xs py-1 rounded-lg">
                      {item.imageCaption}
                    </div>
                  </div>

                  {/* Perks Checklist */}
                  <ul className="space-y-2 mb-6">
                    {item.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${item.colorTheme.accent}`} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow Action Link */}
                <div className="pt-4 border-t border-slate-200/70">
                  <button
                    type="button"
                    onClick={onOpenDownloadModal}
                    className={`inline-flex items-center gap-2 text-sm font-bold transition-all group-hover:translate-x-1 cursor-pointer ${item.colorTheme.accent}`}
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
