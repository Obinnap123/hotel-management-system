import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "The reservation was simple, the room was ready, and check-in felt organized from the moment I arrived.",
    name: "Amaka E.",
    detail: "Business guest",
  },
  {
    quote:
      "Comfortable rooms, calm service, and a team that made the stay feel easy without overcomplicating anything.",
    name: "Daniel O.",
    detail: "Weekend stay",
  },
  {
    quote:
      "I liked that everything felt coordinated. The staff already had my reservation details at reception.",
    name: "Tolu A.",
    detail: "Family visit",
  },
];

export function Testimonials() {
  return (
    <section className="bg-[#172033] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d6bd8d]">
              Guest impressions
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Thoughtful service that feels effortless.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/68">
            Calm hospitality, clear reservations, and a stay experience guests
            can trust.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              className="rounded-2xl border border-white/12 bg-white/[0.06] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.16)]"
              key={testimonial.name}
            >
              <div className="flex gap-1 text-[#d6bd8d]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    aria-hidden="true"
                    fill="currentColor"
                    key={index}
                    size={15}
                  />
                ))}
              </div>
              <p className="mt-5 leading-7 text-white/82">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="mt-1 text-sm text-white/58">
                  {testimonial.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
