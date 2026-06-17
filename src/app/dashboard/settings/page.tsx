import { SettingsClient } from "@/components/dashboard/SettingsClient";
import { requireAdmin } from "@/features/rooms/authorization";
import { getHotelSettings } from "@/features/settings/queries";

export default async function SettingsPage() {
  await requireAdmin();

  const settings = await getHotelSettings();

  return (
    <SettingsClient
      settings={{
        hotelName: settings.hotelName,
        phoneNumber: settings.phoneNumber,
        emailAddress: settings.emailAddress,
        physicalAddress: settings.physicalAddress,
        defaultCheckInTime: settings.defaultCheckInTime,
        defaultCheckOutTime: settings.defaultCheckOutTime,
        currency: settings.currency,
      }}
    />
  );
}
