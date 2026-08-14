import type { Metadata } from "next";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { getReservationSiteConfig } from "@/features/settings/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getReservationSiteConfig();

  return {
    title: {
      absolute: config.website.title,
    },
    description: config.website.description,
    openGraph: {
      title: config.website.title,
      description: config.website.description,
      siteName: config.hotel.name,
      type: "website",
    },
  };
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getReservationSiteConfig();

  return (
    <div className="reservation-theme min-h-screen">
      <PublicNavbar hotelName={config.hotel.name} />
      <main>{children}</main>
      <PublicFooter
        emailAddress={config.hotel.emailAddress}
        hotelName={config.hotel.name}
        phoneNumber={config.hotel.phoneNumber}
        physicalAddress={config.hotel.physicalAddress}
      />
    </div>
  );
}
