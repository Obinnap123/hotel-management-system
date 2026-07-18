"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { HeroAvailabilitySearch } from "@/components/public/HeroAvailabilitySearch";
import { publicReservationPath } from "@/lib/public/routes";

const defaultHeroImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=88",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=88",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=88",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=88",
];

export function PublicHero({ heroImages, hotelName }: { heroImages?: string[]; hotelName: string }) {
  const images = heroImages && heroImages.length > 0 ? heroImages : defaultHeroImages;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const visibleImageIndex = activeImageIndex % images.length;

  useEffect(() => {
    if (images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveImageIndex((current) => (current + 1) % images.length), 7000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-[calc(100svh-4.75rem)] bg-[#102a24] text-white">
      <div className="absolute inset-0 overflow-hidden">
        {images.map((src, index) => (
          <Image alt="" aria-hidden="true" className={`object-cover transition-[opacity,transform] duration-[1600ms] ease-out ${index === visibleImageIndex ? "scale-100 opacity-100" : "scale-[1.025] opacity-0"}`} fill key={`${src}-${index}`} priority={index === 0} sizes="100vw" src={src} unoptimized={src.includes("res.cloudinary.com")} />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,29,24,.82)_0%,rgba(9,30,26,.48)_48%,rgba(9,25,22,.14)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,25,21,.65)_0%,transparent_55%)]" />
      </div>

      <div className="reservation-container relative flex min-h-[calc(100svh-4.75rem)] flex-col justify-end pb-44 pt-20 sm:pb-48 lg:pb-36">
        <div className="max-w-4xl">
          <p className="reservation-kicker text-[#e6d2a7]!">Welcome to {hotelName}</p>
          <h1 className="reservation-display mt-5 max-w-4xl">Arrive. Exhale.<br />Stay awhile.</h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/76 sm:text-lg">Well-appointed rooms, unhurried hospitality, and a direct reservation experience designed around your stay.</p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link className="inline-flex h-12 items-center gap-3 bg-[#e5d2a9] px-6 text-xs font-bold uppercase tracking-[0.14em] text-[#17382f] transition hover:bg-white" href={publicReservationPath("/rooms")}>Explore rooms <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
            <a className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-white/80 transition hover:text-white" href="#featured-stays">Discover the hotel <ArrowDown aria-hidden="true" className="h-4 w-4" /></a>
          </div>
        </div>

        {images.length > 1 ? (
          <div aria-label="Hero image selection" className="absolute bottom-36 right-0 hidden items-center gap-3 lg:flex" role="group">
            <span className="mr-2 text-[0.65rem] font-semibold tracking-[0.16em] text-white/55">0{visibleImageIndex + 1} / 0{images.length}</span>
            {images.map((src, index) => <button aria-label={`Show hero image ${index + 1}`} aria-pressed={index === visibleImageIndex} className={`h-px transition-all ${index === visibleImageIndex ? "w-12 bg-[#e5d2a9]" : "w-7 bg-white/35 hover:bg-white"}`} key={`${src}-control`} onClick={() => setActiveImageIndex(index)} type="button" />)}
          </div>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-1/2 lg:translate-y-0">
        <div className="reservation-container">
          <HeroAvailabilitySearch />
        </div>
      </div>
    </section>
  );
}
