# Production safety for each hotel deployment

Each hotel deployment must have its own Supabase project and database. A backup
or restore for one hotel must never contain another hotel's records.

## Before every database migration

1. Confirm the Vercel project and Supabase project belong to the same hotel.
2. In Supabase, check that the project is healthy and note the latest available
   backup or point-in-time recovery position for the project's plan.
3. For high-risk migrations, create an additional encrypted logical backup with
   `pg_dump` through the direct database connection.
4. Keep the backup outside the repository. Database dumps contain private guest,
   booking, payment, and staff data and must never be committed to Git.
5. Run `pnpm db:preflight-bookings` and resolve any overlapping active bookings.
6. Run `pnpm prisma migrate deploy` against the intended hotel database.
7. Test staff login, room availability, reservation creation, payment, check-in,
   and checkout before considering the deployment complete.

## Connection variables

- `DATABASE_URL` is the pooled runtime connection used by the application.
- `DIRECT_URL` is the direct or session-mode connection used for migrations and
  administrative backup tools.
- Never copy a connection string from one hotel's Vercel project into another.

The Prisma CLI currently reads `DATABASE_URL`. When running a migration from a
trusted terminal, temporarily provide that process with the hotel's `DIRECT_URL`
as `DATABASE_URL`. Do not print either value into terminal logs or screenshots.

## Restore drill

A backup is not proven until it can be restored. Before onboarding paying hotels,
perform a restore drill into a separate temporary Supabase project:

1. Restore the latest backup into the temporary project.
2. point a non-production Vercel deployment at that temporary database.
3. Verify room types, rooms, guests, bookings, payments, users, and hotel settings.
4. Verify the reservation website can read availability without changing live data.
5. Delete the temporary project only after the result has been documented.

## Incident response

If a deployment produces booking, login, or database errors:

1. Stop making manual data corrections until the cause is understood.
2. Preserve the Vercel runtime logs and the time the incident began.
3. Confirm the affected hotel project before running any database command.
4. Roll the application back to the previous Vercel deployment when the schema is
   backward-compatible.
5. Restore the database only when records are actually damaged or lost; an
   application error alone does not require a database restore.
6. Record what happened, what data was affected, and how recurrence is prevented.

## Required monitoring before general sale

- Vercel alerts for elevated server errors and failed deployments.
- Supabase alerts for database availability and connection exhaustion.
- An error-tracking service for server exceptions, with guest and password data
  removed before transmission.
- A monthly restore check and a written record of the result.
