"use client";

import z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingModal } from "@/components/common/modal/loading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCreatePostMutation } from "../_hooks/mutations/post-create-post";

const FormSchema = z.object({
  title: z.string().trim(),
  content: z.string().trim(),
});
type FormType = z.infer<typeof FormSchema>;

const MainComponent = () => {
  const router = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const { mutate, isPending } = useCreatePostMutation();

  const onSubmit = (formData: FormType) => {
    mutate(
      { title: formData.title, content: formData.content },
      {
        onSuccess: () => {
          toast.success("게시글이 등록되었습니다", { id: "success" });
          router.push("/dashboard");
        },
        onError: (error) => {
          toast.error(error.message, { id: "error" });
        },
      },
    );
  };

  return (
    <>
      {/* 로딩 모달 */}
      <LoadingModal isOpen={isPending} description="게시글을 작성중입니다..." />

      <div className="mx-auto w-full rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">게시글 작성</h2>

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
                      type="text"
                      placeholder="제목을 입력하세요..."
                      required
                      disabled={isPending}
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
                      placeholder="내용을 입력하세요..."
                      required
                      className="h-48"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="my-4 w-full cursor-pointer rounded-md px-4 py-2 text-base disabled:opacity-50"
            >
              {isPending && <Loader2Icon className="size-4 animate-spin" />}
              <span>작성하기</span>
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default MainComponent;
