"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

type AutoDismissMessageProps = {
  children: string;
  variant: "success" | "error";
  durationMs?: number;
  instanceKey?: string;
};

export function AutoDismissMessage({
  children,
  durationMs = 4500,
  instanceKey = "",
  variant,
}: AutoDismissMessageProps) {
  if (!children) {
    return null;
  }

  return (
    <AutoDismissMessageInstance
      key={`${children}-${instanceKey}`}
      durationMs={durationMs}
      variant={variant}
    >
      {children}
    </AutoDismissMessageInstance>
  );
}

function AutoDismissMessageInstance({
  children,
  durationMs,
  variant,
}: Required<Omit<AutoDismissMessageProps, "instanceKey">>) {
  const [phase, setPhase] = useState<"visible" | "leaving" | "hidden">(
    "visible",
  );

  useEffect(() => {
    const leaveTimer = window.setTimeout(
      () => setPhase("leaving"),
      Math.max(durationMs - 240, 0),
    );
    const hideTimer = window.setTimeout(() => setPhase("hidden"), durationMs);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, [durationMs]);

  if (phase === "hidden") {
    return null;
  }

  const presentation =
    variant === "success"
      ? {
          container: "border-emerald-200 bg-white text-emerald-950",
          icon: "bg-emerald-100 text-emerald-700",
          Icon: CheckCircle2,
          label: "Success",
        }
      : {
          container: "border-red-200 bg-white text-red-950",
          icon: "bg-red-100 text-red-700",
          Icon: AlertCircle,
          label: "Action needed",
        };
  const Icon = presentation.Icon;

  return (
    <div
      aria-atomic="true"
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`dashboard-notification dashboard-notification--${phase} ${presentation.container}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${presentation.icon}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-current/65">
          {presentation.label}
        </span>
        <span className="mt-0.5 block text-sm font-medium leading-5">
          {children}
        </span>
      </span>
      <button
        aria-label="Dismiss notification"
        className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-current/55 hover:bg-black/5 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30"
        onClick={() => {
          setPhase("leaving");
          window.setTimeout(() => setPhase("hidden"), 180);
        }}
        type="button"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
