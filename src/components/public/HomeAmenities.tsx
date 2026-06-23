"use client";

import { motion } from "framer-motion";
import { Car, Coffee, Dumbbell, ShieldCheck, Sparkles, Wifi } from "lucide-react";

const amenities = [
  {
    title: "Fast Wi-Fi",
    description: "Reliable connectivity across guest rooms and shared spaces.",
    icon: Wifi,
  },
  {
    title: "Secure Parking",
    description: "On-site parking designed for convenience and peace of mind.",
    icon: Car,
  },
  {
    title: "Breakfast Service",
    description: "Fresh morning options for business and leisure guests.",
    icon: Coffee,
  },
  {
    title: "Fitness Access",
    description: "A quiet space to keep your routine while you travel.",
    icon: Dumbbell,
  },
  {
    title: "Clean Rooms",
    description: "Well-kept rooms prepared carefully before every stay.",
    icon: Sparkles,
  },
  {
    title: "Staff Support",
    description: "Reception support for check-in, check-out, and stay requests.",
    icon: ShieldCheck,
  },
];

export function HomeAmenities() {
  return (
    <section className="border-y border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a6f46]">
            Amenities
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#172033]">
            Everything needed for a calm, comfortable stay.
          </h2>
          <p className="mt-4 leading-7 text-[#5f6b7a]">
            Designed for guests who value comfort, order, and a smooth hotel
            experience from reservation to checkout.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;

            return (
              <motion.article
                className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-5 shadow-[0_14px_35px_rgba(23,32,51,0.04)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_40px_rgba(23,32,51,0.08)]"
                initial={{ opacity: 0, y: 18 }}
                key={amenity.title}
                transition={{
                  duration: 0.48,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.04,
                }}
                viewport={{ once: true, amount: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172033] text-white">
                  <Icon aria-hidden="true" size={19} />
                </div>
                <h3 className="mt-5 font-semibold text-[#172033]">
                  {amenity.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5f6b7a]">
                  {amenity.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
