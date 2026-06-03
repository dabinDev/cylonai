import { getUserAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AigcStudioClient from "@/components/aigc/AigcStudioClient";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const auth = await getUserAuthFromCookies();
  const user = auth
    ? await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { id: true, email: true, name: true, role: true, quota: true, usedQuota: true },
      })
    : null;

  const tasks = user
    ? await prisma.aiGenerationTask.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          type: true,
          model: true,
          status: true,
          prompt: true,
          outputUrl: true,
          outputText: true,
          remoteTaskId: true,
          errorMessage: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    : [];

  return (
    <AigcStudioClient
      user={user}
      initialTasks={tasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }))}
    />
  );
}
