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
  const primaryImage = coverImage ?? fallbackRoomImage;
  const images = galleryImages.length > 0 ? galleryImages : [primaryImage];

  return (
    <div className="space-y-4">
      <img
        alt={`${roomName} room`}
        className="h-[460px] w-full rounded-2xl object-cover"
        src={primaryImage}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {images.slice(0, 3).map((image) => (
          <img
            alt={`${roomName} gallery`}
            className="h-32 w-full rounded-xl object-cover"
            key={image}
            src={image}
          />
        ))}
      </div>
    </div>
  );
}

const fallbackRoomImage =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";
