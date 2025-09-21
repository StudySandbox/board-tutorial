"use client";

import { useTransition } from "react";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { notFound, useRouter } from "next/navigation";

import { signOut, useSession } from "@/lib/auth-client";
import { useGetPosts } from "../_hooks/queries/get-posts";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingModal } from "@/components/common/modal/loading";

const MainComponent = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    data: postData,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetPosts();

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
            {posts.map((post) => (
              <li
                key={post.id}
                className="border-primary hover:bg-secondary/40 cursor-pointer rounded-md border p-3"
                onClick={() => router.push(`/post/${post.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
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
