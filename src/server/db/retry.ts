const transientConnectionCodes = new Set([
  "EAI_AGAIN",
  "ECONNRESET",
  "ENOTFOUND",
  "EPIPE",
  "ETIMEDOUT",
  "P1001",
  "57P01",
  "57P02",
  "57P03",
]);

const transientConnectionMessages = [
  "connection terminated due to connection timeout",
  "connection terminated unexpectedly",
  "can't reach database server",
  "could not connect to server",
  "server closed the connection unexpectedly",
];

export function isTransientDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      transientConnectionMessages.some((candidate) =>
        message.includes(candidate),
      )
    ) {
      return true;
    }
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    return transientConnectionCodes.has(String(error.code));
  }

  return false;
}

/**
 * Retries read-only work when the remote database connection briefly drops.
 * Do not use this for writes: a failed response does not prove that a write
 * was rolled back, so replaying it could duplicate or overwrite data.
 */
export async function retryTransientDatabaseRead<T>(
  operation: () => Promise<T>,
): Promise<T> {
  const retryDelaysMs = [250, 750];

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const retryDelay = retryDelaysMs[attempt];

      if (
        !isTransientDatabaseConnectionError(error) ||
        retryDelay === undefined
      ) {
        throw error;
      }

      console.warn(
        `Database connection was temporarily unavailable; retrying read in ${retryDelay}ms.`,
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}
