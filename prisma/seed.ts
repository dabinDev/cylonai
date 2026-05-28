import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

function createPrismaClient(): PrismaClient {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      allowPublicKeyRetrieval: true,
    });
    return new PrismaClient({ adapter });
  }
  // Local dev: use SQLite adapter (eval bypasses bundler static analysis)
  const mod = eval('require')("@prisma/adapter-better-sqlite3");
  const path = eval('require')("path");
  const dbPath = path.join(process.cwd(), "dev.db");
  const adapter = new mod.PrismaBetterSqlite3({ url: dbPath });
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
