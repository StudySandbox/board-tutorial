import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// 좋아요 등록
type ParametersType = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: ParametersType) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.like.upsert({
      where: {
        postId_userId: {
          postId: id,
          userId,
        },
      },
      update: {},
      create: {
        postId: id,
        userId,
      },
    });

    const count = await prisma.like.count({ where: { postId: id } });

    return NextResponse.json({ liked: true, count });
  } catch {
    return NextResponse.json(
      { error: "좋아요에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: ParametersType) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.like.count({ where: { postId: id, userId } });
    const count = await prisma.like.count({ where: { postId: id } });
    return NextResponse.json({ liked: false, count });
  } catch {
    return NextResponse.json(
      { error: "좋아요 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
