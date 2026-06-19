type AutoDismissMessageProps = {
  children: string;
  variant: "success" | "error";
  durationMs?: number;
};

export function AutoDismissMessage({
  children,
  durationMs = 4000,
  variant,
}: AutoDismissMessageProps) {
  if (!children) {
    return null;
  }

  const styles =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <p
      className={`auto-dismiss-message rounded-md border px-3 py-2 text-sm font-medium shadow-sm ${styles}`}
      style={{ animationDuration: `${durationMs}ms` }}
    >
      {children}
    </p>
  );
}
