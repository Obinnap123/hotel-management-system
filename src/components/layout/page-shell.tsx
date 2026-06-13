type PageShellProps = {
  title: string;
  description: string;
};

export function PageShell({ title, description }: PageShellProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        Protected Route
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-zinc-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </section>
  );
}
