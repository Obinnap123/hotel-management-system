import { PrismaClient } from "@prisma/client";
import { createPrismaAdapter } from "./adapter";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = createPrismaAdapter();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
