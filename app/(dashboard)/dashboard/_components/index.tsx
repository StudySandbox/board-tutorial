"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { notFound, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  HeartIcon,
  Loader2Icon,
  LogOutIcon,
  MessageCircleIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingModal } from "@/components/common/modal/loading";

import { useGetPosts } from "../_hooks/queries/get-posts";
import { usePostLikeMutation } from "../_hooks/mutations/post-like";
import { useDeleteLikeMutation } from "../_hooks/mutations/delete-like";

type PostType = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; name: string | null; email: string };
  _count?: { comments: number; likes: number };
  likedByMe?: boolean;
};

const MainComponent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const {
    data: postData,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetPosts();
  const { mutate: postLikeMutate, isPending: isPostLikePending } =
    usePostLikeMutation();
  const { mutate: deleteLikeMutate, isPending: isDeleteLikePending } =
    useDeleteLikeMutation();

  const { data: session, isPending: isSessionPending } = useSession();
  const user = session?.user;
  const posts = postData?.pages.flatMap((page) => page.posts) || [];

  // 로그아웃
  const onSignoutClick = async () => {
    startTransition(async () => {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
          },
        },
      });
    });
  };

  const onHeartToggleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    post: PostType,
  ) => {
    event.stopPropagation();
    if (!post) return;

    // 좋아요를 안누른 경우
    if (!post.likedByMe) {
      postLikeMutate(
        { postId: post.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
          },
          onError: (error) => {
            toast.error(error.message, { id: "error" });
          },
        },
      );

      return;
    }

    // 이미 좋아요를 누른경우
    if (post.likedByMe) {
      deleteLikeMutate(
        { postId: post.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
          },
          onError: (error) => {
            toast.error(error.message, { id: "error" });
          },
        },
      );

      return;
    }
  };

  if (isSessionPending || isLoading) {
    return (
      <LoadingModal
        isOpen={isSessionPending || isLoading}
        description="정보를 불러오는 중 입니다..."
      />
    );
  }

  if (!isSessionPending && !user) {
    notFound();
  }

  return (
    <>
      <div className="flex justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm">환영합니다, {user?.name || "User"}님</p>
        </div>

        <Button
          disabled={isPending}
          className="mt-auto cursor-pointer"
          onClick={onSignoutClick}
        >
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <LogOutIcon className="size-4" />
          )}
          로그아웃
        </Button>
      </div>

      <section className="ring-primary my-4 flex flex-1 flex-col rounded-lg px-1 py-5 ring">
        <ScrollArea className="h-[70vh] max-h-[600px] px-4">
          <ul className="space-y-3">
            {posts.map((post: PostType) => (
              <li
                key={post.id}
                className="border-primary hover:bg-secondary/40 cursor-pointer rounded-md border p-3"
                onClick={() => router.push(`/post/${post.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <>
                      <h3 className="line-clamp-1 font-semibold break-all">
                        {post.title}
                      </h3>

                      <p className="my-2 line-clamp-2 text-sm break-all whitespace-pre-wrap">
                        {post.content}
                      </p>
                      <p className="text-primary/80 mt-1 text-end text-xs">
                        by {post.author?.name}
                      </p>
                    </>
                  </div>
                </div>

                <div className="flex items-center">
                  <Button
                    disabled={isDeleteLikePending || isPostLikePending}
                    variant="ghost"
                    className="text-primary cursor-pointer gap-1"
                    onClick={(event) => onHeartToggleClick(event, post)}
                  >
                    <HeartIcon
                      className={cn(
                        "text-pink-400",
                        post.likedByMe && "fill-pink-400",
                      )}
                    />
                    {post._count?.likes ?? 0}
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-primary gap-1 hover:bg-transparent"
                  >
                    <MessageCircleIcon className="size-4" />
                    {post._count?.comments ?? 0}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </section>

      <Button
        disabled={!hasNextPage || isFetching}
        onClick={() => fetchNextPage()}
        className="w-full cursor-pointer"
      >
        {isFetching && <Loader2Icon className="size-4 animate-spin" />}
        <span className="text-base">더보기</span>
      </Button>
    </>
  );
};

export default MainComponent;
