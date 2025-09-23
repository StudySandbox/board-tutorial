"use client";

import z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { notFound } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PencilLineIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useGetComments } from "../_hooks/queries/get-comments";
import { usePostComment } from "../_hooks/mutations/post-comment";
import { useDeleteComment } from "../_hooks/mutations/delete-comment";

type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null; email: string };
};

interface Props {
  postId: string;
}

const CommentSkeleton = () => {
  return (
    <ul className="space-y-3">
      <Skeleton className="min-h-[72px]" />
      <Skeleton className="min-h-[72px]" />
      <Skeleton className="min-h-[72px]" />
      <Skeleton className="min-h-[72px]" />
    </ul>
  );
};

const FormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "내용을 입력하세요")
    .max(100, "100자를 초과하여 입력할 수 없습니다."),
});
type FormType = z.infer<typeof FormSchema>;

export const Comments = ({ postId }: Props) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { mutate: postCommentMutate, isPending: isPostCommentPending } =
    usePostComment();
  const { mutate: dleteCommentMutate, isPending: isDeleteCommentPending } =
    useDeleteComment();
  const { data, isLoading, isError } = useGetComments({ postId });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  });

  const userId = session?.user.id;

  const comments = data?.comments || [];

  const onSubmit = (formData: FormType) => {
    postCommentMutate(
      { postId, content: formData.content },
      {
        onSuccess: () => {
          toast.success("댓글이 등록되었습니다.", { id: "success" });
          form.reset();
          queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: (error) => {
          toast.error(error.message, { id: "error" });
        },
      },
    );
  };

  const onDeleteClick = (comment: CommentType) => {
    if (userId !== comment.author.id) return;
    dleteCommentMutate(
      { postId, commentId: comment.id },
      {
        onSuccess: () => {
          toast.success("댓글이 삭제되었습니다.", { id: "success" });
          queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: (error) => {
          toast.error(error.message, { id: "error" });
        },
      },
    );
  };

  if (!isLoading && isError) {
    notFound();
  }

  return (
    <section className="ring-primary mt-8 rounded-lg px-1 py-4 ring">
      <Form {...form}>
        <form className="mb-6 px-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Textarea
                    disabled={
                      isPostCommentPending ||
                      isDeleteCommentPending ||
                      isLoading
                    }
                    maxLength={100}
                    placeholder="댓글을 입력하세요"
                    className="max-h-[180px] min-h-[72px] resize-none overflow-auto"
                    required
                    {...field}
                  />
                </FormControl>

                <div
                  className={cn(
                    "flex px-1",
                    fieldState.error ? "justify-between" : "justify-end",
                  )}
                >
                  <FormMessage />
                  <p className="text-xs">{field.value.length}/100</p>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              disabled={
                isPostCommentPending || isDeleteCommentPending || isLoading
              }
              className="mt-2 cursor-pointer"
              type="submit"
              variant="outline"
            >
              <PencilLineIcon className="text-primary size-4" />
              <span className="text-primary">작성하기</span>
            </Button>
          </div>
        </form>
      </Form>

      <ScrollArea className="px-3">
        {isLoading ? (
          <CommentSkeleton />
        ) : (
          <ul className="space-y-3 p-1">
            {comments.map((comment: CommentType) => (
              <li
                key={comment.id}
                className="ring-input shadow-primary min-h-[72px] rounded-md p-3 shadow-md ring"
              >
                <div>
                  <div className="w-full ">
                    <p className="text-primary break-all whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    <p className="text-primary mt-2  text-end text-xs">
                      by {comment.author.name}
                    </p>
                  </div>
                </div>
                {userId === comment.author.id && (
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={
                        isPostCommentPending ||
                        isDeleteCommentPending ||
                        isLoading
                      }
                      onClick={() => onDeleteClick(comment)}
                      className="size-8 cursor-pointer"
                    >
                      {isDeleteCommentPending ? (
                        <Loader2Icon className="size-4 animate-spin" />
                      ) : (
                        <Trash2Icon className="size-4" />
                      )}
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </section>
  );
};
