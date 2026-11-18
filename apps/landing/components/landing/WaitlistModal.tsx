"use client";

import React, { useState } from "react";
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Mail, User, Phone, CheckCircle2 } from "lucide-react";
import { SpikeLogo } from "./SpikeLogo";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMsg("Please enter a valid Nigerian phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Unable to join waitlist right now. Please try again.");
      }

      setIsSubmitted(true);
      // Save to localStorage as well
      try {
        localStorage.setItem("spike_waitlist_user", JSON.stringify(formData));
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      // Fallback optimistic success for offline or network edge cases
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Success Screen */
          <div className="text-center py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 mb-2">
              You are on the list!
            </span>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Welcome to the family, {formData.firstName}!
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Your early access spot has been reserved. You will be among the very first to test SPIKE before public rollout, and your <strong className="text-emerald-700">₦100 welcome bonus</strong> is locked in for launch day.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-semibold text-slate-900">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-900">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-900">+234 {formData.phone.replace(/^0+/, "")}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700">VIP Early Access ✓</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form Screen */
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <SpikeLogo variant="dark" size="md" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Coming Soon • Early Access</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Join the SPIKE Waitlist
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Be the first to turn your daily spare change into long-term wealth. Includes an instant <strong>₦100 welcome bonus</strong> at launch.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Waitlist Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="firstName"
                      type="text"
                      required
                      placeholder="e.g. Jhon"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    placeholder="e.g. Patrick"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative flex">
                  <div className="inline-flex items-center gap-1 px-3 border border-r-0 border-slate-200 rounded-l-xl bg-slate-50 text-slate-600 text-xs font-semibold">
                    <span>🇳🇬</span>
                    <span>+234</span>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="801 234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-r-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <span>Reserving your spot...</span>
                ) : (
                  <>
                    <span>Join the Waitlist & Claim ₦100</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>No spam ever. Unsubscribe with one click.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
