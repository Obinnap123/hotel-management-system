import { HotelProfileSettingsForm } from "@/components/dashboard/settings/HotelProfileSettingsForm";
import { requireAdmin } from "@/features/rooms/authorization";
import { getHotelSettings } from "@/features/settings/queries";

export default async function HotelProfileSettingsPage() {
  await requireAdmin();
  const settings = await getHotelSettings();

  return (
    <HotelProfileSettingsForm
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
