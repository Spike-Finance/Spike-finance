import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0F766E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "SPIKE — Small drops make an ocean | Automated Spare Change Savings & Investing in Nigeria",
  description:
    "Save and invest your spare change automatically with SPIKE. From your first ₦1 to your first ₦1M, build wealth effortlessly through automated bank round-ups, high-yield mutual funds, zero-fee instant transfers, 2-tap bill payments, and Found Money cashback across 350+ brands in Nigeria.",
  keywords: [
    "fintech Nigeria",
    "spare change investing Nigeria",
    "round up savings Nigeria",
    "micro-investing Nigeria",
    "automated savings Lagos",
    "mutual funds Nigeria",
    "high interest savings account Nigeria",
    "Mono open banking",
    "Paystack savings",
    "Stitch open banking",
    "bill payments Nigeria",
    "virtual NUBAN account",
    "zero fee bank transfers Nigeria",
    "Spike fintech",
    "Spike for business API",
  ],
  authors: [{ name: "Spike Technologies Limited" }],
  creator: "Spike Technologies",
  publisher: "Spike Technologies Limited",
  metadataBase: new URL("https://spike.africa"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://spike.africa",
    siteName: "SPIKE",
    title: "SPIKE — Small drops make an ocean | Automated Savings & Micro-Investing",
    description:
      "Save and invest spare change automatically every time you spend. Get an instant ₦100 welcome bonus on signup. SEC-regulated mutual funds, instant transfers, and bill payments in Nigeria.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SPIKE — Automated Micro-Investing in Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPIKE — Automated Savings & Spare Change Investing in Nigeria",
    description:
      "From your first ₦1 to your first ₦1M. Turn everyday Nigerian bank transfers and card spending into automated high-yield mutual fund investments.",
    creator: "@SpikeAfrica",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
