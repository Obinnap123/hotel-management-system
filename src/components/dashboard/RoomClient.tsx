"use client";

import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createRoomAction,
  deleteRoomAction,
  updateRoomAction,
  type ActionState,
} from "@/features/rooms/actions";
import {
  roomStatusValues,
  type RoomStatusValue,
} from "@/lib/domain/hms-enums";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";

export type RoomTableItem = {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  pricePerNight: string;
  capacity: number;
  status: RoomStatusValue;
  bookingCount: number;
};

export type RoomTypeOption = {
  id: string;
  name: string;
};

type RoomClientProps = {
  rooms: RoomTableItem[];
  roomTypes: RoomTypeOption[];
  isAdmin: boolean;
  notice?: string;
  error?: string;
};

const initialActionState: ActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function RoomClient({
  rooms,
  roomTypes,
  isAdmin,
  notice,
  error,
}: RoomClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredRooms = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesSearch =
        !normalizedSearch ||
        room.roomNumber.toLowerCase().includes(normalizedSearch) ||
        room.roomTypeName.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "ALL" || room.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rooms, search, statusFilter]);

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">Rooms</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Manage hotel rooms and monitor availability.
          </p>
        </div>

        {isAdmin ? (
          <CreateRoomDialog roomTypes={roomTypes} />
        ) : null}
      </div>

      {notice ? (
        <AutoDismissMessage variant="success">
          {notice}
        </AutoDismissMessage>
      ) : null}

      {error ? (
        <AutoDismissMessage variant="error">
          {error}
        </AutoDismissMessage>
      ) : null}

      <section className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm outline-none focus:border-zinc-900"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search room or type"
              type="search"
              value={search}
            />
          </label>

          <select
            className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="ALL">All statuses</option>
            {roomStatusValues.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:hidden">
          {filteredRooms.map((room) => (
            <div
              className="rounded-md border border-zinc-200 p-3"
              key={room.id}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-medium text-zinc-950">
                    Room {room.roomNumber}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {room.roomTypeName} · Capacity {room.capacity}
                  </p>
                </div>
                <StatusBadge status={room.status} />
              </div>

              <div className="mt-3 flex min-w-0 items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-800">
                  NGN {Number(room.pricePerNight).toLocaleString()}/night
                </p>
                {isAdmin ? (
                  <div className="flex shrink-0 gap-2">
                    <EditRoomDialog room={room} roomTypes={roomTypes} />
                    <DeleteRoomForm room={room} />
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {filteredRooms.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No rooms match your search.
            </p>
          ) : null}
        </div>

        <div className="dashboard-table-scroll mt-4 hidden lg:block">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-3 pr-4 font-medium">Room</th>
                <th className="py-3 pr-4 font-medium">Type</th>
                <th className="py-3 pr-4 font-medium">Price</th>
                <th className="py-3 pr-4 font-medium">Capacity</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                {isAdmin ? (
                  <th className="py-3 text-right font-medium">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr className="border-b border-zinc-100" key={room.id}>
                  <td className="py-3 pr-4 font-medium text-zinc-950">
                    {room.roomNumber}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {room.roomTypeName}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    NGN {Number(room.pricePerNight).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">{room.capacity}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={room.status} />
                  </td>
                  {isAdmin ? (
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <EditRoomDialog room={room} roomTypes={roomTypes} />
                        <DeleteRoomForm room={room} />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRooms.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No rooms match your search.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function CreateRoomDialog({ roomTypes }: { roomTypes: RoomTypeOption[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createRoomAction,
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title="Create room"
      description="Add a room to the hotel inventory."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Create Room
        </button>
      }
    >
      <RoomForm
        action={formAction}
        pending={pending}
        roomTypes={roomTypes}
        state={state}
        submitLabel="Save"
      />
    </Modal>
  );
}

function EditRoomDialog({
  room,
  roomTypes,
}: {
  room: RoomTableItem;
  roomTypes: RoomTypeOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateRoomAction.bind(null, room.id),
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title={`Edit room ${room.roomNumber}`}
      description="Update room details."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit room</span>
        </button>
      }
    >
      <RoomForm
        action={formAction}
        pending={pending}
        room={room}
        roomTypes={roomTypes}
        state={state}
        submitLabel="Save"
      />
    </Modal>
  );
}

function RoomForm({
  action,
  pending,
  room,
  roomTypes,
  state,
  submitLabel,
}: {
  action: (payload: FormData) => void;
  pending: boolean;
  room?: RoomTableItem;
  roomTypes: RoomTypeOption[];
  state: ActionState;
  submitLabel: string;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    submitOnEnter(event);
  }

  return (
    <form action={action} className="space-y-4" onKeyDown={handleKeyDown}>
      {state.message && !state.ok ? (
        <AutoDismissMessage variant="error">
          {state.message}
        </AutoDismissMessage>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Room number</span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            defaultValue={room?.roomNumber}
            name="roomNumber"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Room type</span>
          <select
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            defaultValue={room?.roomTypeId ?? ""}
            name="roomTypeId"
            required
          >
            <option value="">Select room type</option>
            {roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.id}>
                {roomType.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">
            Price per night
          </span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            defaultValue={room?.pricePerNight}
            min="1"
            name="pricePerNight"
            required
            step="0.01"
            type="number"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Capacity</span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            defaultValue={room?.capacity ?? 1}
            min="1"
            name="capacity"
            required
            type="number"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">
          Status (MVP admin only)
        </span>
        <select
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={room?.status ?? "AVAILABLE"}
          name="status"
          required
        >
          {roomStatusValues.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={pending || roomTypes.length === 0}
        type="submit"
      >
        {pending ? "Saving. . ." : submitLabel}
      </button>

      {roomTypes.length === 0 ? (
        <p className="text-sm text-amber-700">
          Create a room type before adding rooms.
        </p>
      ) : null}
    </form>
  );
}

function DeleteRoomForm({ room }: { room: RoomTableItem }) {
  return (
    <form action={deleteRoomAction}>
      <input name="roomId" type="hidden" value={room.id} />
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={room.bookingCount > 0}
        title={
          room.bookingCount > 0
            ? "Rooms with bookings cannot be deleted"
            : "Delete room"
        }
        type="submit"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete room</span>
      </button>
    </form>
  );
}

function useCloseOnSuccess(
  state: ActionState,
  setOpen: (open: boolean) => void,
) {
  const router = useRouter();

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    setOpen(false);
    router.refresh();
  }, [router, setOpen, state.ok, state.submissionId]);
}

function submitOnEnter(event: KeyboardEvent<HTMLFormElement>) {
  if (event.key !== "Enter" || event.shiftKey) {
    return;
  }

  event.preventDefault();
  (event.currentTarget as HTMLFormElement).requestSubmit();
}
