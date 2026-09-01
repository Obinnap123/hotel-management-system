const channelName = "symplyup-reservation-site-updates";
const storageKey = "symplyup-reservation-site-updated-at";

type ReservationSiteUpdateMessage = {
  type: "settings-updated";
  updatedAt: number;
};

export function notifyReservationSiteUpdated() {
  const message: ReservationSiteUpdateMessage = {
    type: "settings-updated",
    updatedAt: Date.now(),
  };

  if (supportsBroadcastChannel()) {
    const channel = new BroadcastChannel(channelName);
    channel.postMessage(message);
    channel.close();
    return;
  }

  try {
    window.localStorage.setItem(storageKey, String(message.updatedAt));
  } catch {
    // A blocked storage API should never turn a successful settings save into an error.
  }
}

export function subscribeToReservationSiteUpdates(onUpdate: () => void) {
  if (supportsBroadcastChannel()) {
    const channel = new BroadcastChannel(channelName);
    const handleMessage = (event: MessageEvent<ReservationSiteUpdateMessage>) => {
      if (event.data?.type === "settings-updated") onUpdate();
    };

    channel.addEventListener("message", handleMessage);
    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) onUpdate();
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function supportsBroadcastChannel() {
  return typeof window.BroadcastChannel === "function";
}
