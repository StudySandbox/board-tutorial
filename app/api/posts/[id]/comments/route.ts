import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

type ParametersType = {
  params: Promise<{ id: string }>;
};

// 댓글 조회 (_request는 미사용 관련 에러를 회피하기위해 언더바를 사용)
export async function GET(_request: NextRequest, context: ParametersType) {
  try {
    const { id } = await context.params;
    const comments = await prisma.comment.findMany({
      where: { postId: id, parentId: null },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json(
      { error: "댓글을 조회하는 데 실패했습니다." },
      { status: 500 },
    );
  }
}

type ContentType = {
  content?: string;
  parentId?: string;
};

// 댓글 등록
export async function POST(request: Request, context: ParametersType) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, parentId } = body as ContentType;

    if (!content) {
      return NextResponse.json(
        { error: "댓글 내용이 없습니다." },
        { status: 400 },
      );
    }

    const { id } = await context.params;
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId: userId,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "댓글 작성에 실패했습니다." },
      { status: 500 },
    );
  }
}
