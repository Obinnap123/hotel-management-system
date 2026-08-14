type SettingsFieldProps = {
  children: React.ReactNode;
  className?: string;
  hint?: string;
  label: string;
};

export function SettingsField({
  children,
  className = "",
  hint,
  label,
}: SettingsFieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-slate-800">{label}</span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-slate-500">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export const settingsInputClass =
  "mt-1.5 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 sm:text-sm";
