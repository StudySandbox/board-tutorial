import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// 게시물 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // page 값에 범위를 설정해 안정적인 값으로 제어
    const page = Math.max(1, Number(searchParams.get("page") || 1));

    // Math.min(20, Math.max(...))는 결과 값과 20중 더 작은 값을 반환하여 최대값을 20으로 제한합니다.
    const pageSize = Math.min(
      20,
      Math.max(1, Number(searchParams.get("pageSize") || 10)),
    );

    // 페이지 네이션용으로 페이지 번호에 따른 제외할 게시글 개수
    const skip = (page - 1) * pageSize;

    const [total, posts] = await Promise.all([
      prisma.post.count(),
      prisma.post.findMany({
        // 생성일 기준으로 내림차순하여 최근 게시물이 가장 먼저 나옴
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return NextResponse.json({ posts, page, pageSize, total });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

// 게시물 등록
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user?.id;

    // 사용자 확인
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 게시글 제목, 내용 확인
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 게시글 작성
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
