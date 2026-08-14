import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { isTransactionWriteConflict } from "./transaction-errors";

export { isOverlappingBookingConstraintError } from "./transaction-errors";

const maximumAttempts = 3;

export async function runSerializableTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 10000,
        timeout: 15000,
      });
    } catch (error) {
      if (!isTransactionWriteConflict(error) || attempt === maximumAttempts) {
        throw error;
      }
    }
  }

  throw new Error("Serializable transaction retry limit was reached.");
}
