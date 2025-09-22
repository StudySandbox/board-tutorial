import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// 게시글 상세 조회
type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Params) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user.id;
  const { id } = await context.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        ...(userId
          ? {
              likes: {
                where: { userId },
                select: { id: true },
              },
            }
          : {}),
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const shaped = {
      ...post,
      likedByMe: Array.isArray(post.likes) ? post.likes.length > 0 : false,
    };

    // likes는 사용하지 않는 변수
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { likes, ...rest } = shaped;

    return NextResponse.json({ post: rest });
  } catch {
    return NextResponse.json(
      { error: "게시글을 불러오는데 실패했습니다.." },
      { status: 500 },
    );
  }
}

// 게시글 수정
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user.id;
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.post.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (existing.authorId !== userId) {
      return NextResponse.json(
        { error: "작성자만 수정할 수 있습니다." },
        { status: 403 },
      );
    }

    type BodyType = {
      title?: string;
      content?: string;
    };

    const body = await request.json();

    const { title, content } = body as BodyType;

    if (!title && !content) {
      return NextResponse.json(
        { error: "수정사항이 없습니다." },
        { status: 400 },
      );
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json(
      { error: "게시글 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

// 게시글 삭제
export async function DELETE(request: NextRequest, context: Params) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user.id;
    const { id } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.post.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (existing.authorId !== userId) {
      return NextResponse.json(
        { error: "작성자만 삭제할 수 있습니다." },
        { status: 403 },
      );
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "게시글 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
