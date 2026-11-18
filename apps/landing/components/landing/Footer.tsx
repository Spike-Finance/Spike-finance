import React from "react";
import { SpikeLogo } from "./SpikeLogo";
import { ShieldCheck, Heart, ArrowRight, Apple, Smartphone, Clock } from "lucide-react";

interface FooterProps {
  onOpenWaitlistModal?: () => void;
}

export function Footer({ onOpenWaitlistModal }: FooterProps) {
  return (
    <footer id="waitlist" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pre-Footer Call to Action Banner (Waitlist Focus) */}
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 border border-emerald-500/30 overflow-hidden shadow-2xl mb-16">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-600/50 mb-4">
              Launching Soon in Nigeria
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Small drops make an ocean. Start your journey with SPIKE.
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
              Reserve your spot on the waitlist today and lock in your free ₦100 welcome bonus for launch day.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenWaitlistModal}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <span>Join the Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <Apple className="w-4 h-4 fill-current text-slate-300" />
                  <Smartphone className="w-4 h-4 text-slate-300" />
                </div>
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Coming Soon to iOS & Android
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2">
            <SpikeLogo variant="light" size="lg" showTagline={true} />
            <p className="text-slate-400 text-sm leading-relaxed mt-4 max-w-sm">
              SPIKE is Nigeria’s consumer automated micro-investing platform. We turn your daily spare change and recurring habits into long-term financial security.
            </p>

            <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Registered under Nigerian Financial Services Laws</span>
            </div>
          </div>

          {/* Col 3: Automated Savings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Save & Invest
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  Automated Round-Ups
                </a>
              </li>
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  Target Vaults
                </a>
              </li>
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  SafeLock High-Yield
                </a>
              </li>
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  Found Money Cashback
                </a>
              </li>
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  ₦5,000 Mutual Fund Sweep
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Everyday Finance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Everyday Finance
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  Found Money Cashback
                </a>
              </li>
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  Virtual NUBAN Accounts
                </a>
              </li>
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  Zero-Fee @tag Transfers
                </a>
              </li>
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  2-Tap Airtime & Data
                </a>
              </li>
              <li>
                <a href="#offerings" className="hover:text-emerald-400 transition-colors">
                  Electricity & Cable TV
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Safety & Security
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Bank-Grade Encryption
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  NDIC Partner Insurance
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  SEC Asset Managers
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy & NDPR
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclosures & Copyright */}
        <div className="pt-8 text-xs text-slate-500 leading-relaxed space-y-3">
          <p>
            <strong>Regulatory Disclosure:</strong> Spike Technologies Limited operates in partnership with licensed Nigerian Deposit Money Banks (DMBs), Open Banking aggregators (Mono, Paystack, Stitch), and SEC-registered Asset Management institutions. Banking services and virtual accounts are provided by CBN-licensed partner banks with NDIC deposit insurance coverage.
          </p>
          <p>
            Investments in mutual funds are subject to market risks. Past yields (such as 16.5% p.a.) do not guarantee future returns. Funds deposited into Spike automated vaults remain your property and are held in trustee arrangements for customer protection.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs border-t border-slate-900">
            <p>© {new Date().getFullYear()} Spike Technologies Limited. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Nigerian wealth creation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
