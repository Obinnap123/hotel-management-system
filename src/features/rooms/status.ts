import { RoomStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function manuallyUpdateRoomStatusForMvp(
  roomId: string,
  status: RoomStatus,
) {
  return updateRoomStatus(roomId, status);
}

export async function markRoomReserved(roomId: string) {
  return updateRoomStatus(roomId, RoomStatus.RESERVED);
}

export async function markRoomOccupied(roomId: string) {
  return updateRoomStatus(roomId, RoomStatus.OCCUPIED);
}

export async function markRoomAvailable(roomId: string) {
  return updateRoomStatus(roomId, RoomStatus.AVAILABLE);
}

export async function markRoomMaintenance(roomId: string) {
  return updateRoomStatus(roomId, RoomStatus.MAINTENANCE);
}

async function updateRoomStatus(roomId: string, status: RoomStatus) {
  return prisma.room.update({
    where: { id: roomId },
    data: { status },
  });
}
