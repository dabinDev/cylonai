import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  if (process.env.DATABASE_URL) {
    // Production: use MariaDB adapter with DATABASE_URL
    const url = new URL(process.env.DATABASE_URL);
    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
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

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
