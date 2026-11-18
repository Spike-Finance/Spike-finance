import React from "react";
import { ShieldCheck, Lock, Landmark, FileCheck } from "lucide-react";

export function TrustBar() {
  const items = [
    {
      icon: Lock,
      title: "Bank-Grade Security",
      desc: "256-bit SSL encryption",
    },
    {
      icon: Landmark,
      title: "NDIC Insured",
      desc: "Held in licensed partner banks",
    },
    {
      icon: FileCheck,
      title: "SEC-Regulated",
      desc: "Mutual funds with certified trustees",
    },
    {
      icon: ShieldCheck,
      title: "BVN Protected",
      desc: "NIBSS instant biometric check",
    },
  ];

  return (
    <section className="py-8 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
