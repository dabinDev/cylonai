import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

function createPrismaClient() {
  if (process.env.DATABASE_URL) {
    return new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
  }
  // Local dev: use SQLite adapter
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path");
  const dbPath = path.join(process.cwd(), "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("123456", 10);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: { password: adminPassword },
    create: {
      username: "admin",
      password: adminPassword,
    },
  });

  console.log("Seed completed: admin user created (username: admin, password: 123456)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
