import { getUserAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AigcStudioClient from "@/components/aigc/AigcStudioClient";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const auth = await getUserAuthFromCookies();
  const user = auth
    ? await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { id: true, email: true, name: true, role: true, quota: true, usedQuota: true },
      })
    : null;

  return (
    <>
      <Header user={user} />
      <AigcStudioClient user={user} />
    </>
  );
}
