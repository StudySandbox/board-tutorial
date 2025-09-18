"use client";

import z from "zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  title: z.string().trim(),
  content: z.string().trim(),
});
type FormType = z.infer<typeof FormSchema>;

const MainComponent = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (formData: FormType) => {};

  return (
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
            작성하기
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MainComponent;
