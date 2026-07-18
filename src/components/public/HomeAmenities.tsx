import { Car, Coffee, Dumbbell, Headphones, Sparkles, Wifi } from "lucide-react";
import { MotionReveal } from "./MotionReveal";

const amenities = [
  { title: "Reliable Wi-Fi", detail: "Across rooms and shared spaces", icon: Wifi },
  { title: "Breakfast service", detail: "A thoughtful start to your morning", icon: Coffee },
  { title: "Secure parking", detail: "Convenient on-site access", icon: Car },
  { title: "Fitness access", detail: "Space to maintain your routine", icon: Dumbbell },
  { title: "Prepared rooms", detail: "Carefully readied before arrival", icon: Sparkles },
  { title: "Reception support", detail: "Help throughout your stay", icon: Headphones },
];

export function HomeAmenities() {
  return (
    <section className="border-y border-[#284a42] bg-[#173b32] text-white">
      <div className="reservation-container reservation-section">
        <MotionReveal className="grid gap-7 lg:grid-cols-[.65fr_1fr] lg:items-end">
          <div><p className="reservation-kicker text-[#e3ce9f]!">At your convenience</p><h2 className="reservation-heading mt-4 max-w-lg">The essentials, handled with care.</h2></div>
          <p className="max-w-xl text-sm leading-7 text-white/62 lg:justify-self-end">From a smooth arrival to a restful night, each detail supports a stay that feels settled from the beginning.</p>
        </MotionReveal>
        <div className="mt-12 grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;
            return <MotionReveal className="border-b border-r border-white/15 p-6 sm:p-7" delay={index * 0.035} key={amenity.title}><Icon aria-hidden="true" className="h-5 w-5 text-[#ddc796]" strokeWidth={1.5} /><h3 className="mt-7 font-serif text-xl">{amenity.title}</h3><p className="mt-2 text-sm leading-6 text-white/58">{amenity.detail}</p></MotionReveal>;
          })}
        </div>
      </div>
    </section>
  );
}
