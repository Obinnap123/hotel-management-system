import Image from "next/image";
import { getLogoDeliveryUrl } from "@/lib/cloudinary/delivery-url";

type HotelLogoProps = {
  alt: string;
  className: string;
  position?: "left" | "center";
  priority?: boolean;
  sizes: string;
  url: string;
};

const positionClasses = {
  center: "object-center",
  left: "object-left",
} as const;

export function HotelLogo({
  alt,
  className,
  position = "left",
  priority = false,
  sizes,
  url,
}: HotelLogoProps) {
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <Image
        alt={alt}
        className={`object-contain ${positionClasses[position]}`}
        fill
        priority={priority}
        sizes={sizes}
        src={getLogoDeliveryUrl(url)}
        unoptimized={url.includes("res.cloudinary.com")}
      />
    </span>
  );
}
