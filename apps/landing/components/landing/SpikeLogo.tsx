"use client";

import React from "react";
import Image from "next/image";

interface SpikeLogoProps {
  variant?: "dark" | "light"; // dark = dark text on light bg; light = white text on dark bg
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function SpikeLogo({
  variant = "dark",
  size = "md",
  showTagline = false,
  className = "",
  iconOnly = false,
}: SpikeLogoProps) {
  const isLight = variant === "light";

  const sizeDimensions = {
    sm: { width: 110, height: 26, iconSize: 28 },
    md: { width: 140, height: 33, iconSize: 36 },
    lg: { width: 180, height: 42, iconSize: 48 },
    xl: { width: 230, height: 54, iconSize: 60 },
  };

  const dim = sizeDimensions[size];

  if (iconOnly) {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg
          width={dim.iconSize}
          height={dim.iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rounded-2xl shadow-lg"
        >
          <defs>
            <radialGradient id="iconGlow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#2cb42c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0a0f0d" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Rounded App Icon Base */}
          <rect width="100" height="100" rx="22" fill="#0A0F0D" />
          <circle cx="50" cy="50" r="38" fill="url(#iconGlow)" />

          {/* Letter K with the signature green spike */}
          {/* Vertical Stem */}
          <rect x="25" y="24" width="12" height="52" rx="1.5" fill="#FFFFFF" />
          {/* Lower Leg */}
          <path d="M37 50 L64 76 H78 L49 48 Z" fill="#FFFFFF" />
          {/* Exact Brand Spike Angle & Tip */}
          <path
            d="M37 56 L69 22 H54 L32 46 Z"
            fill="#2cb42c"
          />
          <polygon
            points="37,56 74,18 56,18 32,46"
            fill="#2cb42c"
          />
        </svg>
      </div>
    );
  }

  // Exact Official Logo Image Asset
  const logoSrc = isLight
    ? "/images/spike-logo-white.png"
    : "/images/spike-logo-dark.png";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        style={{ width: dim.width, height: dim.height }}
        className="relative shrink-0 flex items-center"
      >
        <Image
          src={logoSrc}
          alt="SPIKE"
          width={dim.width}
          height={dim.height}
          priority
          className="object-contain w-auto h-full"
        />
      </div>

      {showTagline && (
        <span
          className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight ${
            isLight
              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2cb42c] mr-1.5 animate-pulse" />
          Small drops make an ocean
        </span>
      )}
    </div>
  );
}
