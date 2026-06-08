import { getUserAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type HeaderUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export async function getCurrentHeaderUser(): Promise<HeaderUser | null> {
  const auth = await getUserAuthFromCookies();
  if (!auth) return null;

  return prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, email: true, name: true, role: true },
  });
}
