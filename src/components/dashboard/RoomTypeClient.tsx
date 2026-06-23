"use client";

import { Edit, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  createRoomTypeAction,
  deleteRoomTypeAction,
  updateRoomTypeAction,
  type ActionState,
} from "@/features/rooms/actions";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import { Modal } from "@/components/ui/Modal";

type SelectedGalleryImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export type RoomTypeTableItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  coverImagePublicId: string | null;
  galleryImages: string[];
  galleryImagePublicIds: string[];
  amenities: string[];
  roomCount: number;
};

type RoomTypeClientProps = {
  roomTypes: RoomTypeTableItem[];
  notice?: string;
  error?: string;
};

const initialActionState: ActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function RoomTypeClient({
  error,
  notice,
  roomTypes,
}: RoomTypeClientProps) {
  return (
    <div className="min-w-0 space-y-5">
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
        <AutoDismissMessage variant="success">{notice}</AutoDismissMessage>
      ) : null}

      {error ? (
        <AutoDismissMessage variant="error">{error}</AutoDismissMessage>
      ) : null}

      <section className="min-w-0 rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="grid gap-3 p-4 md:grid-cols-2 lg:hidden">
          {roomTypes.map((roomType) => (
            <div
              className="rounded-md border border-zinc-200 p-3"
              key={roomType.id}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <RoomTypeThumbnail roomType={roomType} />
                <div className="min-w-0">
                  <p className="break-words font-medium text-zinc-950">
                    {roomType.name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {roomType.roomCount} room
                    {roomType.roomCount === 1 ? "" : "s"}
                  </p>
                  <p className="mt-1 break-words text-xs text-zinc-500">
                    /rooms/{roomType.slug}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <EditRoomTypeDialog roomType={roomType} />
                  <DeleteRoomTypeForm roomType={roomType} />
                </div>
              </div>
              <p className="mt-3 break-words text-sm text-zinc-600">
                {roomType.description || "No description"}
              </p>
              <AmenityPreview amenities={roomType.amenities} />
            </div>
          ))}

          {roomTypes.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No room types have been created.
            </p>
          ) : null}
        </div>

        <div className="dashboard-table-scroll hidden lg:block">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Amenities</th>
                <th className="px-4 py-3 font-medium">Rooms</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((roomType) => (
                <tr className="border-b border-zinc-100" key={roomType.id}>
                  <td className="px-4 py-3">
                    <RoomTypeThumbnail roomType={roomType} />
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-950">
                    {roomType.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    /rooms/{roomType.slug}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {roomType.description || "No description"}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {roomType.amenities.length > 0
                      ? roomType.amenities.slice(0, 3).join(", ")
                      : "No amenities"}
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
  useCloseOnSuccess(state, setOpen, () => {
    // Form will reset naturally when modal closes and re-opens
  });

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
  useCloseOnSuccess(state, setOpen, () => {
    // Form will reset naturally when modal closes and re-opens
  });

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
  const [isPending, startTransition] = useTransition();
  const [coverImage, setCoverImage] = useState<string | null>(
    roomType?.coverImage ?? null,
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    roomType?.galleryImages ?? [],
  );
  const [galleryImagePublicIds, setGalleryImagePublicIds] = useState<string[]>(
    roomType?.galleryImages.map(
      (_, index) => roomType.galleryImagePublicIds[index] ?? "",
    ) ?? [],
  );
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<
    SelectedGalleryImage[]
  >([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const selectedGalleryImagesRef = useRef<SelectedGalleryImage[]>([]);

  useEffect(() => {
    selectedGalleryImagesRef.current = selectedGalleryImages;
  }, [selectedGalleryImages]);

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  useEffect(() => {
    return () => {
      selectedGalleryImagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.previewUrl),
      );
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    submitOnEnter(event);
  }

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setCoverPreview(null);
      return;
    }

    setCoverPreview(URL.createObjectURL(file));
    setValidationError(null);
  }

  function handleGalleryChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setSelectedGalleryImages((current) => [
      ...current,
      ...files.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}-${index}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
    event.target.value = "";
    setValidationError(null);
  }

  function clearCoverImage() {
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }

    setCoverImage(null);
    setCoverPreview(null);
  }

  function removeExistingGalleryImage(index: number) {
    setGalleryImages((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
    setGalleryImagePublicIds((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function clearSelectedGalleryImages() {
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }

    setSelectedGalleryImages((current) => {
      current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return [];
    });
  }

  function removeSelectedGalleryImage(id: string) {
    setSelectedGalleryImages((current) => {
      const imageToRemove = current.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return current.filter((image) => image.id !== id);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    // Validate required fields
    const nameInput = formRef.current?.querySelector(
      'input[name="name"]',
    ) as HTMLInputElement;
    if (!nameInput?.value?.trim()) {
      setValidationError("Room type name is required.");
      return;
    }

    // Build FormData explicitly with all fields
    const formData = new FormData();

    // Text fields
    formData.append("name", nameInput.value);
    const slugInput = formRef.current?.querySelector(
      'input[name="slug"]',
    ) as HTMLInputElement;
    if (slugInput?.value) {
      formData.append("slug", slugInput.value);
    }

    const descriptionInput = formRef.current?.querySelector(
      'textarea[name="description"]',
    ) as HTMLTextAreaElement;
    if (descriptionInput?.value) {
      formData.append("description", descriptionInput.value);
    }

    const amenitiesInput = formRef.current?.querySelector(
      'textarea[name="amenities"]',
    ) as HTMLTextAreaElement;
    if (amenitiesInput?.value) {
      formData.append("amenities", amenitiesInput.value);
    }

    // Existing cover image
    formData.append("existingCoverImage", coverImage ?? "");
    if (coverImage) {
      formData.append(
        "existingCoverImagePublicId",
        roomType?.coverImagePublicId ?? "",
      );
    }

    // New cover image file
    const coverFileInput = formRef.current?.querySelector(
      'input[name="coverImage"]',
    ) as HTMLInputElement;
    if (coverFileInput?.files?.[0]) {
      formData.append("coverImage", coverFileInput.files[0]);
    }

    // Existing gallery images
    galleryImages.forEach((image) => {
      formData.append("existingGalleryImages", image);
    });
    galleryImagePublicIds.forEach((publicId) => {
      formData.append("existingGalleryImagePublicIds", publicId);
    });

    // New gallery image files
    selectedGalleryImages.forEach((image) => {
      formData.append("galleryImages", image.file);
    });

    // Submit the form inside a transition
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <form
      ref={formRef}
      className="space-y-4"
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
    >
      {validationError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {validationError}
        </div>
      )}

      {state.message && !state.ok ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.message}
        </div>
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
        <span className="text-sm font-medium text-zinc-800">Slug</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={roomType?.slug}
          name="slug"
          placeholder="deluxe-room"
        />
        <span className="mt-1 block text-xs text-zinc-500">
          Used for public URLs like /rooms/deluxe-room.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Description</span>
        <textarea
          className="mt-1 min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          defaultValue={roomType?.description ?? ""}
          name="description"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Amenities</span>
        <textarea
          className="mt-1 min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          defaultValue={roomType?.amenities.join("\n") ?? ""}
          name="amenities"
          placeholder={"King bed\nFree Wi-Fi\nAir conditioning"}
        />
        <span className="mt-1 block text-xs text-zinc-500">
          Enter one amenity per line or separate with commas.
        </span>
      </label>

      <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <div>
          <p className="text-sm font-medium text-zinc-800">Cover image</p>
          <p className="mt-1 text-xs text-zinc-500">
            This image appears on room cards and room details.
          </p>
        </div>

        {coverImage || coverPreview ? (
          <div className="relative overflow-hidden rounded-md border border-zinc-200 bg-white">
            <img
              alt="Room type cover preview"
              className="h-40 w-full object-cover"
              src={coverPreview ?? coverImage ?? ""}
            />
            <button
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm hover:bg-white"
              onClick={clearCoverImage}
              type="button"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove cover image</span>
            </button>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white text-sm text-zinc-500">
            No cover image selected.
          </div>
        )}

        <input
          name="existingCoverImage"
          type="hidden"
          value={coverImage ?? ""}
        />
        <input
          name="existingCoverImagePublicId"
          type="hidden"
          value={coverImage ? (roomType?.coverImagePublicId ?? "") : ""}
        />
        <label className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
          <ImagePlus className="h-4 w-4" />
          Choose cover image
          <input
            accept="image/*"
            className="sr-only"
            name="coverImage"
            onChange={handleCoverChange}
            ref={coverInputRef}
            type="file"
          />
        </label>
      </div>

      <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <div>
          <p className="text-sm font-medium text-zinc-800">Gallery images</p>
          <p className="mt-1 text-xs text-zinc-500">
            Current images stay unless removed. New images are added on save.
          </p>
        </div>

        {galleryImages.map((image, index) => (
          <div key={`${image}-${index}`}>
            <input name="existingGalleryImages" type="hidden" value={image} />
            <input
              name="existingGalleryImagePublicIds"
              type="hidden"
              value={galleryImagePublicIds[index] ?? ""}
            />
          </div>
        ))}

        {galleryImages.length > 0 || selectedGalleryImages.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-3">
            {galleryImages.map((image, index) => (
              <GalleryPreview
                image={image}
                key={image}
                onRemove={() => removeExistingGalleryImage(index)}
              />
            ))}
            {selectedGalleryImages.map((image) => (
              <GalleryPreview
                image={image.previewUrl}
                key={image.id}
                onRemove={() => removeSelectedGalleryImage(image.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white text-sm text-zinc-500">
            No gallery images selected.
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <label className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
            <ImagePlus className="h-4 w-4" />
            Add gallery images
            <input
              accept="image/*"
              className="sr-only"
              multiple
              name="galleryImages"
              onChange={handleGalleryChange}
              ref={galleryInputRef}
              type="file"
            />
          </label>
          {selectedGalleryImages.length > 0 ? (
            <button
              className="inline-flex h-10 items-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              onClick={clearSelectedGalleryImages}
              type="button"
            >
              Clear selected
            </button>
          ) : null}
        </div>
      </div>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving. . ." : submitLabel}
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

function RoomTypeThumbnail({ roomType }: { roomType: RoomTypeTableItem }) {
  if (!roomType.coverImage) {
    return (
      <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-xs text-zinc-500">
        No image
      </div>
    );
  }

  return (
    <img
      alt={`${roomType.name} cover`}
      className="h-14 w-20 shrink-0 rounded-md border border-zinc-200 object-cover"
      src={roomType.coverImage}
    />
  );
}

function AmenityPreview({ amenities }: { amenities: string[] }) {
  if (amenities.length === 0) {
    return (
      <p className="mt-3 text-xs uppercase tracking-wide text-zinc-500">
        No amenities
      </p>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {amenities.slice(0, 4).map((amenity) => (
        <span
          className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700"
          key={amenity}
        >
          {amenity}
        </span>
      ))}
      {amenities.length > 4 ? (
        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-500">
          +{amenities.length - 4}
        </span>
      ) : null}
    </div>
  );
}

function GalleryPreview({
  image,
  onRemove,
}: {
  image: string;
  onRemove?: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-md border border-zinc-200 bg-white">
      <img
        alt="Room type gallery preview"
        className="h-24 w-full object-cover"
        src={image}
      />
      {onRemove ? (
        <button
          className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm hover:bg-white"
          onClick={onRemove}
          type="button"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Remove gallery image</span>
        </button>
      ) : null}
    </div>
  );
}

function useCloseOnSuccess(
  state: ActionState,
  setOpen: (open: boolean) => void,
  onSuccess?: () => void,
) {
  const router = useRouter();

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    // Call optional callback to reset form state
    if (onSuccess) {
      onSuccess();
    }

    // Wait a moment for user to see success message, then close
    const timer = setTimeout(() => {
      setOpen(false);
      router.refresh();
    }, 800);

    return () => clearTimeout(timer);
  }, [router, setOpen, state.ok, state.submissionId, onSuccess]);
}

function submitOnEnter(event: KeyboardEvent<HTMLFormElement>) {
  if (event.key !== "Enter" || event.shiftKey) {
    return;
  }

  event.preventDefault();
  (event.currentTarget as HTMLFormElement).requestSubmit();
}
