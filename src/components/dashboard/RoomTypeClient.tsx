"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  useActionState,
  useEffect,
  useState,
} from "react";
import {
  createRoomTypeAction,
  deleteRoomTypeAction,
  updateRoomTypeAction,
  type ActionState,
} from "@/features/rooms/actions";
import { Modal } from "@/components/ui/Modal";

export type RoomTypeTableItem = {
  id: string;
  name: string;
  description: string | null;
  roomCount: number;
};

type RoomTypeClientProps = {
  roomTypes: RoomTypeTableItem[];
  notice?: string;
};

const initialActionState: ActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function RoomTypeClient({ roomTypes, notice }: RoomTypeClientProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">Room Types</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Configure room categories used by room inventory.
          </p>
        </div>
        <CreateRoomTypeDialog />
      </div>

      {notice ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </p>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Rooms</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((roomType) => (
                <tr className="border-b border-zinc-100" key={roomType.id}>
                  <td className="px-4 py-3 font-medium text-zinc-950">
                    {roomType.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {roomType.description || "No description"}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {roomType.roomCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <EditRoomTypeDialog roomType={roomType} />
                      <DeleteRoomTypeForm roomType={roomType} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {roomTypes.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No room types have been created.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function CreateRoomTypeDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createRoomTypeAction,
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title="Create room type"
      description="Add a category such as Standard, Deluxe, or Suite."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Create Room Type
        </button>
      }
    >
      <RoomTypeForm
        action={formAction}
        pending={pending}
        state={state}
        submitLabel="Save"
      />
    </Modal>
  );
}

function EditRoomTypeDialog({ roomType }: { roomType: RoomTypeTableItem }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateRoomTypeAction.bind(null, roomType.id),
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title={`Edit ${roomType.name}`}
      description="Update room type details."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit room type</span>
        </button>
      }
    >
      <RoomTypeForm
        action={formAction}
        pending={pending}
        roomType={roomType}
        state={state}
        submitLabel="Save"
      />
    </Modal>
  );
}

function RoomTypeForm({
  action,
  pending,
  roomType,
  state,
  submitLabel,
}: {
  action: (payload: FormData) => void;
  pending: boolean;
  roomType?: RoomTypeTableItem;
  state: ActionState;
  submitLabel: string;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    submitOnEnter(event);
  }

  return (
    <form action={action} className="space-y-4" onKeyDown={handleKeyDown}>
      {state.message && !state.ok ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.message}
        </p>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Name</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={roomType?.name}
          name="name"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Description</span>
        <textarea
          className="mt-1 min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          defaultValue={roomType?.description ?? ""}
          name="description"
        />
      </label>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={pending}
        type="submit"
      >
        {pending ? "Saving. . ." : submitLabel}
      </button>
    </form>
  );
}

function DeleteRoomTypeForm({ roomType }: { roomType: RoomTypeTableItem }) {
  return (
    <form action={deleteRoomTypeAction}>
      <input name="roomTypeId" type="hidden" value={roomType.id} />
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={roomType.roomCount > 0}
        title={
          roomType.roomCount > 0
            ? "Room types with rooms cannot be deleted"
            : "Delete room type"
        }
        type="submit"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete room type</span>
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
