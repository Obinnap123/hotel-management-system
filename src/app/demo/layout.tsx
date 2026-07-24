import type { Metadata } from "next";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { getHotelSettings } from "@/features/settings/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getHotelSettings();
  const hotelName = settings.hotelName.trim() || "Our Hotel";
  const title =
    settings.websiteTitle.trim() ||
    `${hotelName} | Official Website & Reservations`;
  const description =
    settings.websiteDescription.trim() ||
    `Explore rooms, check availability, and book your stay directly with ${hotelName}.`;

  return {
    title: {
      absolute: title,
    },
    description,
    openGraph: {
      title,
      description,
      siteName: hotelName,
      type: "website",
    },
  };
}

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
