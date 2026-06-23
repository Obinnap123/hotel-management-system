"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroAvailabilitySearch } from "@/components/public/HeroAvailabilitySearch";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80",
    alt: "Hotel poolside lounge",
  },
  {
    src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1800&q=80",
    alt: "Luxury hotel exterior",
  },
  {
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1800&q=80",
    alt: "Premium hotel bedroom",
  },
  {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1800&q=80",
    alt: "Elegant hotel lounge",
  },
];

export function PublicHero({ hotelName }: { hotelName: string }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % heroImages.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#172033] text-white">
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <img
            alt={image.alt}
            aria-hidden={index !== activeImageIndex}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${
              index === activeImageIndex ? "opacity-100" : "opacity-0"
            }`}
            key={image.src}
            src={image.src}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/78 via-[#172033]/55 to-[#172033]/20" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative mx-auto grid min-h-[72vh] max-w-7xl items-end px-5 py-16 lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/75">
            Luxury hotel reservations
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            {hotelName}
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/82">
            Browse room types, check availability, and reserve your stay in a
            few simple steps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#172033] shadow-sm transition hover:bg-white/90"
              href="/book"
            >
              Reserve now
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/35 bg-transparent px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              href="/rooms"
            >
              View rooms
            </Link>
          </div>
          <HeroAvailabilitySearch />
        </motion.div>
      </div>
    </section>
  );
}
