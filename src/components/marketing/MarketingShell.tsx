export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-18 text-[var(--text)]">
      {children}
    </main>
  );
}
