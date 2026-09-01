import type { Metadata } from "next";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicSiteRefreshListener } from "@/components/public/PublicSiteRefreshListener";
import { getReservationSiteConfig } from "@/features/settings/queries";
import { createReservationThemeStyle } from "@/lib/reservation-theme";

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
    icons: config.branding.faviconUrl
      ? {
          icon: [{ url: config.branding.faviconUrl }],
          shortcut: [{ url: config.branding.faviconUrl }],
        }
      : undefined,
  };
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getReservationSiteConfig();
  const themeStyle = createReservationThemeStyle(config.branding);

  return (
    <div
      className="reservation-theme min-h-screen"
      data-color-scheme={config.branding.colorScheme.toLowerCase()}
      style={themeStyle}
    >
      <PublicSiteRefreshListener />
      <PublicNavbar
        hotelName={config.hotel.name}
        logoUrl={config.branding.lightLogoUrl}
      />
      <main>{children}</main>
      <PublicFooter
        copy={config.website.copy}
        emailAddress={config.hotel.emailAddress}
        hotelName={config.hotel.name}
        phoneNumber={config.hotel.phoneNumber}
        physicalAddress={config.hotel.physicalAddress}
      />
    </div>
  );
}
