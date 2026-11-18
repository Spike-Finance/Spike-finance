"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  UtensilsCrossed,
  Layers,
  Lock,
} from "lucide-react";

export function Hero3DShowcase() {
  const [activeAsset, setActiveAsset] = useState<"card" | "vault" | "growth">("card");

  return (
    <div className="relative w-full max-w-[440px] lg:max-w-[480px] mx-auto select-none">
      {/* Background Ambient Radial Glows */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-500/25 via-[#2cb42c]/20 to-teal-400/15 blur-3xl rounded-full opacity-90 pointer-events-none" />

      {/* Floating 3D Gold Naira Coin (Top Right) */}
      <div className="absolute -top-8 -right-4 sm:-right-8 z-30 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none animate-bounce [animation-duration:5s] drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]">
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-400/40 shadow-2xl">
          <Image
            src="/images/spike-3d-coin.jpg"
            alt="3D Gold Naira Coin"
            width={120}
            height={120}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>

      {/* Floating Toast: You saved ₦200 at Chicken Republic (Top Left) */}
      <div className="absolute -top-5 -left-4 sm:-left-8 z-30 bg-white/95 backdrop-blur-md border border-emerald-100 shadow-xl rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 animate-bounce [animation-duration:4s] max-w-[250px] sm:max-w-[270px]">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
          <UtensilsCrossed className="w-5 h-5 text-amber-600" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
              Round-Up Saved
            </span>
            <span className="text-[10px] text-slate-400">Just now</span>
          </div>
          <p className="text-xs font-semibold text-slate-900 truncate">
            You saved <span className="text-emerald-600 font-bold">₦200</span> at Chicken Republic
          </p>
        </div>
      </div>

      {/* Floating Badge: ₦100 Welcome Bonus (Bottom Right) */}
      <div className="absolute -bottom-6 -right-4 sm:-right-6 z-30 bg-slate-950/95 backdrop-blur-md border border-emerald-500/30 shadow-2xl rounded-2xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">₦100 Welcome Bonus</p>
          <p className="text-[11px] text-emerald-400 font-medium">Credited to Wallet ✓</p>
        </div>
      </div>

      {/* Floating Badge: +16.5% Annual Return (Bottom Left) */}
      <div className="absolute -bottom-5 -left-4 sm:-left-6 z-30 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-3 flex items-center gap-2.5 hidden sm:flex">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-900">+16.5% Compounding</p>
          <p className="text-[10px] text-slate-500">SEC-Regulated Mutual Funds</p>
        </div>
      </div>

      {/* Central 3D Showcase Frame */}
      <div className="relative rounded-[36px] p-4 sm:p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 shadow-[0_25px_60px_-15px_rgba(15,118,110,0.4),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
        {/* Top 3D Asset Switcher Pills */}
        <div className="flex p-1 bg-slate-900/90 rounded-2xl mb-4 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveAsset("card")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeAsset === "card"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Spike Card</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAsset("vault")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeAsset === "vault"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>3D Smart Vault</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAsset("growth")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeAsset === "growth"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>3D Yield Growth</span>
          </button>
        </div>

        {/* 3D Asset Display Canvas */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/30 shadow-inner group">
          {activeAsset === "card" && (
            <div className="relative w-full h-full animate-in fade-in zoom-in-95 duration-300">
              <Image
                src="/images/spike-3d-card.jpg"
                alt="3D Obsidian Titanium Spike Visa Card"
                width={500}
                height={375}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-emerald-300 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <span className="font-mono">Obsidian Titanium • Visa Debit</span>
                <span className="font-bold text-emerald-400">Zero Maintenance</span>
              </div>
            </div>
          )}

          {activeAsset === "vault" && (
            <div className="relative w-full h-full animate-in fade-in zoom-in-95 duration-300">
              <Image
                src="/images/spike-3d-vault.jpg"
                alt="3D Frosted Glass Smart Vault"
                width={500}
                height={375}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-emerald-300 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <span>Biometric Frosted Glass Vault</span>
                <span className="font-bold text-emerald-400">Auto-Sweep ₦5k</span>
              </div>
            </div>
          )}

          {activeAsset === "growth" && (
            <div className="relative w-full h-full animate-in fade-in zoom-in-95 duration-300">
              <Image
                src="/images/spike-3d-growth.jpg"
                alt="3D Compounding Yield Growth"
                width={500}
                height={375}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-emerald-300 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <span>Daily Compounding Pedestals</span>
                <span className="font-bold text-emerald-400">+16.5% Annual APY</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sub-Strip */}
        <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            NDIC Insured Partner Banks
          </span>
          <span>Open Banking via Mono • Paystack • Stitch</span>
        </div>
      </div>
    </div>
  );
}
