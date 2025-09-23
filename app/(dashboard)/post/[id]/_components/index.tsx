"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  Edit2Icon,
  HeartIcon,
  MessageCircleIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingModal } from "@/components/common/modal/loading";

import { useGetPost } from "../_hooks/queries/get-post";
import { DeleteConfirmModal } from "./modal/delete-confirm";
import { Comments } from "./comments";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

interface Props {
  postId: string;
}

const MainComponent = ({ postId }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data, isLoading, isError } = useGetPost({ postId });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onEditClick = () => {
    router.push(`/post/${postId}/edit`);
  };
  const onDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <LoadingModal
        isOpen={isLoading}
        description="게시글을 불러오는 중 입니다..."
      />
    );
  }

  if (isError || data.error) {
    notFound();
  }

  const post = data.post;
  const userId = session?.user.id;

  return (
    <>
      {/* 게시글 삭제 모달 */}
      <DeleteConfirmModal
        postId={postId}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />

      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <Button
            variant="link"
            className="cursor-pointer gap-1 has-[>svg]:px-0"
            onClick={() => router.push("/dashboard")}
          >
            <ChevronLeftIcon className="size-4" />
            <span>대시보드로 돌아가기</span>
          </Button>
        </div>
        <article className="space-y-2">
          <div>
            <h1 className="px-1 text-2xl font-bold">{post.title}</h1>
            <p className="px-2 text-end text-sm">작성자: {post.author?.name}</p>

            <div>
              <Button variant="ghost" className="hover:bg-transparent">
                <HeartIcon
                  className={cn(
                    "size-4 gap-1 text-pink-400",
                    post.likedByMe && "fill-pink-400",
                  )}
                />
                <span className="text-primary">{post._count?.likes ?? 0}</span>
              </Button>

              <Button variant="ghost" className="gap-1 hover:bg-transparent">
                <MessageCircleIcon className="text-primary size-4" />
                <span className="text-primary">
                  {post._count?.comments ?? 0}
                </span>
              </Button>
            </div>
          </div>

          <div className="ring-primary h-[200px] max-h-[50vh] rounded-md p-4 break-all whitespace-pre-wrap ring">
            {post.content}
          </div>
        </article>

        <div className="my-4 flex items-center justify-between gap-2">
          {userId === post.author.id && (
            <div className="flex gap-2">
              <Button
                className="cursor-pointer text-base"
                variant="destructive"
                onClick={onDeleteClick}
              >
                <Trash2Icon className="size-4" />
                <span>삭제</span>
              </Button>

              <Button
                className="cursor-pointer text-base"
                variant="outline"
                onClick={onEditClick}
              >
                <Edit2Icon className="size-4" />
                <span>수정</span>
              </Button>
            </div>
          )}
        </div>

        <div>
          {/* 댓글 컴포넌트 */}
          <Comments postId={postId} />
        </div>
      </div>
    </>
  );
};

export default MainComponent;
