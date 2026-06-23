export function AmenitiesSection({ amenities }: { amenities: string[] }) {
  return (
    <div className="mt-6">
      <p className="font-semibold">Amenities</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {amenities.length > 0 ? (
          amenities.map((amenity) => (
            <span
              className="rounded-full bg-[#f1ebe1] px-3 py-1 text-sm font-medium text-[#6b5637]"
              key={amenity}
            >
              {amenity}
            </span>
          ))
        ) : (
          <span className="text-sm text-[#5f6b7a]">
            Amenities will be updated soon.
          </span>
        )}
      </div>
    </div>
  );
}
