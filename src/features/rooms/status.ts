import { Prisma, RoomStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function manuallyUpdateRoomStatusForMvp(
  roomId: string,
  status: RoomStatus,
) {
  return updateRoomStatus(roomId, status);
}

export async function markRoomReserved(
  roomId: string,
  db: RoomStatusClient = prisma,
) {
  return updateRoomStatus(roomId, RoomStatus.RESERVED, db);
}

export async function markRoomOccupied(
  roomId: string,
  db: RoomStatusClient = prisma,
) {
  return updateRoomStatus(roomId, RoomStatus.OCCUPIED, db);
}

export async function markRoomAvailable(
  roomId: string,
  db: RoomStatusClient = prisma,
) {
  return updateRoomStatus(roomId, RoomStatus.AVAILABLE, db);
}

export async function markRoomMaintenance(
  roomId: string,
  db: RoomStatusClient = prisma,
) {
  return updateRoomStatus(roomId, RoomStatus.MAINTENANCE, db);
}

type RoomStatusClient = Pick<Prisma.TransactionClient, "room">;

async function updateRoomStatus(
  roomId: string,
  status: RoomStatus,
  db: RoomStatusClient = prisma,
) {
  return db.room.update({
    where: { id: roomId },
    data: { status },
  });
}
