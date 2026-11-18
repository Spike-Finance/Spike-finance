import React from "react";
import { Star, Quote, Heart } from "lucide-react";

export function CustomerStories() {
  const stories = [
    {
      name: "Chiamaka O.",
      handle: "@chiamaka_dev",
      location: "Yaba, Lagos",
      role: "Product Designer",
      quote:
        "I honestly didn't think micro-savings would make any difference until I checked my Spike balance after 5 months. I had saved over ₦165,000 just from food deliveries and Uber round-ups. It's completely effortless.",
      metric: "₦165k+ Saved via Round-Ups",
    },
    {
      name: "Tunde Balogun",
      handle: "@tunde_b",
      location: "Ikeja, Lagos",
      role: "E-Commerce Founder",
      quote:
        "Spike's SafeLock is my secret weapon against impulsive spending. I locked my store's shop rent money and earned 16.5% interest on it before rent was due. Zero regrets.",
      metric: "16.5% Annual Return on Rent Vault",
    },
    {
      name: "Fatima Aliyu",
      handle: "@fatima_abuja",
      location: "Gwarinpa, Abuja",
      role: "Doctor",
      quote:
        "The ₦100 welcome bonus got me to try the app, but the Found Money cashback on MTN data and groceries is what kept me. It literally feels like getting paid to spend.",
      metric: "₦28k+ Free Cashback Earned",
    },
  ];

  return (
    <section id="stories" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>Loved by 10,000+ Nigerians</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Real stories from smart savers
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            See how everyday Nigerians are turning daily pocket change into life-changing financial security.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.name}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-200" />
                </div>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                  "{story.quote}"
                </p>
              </div>

              <div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs mb-4 text-center">
                  {story.metric}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">{story.name}</p>
                    <p className="text-xs text-slate-500">{story.role} • {story.location}</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-semibold">{story.handle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
