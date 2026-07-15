import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingMotionProvider } from "@/components/marketing/MarketingMotionProvider";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="marketing-theme min-h-screen bg-[var(--background)]">
      <MarketingMotionProvider>
        <MarketingNavbar />
        <MarketingShell>{children}</MarketingShell>
        <MarketingFooter />
      </MarketingMotionProvider>
    </div>
  );
}
