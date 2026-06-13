import { RoomClient } from "@/components/dashboard/RoomClient";
import { isAdminRole } from "@/features/rooms/authorization";
import { getRooms, getRoomTypes } from "@/features/rooms/queries";
import { getCurrentSession } from "@/server/auth/session";

type RoomsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

const successMessages: Record<string, string> = {
  "room-deleted": "Room deleted.",
  "status-updated": "Room status updated.",
};

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const [rooms, roomTypes, session, params] = await Promise.all([
    getRooms(),
    getRoomTypes(),
    getCurrentSession(),
    searchParams,
  ]);
  const notice = params?.success ? successMessages[params.success] : undefined;

  return (
    <RoomClient
      isAdmin={Boolean(session && isAdminRole(session.role))}
      notice={notice}
      roomTypes={roomTypes.map((roomType) => ({
        id: roomType.id,
        name: roomType.name,
      }))}
      rooms={rooms.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId,
        roomTypeName: room.roomType.name,
        pricePerNight: room.pricePerNight.toString(),
        capacity: room.capacity,
        status: room.status,
        bookingCount: room._count.bookings,
      }))}
    />
  );
}
