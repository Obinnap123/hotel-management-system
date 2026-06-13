import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { createPrismaAdapter } from "../../src/server/db/adapter";
import { hashPassword } from "../../src/lib/auth/password";

const adapter = createPrismaAdapter();
const prisma = new PrismaClient({ adapter });

async function main() {
  const fullName = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!fullName || !email || !password) {
    throw new Error(
      "SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD are required.",
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      passwordHash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
    create: {
      fullName,
      email,
      passwordHash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
