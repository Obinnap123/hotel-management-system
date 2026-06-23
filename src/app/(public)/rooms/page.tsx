import { RoomTypeCard } from "@/components/public/RoomTypeCard";
import { getAllPublicRoomTypes } from "@/features/public-room-types/queries";

export const dynamic = "force-dynamic";

export default async function PublicRoomsPage() {
  const roomTypes = await getAllPublicRoomTypes();

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a6f46]">
          Rooms
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Choose your room type
        </h1>
        <p className="mt-4 text-[#5f6b7a]">
          Guests reserve room types. The hotel assigns an available room
          automatically.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {roomTypes.map((roomType) => (
          <RoomTypeCard key={roomType.slug} roomType={roomType} />
        ))}
      </div>
    </section>
  );
}
