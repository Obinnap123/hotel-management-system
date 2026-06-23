"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type RoomGalleryProps = {
  roomName: string;
  coverImage: string | null;
  galleryImages: string[];
};

export function RoomGallery({
  coverImage,
  galleryImages,
  roomName,
}: RoomGalleryProps) {
  const images = useMemo(() => {
    const uniqueImages = Array.from(
      new Set([coverImage ?? fallbackRoomImage, ...galleryImages].filter(Boolean)),
    );

    return uniqueImages.length > 0 ? uniqueImages : [fallbackRoomImage];
  }, [coverImage, galleryImages]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  function showPreviousImage() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function showNextImage() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-2xl bg-[#ebe3d7] shadow-[0_18px_45px_rgba(23,32,51,0.08)]">
        <img
          alt={`${roomName} room view ${activeIndex + 1}`}
          className="aspect-[4/3] w-full object-cover sm:aspect-[16/11] lg:aspect-[4/3]"
          src={activeImage}
        />

        {hasMultipleImages ? (
          <>
            <button
              aria-label="Previous room image"
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#172033]/75 text-white shadow-lg backdrop-blur transition hover:bg-[#172033]"
              onClick={showPreviousImage}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              aria-label="Next room image"
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#172033]/75 text-white shadow-lg backdrop-blur transition hover:bg-[#172033]"
              onClick={showNextImage}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-[#172033]/78 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                aria-label={`Show ${roomName} image ${index + 1}`}
                aria-pressed={isActive}
                className={`overflow-hidden rounded-xl border bg-white p-1 transition ${
                  isActive
                    ? "border-[#172033] shadow-[0_0_0_2px_rgba(23,32,51,0.12)]"
                    : "border-black/10 hover:border-[#8a6f46]"
                }`}
                key={`${image}-${index}`}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <img
                  alt=""
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                  src={image}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const fallbackRoomImage =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";
