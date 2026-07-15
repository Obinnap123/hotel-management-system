import {
  Cloud,
  Globe2,
  Hotel,
  LockKeyhole,
  Palette,
  Rocket,
  Workflow,
  Zap,
} from "lucide-react";

const highlights = [
  { label: "Built for African hotels", icon: Hotel },
  { label: "Cloud hosted", icon: Cloud },
  { label: "Reservation Website included", icon: Globe2 },
  { label: "Hotel Management System included", icon: Workflow },
  { label: "White-label ready", icon: Palette },
  { label: "Fast deployment", icon: Rocket },
  { label: "Secure staff access", icon: LockKeyhole },
  { label: "Modern hotel operations", icon: Zap },
];

export function PlatformHighlights() {
  return (
    <section aria-labelledby="platform-highlights-title" className="bg-(--surface-muted)">
      <div className="marketing-container py-12 lg:py-14">
        <div className="grid gap-7 lg:grid-cols-[17rem_1fr] lg:items-start">
          <div>
            <p className="marketing-eyebrow" id="platform-highlights-title">
              Platform highlights
            </p>
            <p className="mt-3 text-sm leading-6 text-(--text-muted)">
              Practical foundations for running a modern hotel online.
            </p>
          </div>
          <ul className="grid border-l border-t border-(--border) sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map(({ icon: Icon, label }) => (
              <li
                className="flex min-h-20 items-center gap-3 border-b border-r border-(--border) px-4 py-4 text-sm font-semibold text-(--text-strong)"
                key={label}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-(--brand-gold)" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
