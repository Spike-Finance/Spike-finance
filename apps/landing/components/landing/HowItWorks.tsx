import React from "react";
import { UserCheck, SlidersHorizontal, Gift, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: UserCheck,
      title: "Verify in Seconds",
      badge: "Under 60 secs",
      description:
        "Download the app, create your account, and complete instant biometric & BVN verification. Your data is 256-bit encrypted and never shared.",
      detail: "Zero paper forms • Instant NUBAN generation",
    },
    {
      number: "02",
      icon: SlidersHorizontal,
      title: "Link & Set Your Rules",
      badge: "Fully Customizable",
      description:
        "Securely connect your primary debit card or bank account via Mono, Paystack, or Stitch. Choose your round-up rule (e.g., nearest ₦500) or recurring deposit schedule.",
      detail: "Pause, edit, or adjust rules anytime with one tap",
    },
    {
      number: "03",
      icon: Gift,
      title: "Get ₦100 Free & Grow",
      badge: "Instant Reward",
      description:
        "Claim an instant ₦100 welcome bonus straight to your wallet. Spend as usual and watch your spare change automatically sweep into SEC-regulated mutual funds.",
      detail: "Daily interest accrual • Withdraw funds whenever you want",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Fast & Seamless Onboarding</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Start building wealth in under 3 minutes
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            No complex paperwork, no branch visits, and no minimum capital required. Here is how simple it is:
          </p>
        </div>

        {/* 3-Step Horizontal Stepper */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector Line (visible on desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 -translate-y-16 -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative z-10 bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Step Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Step Number */}
                    <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-300/60 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 mb-3">
                    {step.badge}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{step.detail}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Under-Stepper Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <a href="#download-app" className="text-emerald-700 font-bold hover:underline">
              Download the app to log in &rarr;
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
