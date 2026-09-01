import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SymplyUp Hotel Suite",
    template: "%s | SymplyUp",
  },
  description:
    "A cloud-based hotel management and reservation platform for modern hospitality businesses.",
  keywords: [
    "hotel management system",
    "hotel reservation software",
    "hospitality software",
    "SymplyUp Hotel Suite",
  ],
  openGraph: {
    description:
      "SymplyUp Hotel Suite connects reservation websites, hotel operations, payments, check-ins, check-outs, and reporting in one platform.",
    siteName: "SymplyUp",
    title: "SymplyUp Hotel Suite",
    type: "website",
  },
  icons: {
    icon: [{ url: "/symplyup-favicon.ico" }],
    shortcut: [{ url: "/symplyup-favicon.ico" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
