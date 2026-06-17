import { RoomTypeClient } from "@/components/dashboard/RoomTypeClient";
import { requireAdmin } from "@/features/rooms/authorization";
import { getRoomTypes } from "@/features/rooms/queries";

type RoomTypesPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

const successMessages: Record<string, string> = {
  "room-type-deleted": "Room type deleted.",
};

const errorMessages: Record<string, string> = {
  "delete-room-type": "Room type could not be deleted.",
  "missing-room-type": "Select a room type before continuing.",
  "room-type-has-rooms": "Room types with rooms cannot be deleted.",
};

export default async function RoomTypesPage({
  searchParams,
}: RoomTypesPageProps) {
  await requireAdmin();

  const [roomTypes, params] = await Promise.all([getRoomTypes(), searchParams]);
  const notice = params?.success ? successMessages[params.success] : undefined;
  const error = params?.error
    ? errorMessages[params.error] ?? decodeURIComponent(params.error)
    : undefined;

  return (
    <RoomTypeClient
      error={error}
      notice={notice}
      roomTypes={roomTypes.map((roomType) => ({
        id: roomType.id,
        name: roomType.name,
        description: roomType.description,
        roomCount: roomType._count.rooms,
      }))}
    />
  );
}
