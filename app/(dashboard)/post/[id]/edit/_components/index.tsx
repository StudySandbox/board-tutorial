"use client";

import z from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, Loader2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingModal } from "@/components/common/modal/loading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useGetPost } from "../../_hooks/queries/get-post";
import { useEditPostMutation } from "../../_hooks/mutations/edit-post";

interface Props {
  postId: string;
}

const FormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력하세요")
    .max(30, "30자를 초과하여 입력할 수 없습니다."),
  content: z
    .string()
    .trim()
    .min(1, "내용을 입력하세요")
    .max(500, "500자를 초과하여 입력할 수 없습니다."),
});
type FormType = z.infer<typeof FormSchema>;

const MainComponent = ({ postId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useEditPostMutation();
  const { data, isLoading, isError } = useGetPost({ postId });

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (formData: FormType) => {
    mutate(
      {
        id: postId,
        title: formData.title,
        content: formData.content,
      },
      {
        onSuccess: () => {
          toast.success("게시글이 수정되었습니다.", { id: "success" });
          queryClient.invalidateQueries({ queryKey: ["post"] });
          queryClient.invalidateQueries({ queryKey: ["post"] });
        },
        onError: (error) => {
          toast.error(error.message, { id: "error" });
        },
      },
    );
  };

  useEffect(() => {
    if (!isLoading && !!data.post) {
      form.reset({
        title: data.post.title,
        content: data.post.content,
      });
    }
  }, [isLoading, data?.post, form]);

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

  return (
    <>
      {/* 로딩 모달 */}
      <LoadingModal isOpen={isPending} description="게시글을 수정중입니다..." />

      <div className="mb-4">
        <Button
          variant="link"
          className="cursor-pointer has-[>svg]:px-0"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon className="size-4" />
          <span>돌아가기</span>
        </Button>
      </div>

      <div className="mx-auto w-full rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">게시글 수정</h2>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={30}
                      type="text"
                      placeholder="제목을 입력하세요..."
                      disabled={isPending}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea
                      maxLength={500}
                      placeholder="내용을 입력하세요..."
                      className="h-48"
                      disabled={isPending}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!form.formState.isDirty}
              className="my-4 w-full cursor-pointer rounded-md px-4 py-2 text-base disabled:opacity-50"
            >
              {isPending && <Loader2Icon className="size-4 animate-spin" />}
              <span>수정하기</span>
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default MainComponent;
