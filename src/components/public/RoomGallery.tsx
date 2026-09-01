"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type RoomGalleryProps = { roomName: string; coverImage: string | null; galleryImages: string[] };

export function RoomGallery({ coverImage, galleryImages, roomName }: RoomGalleryProps) {
  const images = useMemo(() => Array.from(new Set([coverImage ?? fallbackRoomImage, ...galleryImages].filter(Boolean))), [coverImage, galleryImages]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0] ?? fallbackRoomImage;
  const hasMultipleImages = images.length > 1;

  return (
    <div>
      <div className="group relative overflow-hidden bg-[var(--reservation-image-placeholder)]">
        <AnimatePresence mode="wait">
          <motion.div animate={{ opacity: 1 }} className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5]" exit={{ opacity: 0 }} initial={{ opacity: 0 }} key={activeImage} transition={{ duration: 0.3 }}>
            <Image alt={`${roomName} room view ${activeIndex + 1}`} className="object-cover" fill loading="eager" priority sizes="(max-width: 1023px) 100vw, 55vw" src={activeImage} unoptimized={activeImage.includes("res.cloudinary.com")} />
          </motion.div>
        </AnimatePresence>
        {hasMultipleImages ? <><GalleryButton direction="previous" onClick={() => setActiveIndex((current) => current === 0 ? images.length - 1 : current - 1)} /><GalleryButton direction="next" onClick={() => setActiveIndex((current) => current === images.length - 1 ? 0 : current + 1)} /><p className="absolute bottom-4 right-4 bg-[var(--reservation-primary)] px-3 py-2 text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--reservation-on-primary)]">{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p></> : null}
      </div>
      {hasMultipleImages ? <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">{images.map((image, index) => <button aria-label={`Show ${roomName} image ${index + 1}`} aria-pressed={index === activeIndex} className={`relative aspect-[4/3] overflow-hidden border-2 ${index === activeIndex ? "border-[var(--reservation-accent-copy)]" : "border-transparent opacity-68 hover:opacity-100"}`} key={`${image}-${index}`} onClick={() => setActiveIndex(index)} type="button"><Image alt="" className="object-cover" fill loading={index === 0 ? "eager" : "lazy"} sizes="160px" src={image} unoptimized={image.includes("res.cloudinary.com")} /></button>)}</div> : null}
    </div>
  );
}

function GalleryButton({ direction, onClick }: { direction: "previous" | "next"; onClick: () => void }) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;
  return <button aria-label={`${direction === "previous" ? "Previous" : "Next"} room image`} className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-[var(--reservation-primary)]/88 text-[var(--reservation-on-primary)] transition hover:bg-[var(--reservation-primary)] ${direction === "previous" ? "left-3" : "right-3"}`} onClick={onClick} type="button"><Icon aria-hidden="true" className="h-5 w-5" /></button>;
}

const fallbackRoomImage = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=84";
