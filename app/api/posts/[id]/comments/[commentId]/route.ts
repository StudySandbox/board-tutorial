import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

type ParametersType = {
  params: Promise<{
    id: string;
    commentId: string;
  }>;
};

// 댓글 삭제
export async function DELETE(request: NextRequest, { params }: ParametersType) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user.id;
    const { commentId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (existing.authorId !== userId) {
      return NextResponse.json(
        { error: "작성자만 삭제가 가능합니다." },
        { status: 403 },
      );
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "댓글 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}

type ContentType = {
  content?: string;
};

// 댓글 수정
export async function PATCH(request: NextRequest, context: ParametersType) {
  try {
    const { commentId } = await context.params;
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (existing.authorId !== userId) {
      return NextResponse.json(
        { error: "작성자만 삭제 가능합니다." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { content } = body as ContentType;

    if (!content) {
      return NextResponse.json(
        { error: "댓글 내용을 입력하세요" },
        { status: 400 },
      );
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
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

    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json(
      {
        error: "댓글 수정에 실패했습니다.",
      },
      { status: 500 },
    );
  }
}
