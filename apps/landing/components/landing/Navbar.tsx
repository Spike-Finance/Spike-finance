"use client";

import React, { useState, useEffect } from "react";
import { SpikeLogo } from "./SpikeLogo";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenWaitlistModal?: () => void;
  onOpenDownloadModal?: () => void;
}

export function Navbar({ onOpenWaitlistModal, onOpenDownloadModal }: NavbarProps) {
  const openModal = onOpenWaitlistModal || onOpenDownloadModal;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Save", href: "#offerings" },
    { name: "Invest", href: "#offerings" },
    { name: "Stories", href: "#stories" },
    { name: "FAQs", href: "#faq" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3.5"
            : "bg-white/80 backdrop-blur-xs py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo + tagline */}
            <a
              href="#"
              className="flex items-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1"
              aria-label="SPIKE Home"
            >
              <SpikeLogo variant="dark" size="md" showTagline={true} />
            </a>

            {/* Center: Navigation Links (PiggyVest Style) */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right: Coming Soon Badge & Join Waitlist Button */}
            <div className="hidden md:flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Coming Soon
              </span>

              <button
                type="button"
                onClick={onOpenWaitlistModal}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Join the Waitlist</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={openModal}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                Waitlist
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] z-40 bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-xl px-5 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (openModal) openModal();
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Join the Waitlist & Claim ₦100
            </button>
          </div>
        </div>
      )}
    </>
  );
}
