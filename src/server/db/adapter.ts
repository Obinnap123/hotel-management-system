import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export function createPrismaAdapter() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required.");
  }

  const pool = new Pool({
    connectionString: removeSslMode(connectionString),
    ssl: {
      rejectUnauthorized:
        process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
    },
  });

  return new PrismaPg(pool);
}

function removeSslMode(connectionString: string) {
  const url = new URL(connectionString);

  url.searchParams.delete("sslmode");
  url.searchParams.delete("uselibpqcompat");

  return url.toString();
}
