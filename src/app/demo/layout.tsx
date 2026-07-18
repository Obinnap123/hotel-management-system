import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { getHotelSettings } from "@/features/settings/queries";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getHotelSettings();

  return (
    <div className="reservation-theme min-h-screen">
      <PublicNavbar hotelName={settings.hotelName} />
      <main>{children}</main>
      <PublicFooter
        emailAddress={settings.emailAddress}
        hotelName={settings.hotelName}
        phoneNumber={settings.phoneNumber}
        physicalAddress={settings.physicalAddress}
      />
    </div>
  );
}
