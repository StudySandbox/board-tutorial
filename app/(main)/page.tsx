import { ModeToggle } from "@/components/common/mode-toggle";

import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <div className="space-y-2">
      {/* 다크모드 토글 */}
      <ModeToggle />

      {/* 유저 리스트 불러오기 */}
      <ol className="list-inside list-decimal font-[family-name:var(--font-geist-sans)]">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
