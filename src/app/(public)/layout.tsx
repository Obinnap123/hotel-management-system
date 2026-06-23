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
    <div className="min-h-screen bg-[#f7f3ed] text-[#1f2933]">
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
