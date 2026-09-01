"use client";

import { useEffect } from "react";
import { subscribeToReservationSiteUpdates } from "@/lib/public/site-refresh";

export function PublicSiteRefreshListener() {
  useEffect(
    () =>
      subscribeToReservationSiteUpdates(() => {
        window.location.reload();
      }),
    [],
  );

  return null;
}
