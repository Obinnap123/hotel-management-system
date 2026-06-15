import { GuestClient } from "@/components/dashboard/GuestClient";
import { getGuests } from "@/features/guests/queries";

export default async function GuestsPage() {
  const guests = await getGuests();

  return (
    <GuestClient
      guests={guests.map((guest) => ({
        id: guest.id,
        fullName: guest.fullName,
        phoneNumber: guest.phoneNumber,
        email: guest.email,
        address: guest.address,
        createdAt: new Intl.DateTimeFormat("en", {
          dateStyle: "medium",
        }).format(guest.createdAt),
      }))}
    />
  );
}
