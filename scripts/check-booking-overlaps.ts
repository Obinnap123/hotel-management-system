import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const url = new URL(connectionString);
url.searchParams.delete("sslmode");
url.searchParams.delete("uselibpqcompat");

const pool = new Pool({
  connectionString: url.toString(),
  max: 1,
  allowExitOnIdle: true,
  ssl: {
    rejectUnauthorized:
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
  },
});

async function main() {
  try {
    const [overlaps, legacyReservedRooms] = await Promise.all([
      pool.query<{
        first_booking_id: string;
        second_booking_id: string;
        room_id: string;
      }>(`
        SELECT
          first_booking."id" AS first_booking_id,
          second_booking."id" AS second_booking_id,
          first_booking."roomId" AS room_id
        FROM "Booking" first_booking
        INNER JOIN "Booking" second_booking
          ON first_booking."roomId" = second_booking."roomId"
          AND first_booking."id" < second_booking."id"
          AND first_booking."checkInDate" < second_booking."checkOutDate"
          AND first_booking."checkOutDate" > second_booking."checkInDate"
        WHERE first_booking."status" IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
          AND second_booking."status" IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
        ORDER BY first_booking."roomId"
        LIMIT 20
      `),
      pool.query<{ count: string }>(`
        SELECT COUNT(*)::text AS count
        FROM "Room"
        WHERE "status" = 'RESERVED'
      `),
    ]);

    const reservedRoomCount = Number(legacyReservedRooms.rows[0]?.count ?? 0);

    console.log(
      `Legacy RESERVED room states to normalize: ${reservedRoomCount}`,
    );

    if (overlaps.rows.length > 0) {
      console.error(
        `Found ${overlaps.rows.length} overlapping active booking pair(s). Resolve them before deploying the migration.`,
      );
      console.table(overlaps.rows);
      process.exitCode = 1;
    } else {
      console.log("Booking overlap preflight passed.");
    }
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Booking preflight failed.",
  );
  process.exitCode = 1;
});
