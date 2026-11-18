"use client";

import React from "react";
import Image from "next/image";
import { Apple, Smartphone, Sparkles, ShieldCheck } from "lucide-react";

interface AppDownloadBannerProps {
  onOpenDownloadModal?: () => void;
}

export function AppDownloadBanner({ onOpenDownloadModal }: AppDownloadBannerProps) {
  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-500/30 shadow-2xl overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>₦100 Free Welcome Bonus on Signup</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                Join thousands of Nigerians saving with SPIKE today
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                Download the app, complete quick BVN verification in 60 seconds, and let your daily spare change build your future.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenDownloadModal}
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  <Apple className="w-5 h-5 fill-current" />
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-500">
                      Download on
                    </span>
                    <span className="block text-sm font-extrabold leading-tight">App Store</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onOpenDownloadModal}
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-emerald-200" />
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-emerald-200">
                      Get it on
                    </span>
                    <span className="block text-sm font-extrabold leading-tight">Google Play</span>
                  </div>
                </button>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero maintenance charges • NDIC insured partner banks</span>
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
