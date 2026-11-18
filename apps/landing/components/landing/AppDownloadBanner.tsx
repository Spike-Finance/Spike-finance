"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, ArrowRight, Apple, Smartphone, Clock } from "lucide-react";

interface AppDownloadBannerProps {
  onOpenWaitlistModal?: () => void;
}

export function AppDownloadBanner({ onOpenWaitlistModal }: AppDownloadBannerProps) {
  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-500/30 shadow-2xl overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>₦100 Free Welcome Bonus Reserved on Signup</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                Be the first to experience SPIKE when we launch
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                Join 10,000+ Nigerians on the waitlist. Get early access to automated spare change investing, high-yield vaults, and instant zero-fee transfers.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenWaitlistModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-base shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Join the Waitlist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Coming Soon Device Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-semibold">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Apple className="w-4 h-4 fill-current" />
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    Coming Soon to iOS & Android
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero spam • 256-bit encryption • NDIC insured partner banks</span>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-emerald-500/40 shadow-2xl animate-pulse [animation-duration:6s]">
                <Image
                  src="/images/spike-3d-coin.jpg"
                  alt="3D Gold Naira Coin"
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
