"use client";

import z from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { signIn, useSession } from "@/lib/auth-client";

const FormSchema = z.object({
  email: z
    .email("이메일을 입력해주세요")
    .trim()
    .max(50, "50자 이상 입력할 수 없습니다"),
  password: z
    .string()
    .trim()
    .min(1, "비밀번호를 입력하세요")
    .min(8, "8자 이상 입력하세요")
    .max(50, "50자 이상 입력할 수 없습니다"),
});

// 폼 타입
type FormType = z.infer<typeof FormSchema>;

const MainComponent = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const { data: session, isPending: isSessionPending } = useSession();
  const user = session?.user;

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 로그인 상태일 경우 대시보드 페이지로 이동
  useEffect(() => {
    if (!isSessionPending && !!user) {
      router.replace("/dashboard");
    }
  }, [isSessionPending, user, router]);

  const onSubmit = (formData: FormType) => {
    startTransition(async () => {
      await signIn.email(
        {
          email: formData.email,
          password: formData.password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {},
          onError: ({ error }) => {
            console.log(error);
            if (error.status === 401) {
              toast.error("이메일 또는 비밀번호가 잘못 되었습니다.", {
                id: "error",
              });
              setError("이메일 또는 비밀번호가 잘못 되었습니다.");
              return;
            }

            toast.error(error.message, { id: "error" });
            setError(error.message);
          },
        },
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary flex scroll-m-20 justify-center gap-2 text-2xl font-bold tracking-tight">
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          프롬프트 저장소
        </CardTitle>
        <CardDescription className="text-center font-bold text-red-400">
          {error}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={isPending}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={100}
                      type="email"
                      placeholder="이메일을 입력하세요"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              disabled={isPending}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      minLength={8}
                      maxLength={50}
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-8">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer"
              >
                {isPending && <Loader2Icon className="size-4 animate-spin" />}
                로그인
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="justify-end">
        <p className="text-muted-foreground text-xs">처음 방문하셨나요?</p>

        <Button
          disabled={isPending}
          className="cursor-pointer px-2 text-xs"
          variant="link"
          onClick={() => router.push("/sign-up")}
        >
          회원가입
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MainComponent;
