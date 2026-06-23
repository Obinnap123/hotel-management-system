type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "md" | "pill";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  className?: string;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-65";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-hover)]",
  secondary:
    "border border-black/10 bg-white text-[var(--primary)] shadow-sm hover:bg-black/5",
  ghost: "text-[var(--primary)] hover:bg-black/5",
  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
};

const shapeStyles: Record<ButtonShape, string> = {
  md: "rounded-md",
  pill: "rounded-full",
};

export function buttonStyles({
  className = "",
  shape = "md",
  size = "md",
  variant = "primary",
}: ButtonStyleOptions = {}) {
  return [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    shapeStyles[shape],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
