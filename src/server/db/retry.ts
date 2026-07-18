const TRANSIENT_DNS_ERROR = "EAI_AGAIN";

function isTransientDnsError(error: unknown): boolean {
  if (error instanceof Error && error.message.includes(TRANSIENT_DNS_ERROR)) {
    return true;
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    return String(error.code) === TRANSIENT_DNS_ERROR;
  }

  return false;
}

export async function retryTransientDatabaseDnsFailure<T>(
  operation: () => Promise<T>,
): Promise<T> {
  const retryDelaysMs = [250, 750];

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const retryDelay = retryDelaysMs[attempt];

      if (!isTransientDnsError(error) || retryDelay === undefined) {
        throw error;
      }

      console.warn(
        `Database DNS lookup was temporarily unavailable; retrying in ${retryDelay}ms.`,
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}
