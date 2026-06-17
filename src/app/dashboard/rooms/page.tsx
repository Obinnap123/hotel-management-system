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

const errorMessages: Record<string, string> = {
  "delete-room": "Room could not be deleted. Check existing records.",
  "invalid-status": "Select a valid room status.",
  "missing-room": "Select a room before continuing.",
  "room-has-bookings": "Rooms with bookings cannot be deleted.",
  "status-update": "Room status could not be updated.",
};

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const [rooms, roomTypes, session, params] = await Promise.all([
    getRooms(),
    getRoomTypes(),
    getCurrentSession(),
    searchParams,
  ]);
  const notice = params?.success ? successMessages[params.success] : undefined;
  const error = params?.error
    ? errorMessages[params.error] ?? decodeURIComponent(params.error)
    : undefined;

  return (
    <RoomClient
      error={error}
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
