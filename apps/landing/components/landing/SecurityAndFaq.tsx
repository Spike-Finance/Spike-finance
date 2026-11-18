"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Landmark,
  FileCheck2,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

export function SecurityAndFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const trustBadges = [
    {
      icon: Lock,
      title: "Bank-Grade Encryption",
      desc: "256-bit SSL/TLS end-to-end encryption securing all transactions and user credentials.",
    },
    {
      icon: ShieldCheck,
      title: "BVN & Biometric Security",
      desc: "NIBSS-backed BVN validation. Your funds and identity remain strictly protected.",
    },
    {
      icon: Landmark,
      title: "Open Banking Leaders",
      desc: "Direct integration via trusted partners: Mono, Paystack, and Stitch.",
    },
    {
      icon: FileCheck2,
      title: "SEC-Regulated Assets",
      desc: "Underlying mutual funds are managed by SEC-registered Nigerian asset managers.",
    },
  ];

  const faqs = [
    {
      question: "How does the ₦5,000 automatic mutual fund sweep work?",
      answer:
        "When you spend money on your linked bank account or debit card, your spare change accumulates quietly in your Spike digital wallet. Once the spare change total reaches ₦5,000, our system automatically sweeps it into a high-interest, SEC-regulated Money Market Mutual Fund. This ensures your money doesn't sit idle in low-interest checking accounts and begins compounding up to 16.5% p.a. immediately.",
    },
    {
      question: "Can I pause round-ups or choose to approve them per transaction?",
      answer:
        "Yes, absolutely. You are always in 100% control. From the Spike app settings, you can toggle Round-Ups on or off with a single tap, switch between automatic auto-debits or manual 'tap to approve' mode, or modify your round-up rule (e.g. nearest ₦100, ₦500, or ₦1,000) whenever you want.",
    },
    {
      question: "How fast do I receive my Found Money cashback (e.g., on MTN airtime)?",
      answer:
        "Found Money cashback is calculated and credited instantly upon successful transaction confirmation. When you recharge MTN, Airtel, Glo, buy Chowdeck food, or renew DSTV through Spike, your 1% to 2% cash bonus reflects in your savings vault immediately and begins earning interest with the rest of your balance.",
    },
    {
      question: "Can I withdraw my money anytime?",
      answer:
        "Yes. Standard savings and mutual fund balances can be liquidated and withdrawn directly to any commercial Nigerian bank account (or your Spike virtual NUBAN) 24/7. Transfers are processed in seconds via NIP (NIBSS Instant Payment) with zero lock-in penalties on regular vaults.",
    },
    {
      question: "Is my money insured and safe with SPIKE?",
      answer:
        "Yes. Cash balances and virtual NUBAN accounts are held in partnership with CBN-licensed commercial banks insured by NDIC (Nigeria Deposit Insurance Corporation). Investment portfolios and mutual funds are managed by SEC-regulated asset managers with third-party trustees holding underlying securities.",
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust & Security Strip */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Grade Trust</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Your security and regulatory compliance come first
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.title}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{badge.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to know about automated micro-investing with SPIKE in Nigeria.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-emerald-700" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still have questions banner */}
          <div className="mt-12 p-6 rounded-3xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-bold text-slate-900 text-base">Have more questions?</p>
              <p className="text-xs sm:text-sm text-slate-600">
                Our support team is available 24/7 on WhatsApp, in-app chat, and email.
              </p>
            </div>
            <a
              href="mailto:support@spike.africa"
              className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm whitespace-nowrap shadow-xs transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
