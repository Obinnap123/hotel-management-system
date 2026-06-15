-- DropIndex
DROP INDEX IF EXISTS "Guest_phoneNumber_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Guest_phoneNumber_key" ON "Guest"("phoneNumber");
