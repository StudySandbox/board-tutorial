"use client";

import z from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

import { signUp, useSession } from "@/lib/auth-client";

const FormSchema = z
  .object({
    email: z
      .email("이메일을 입력해주세요")
      .trim()
      .max(50, "50자 이상 입력할 수 없습니다"),
    nickname: z
      .string()
      .trim()
      .min(1, "닉네임을 입력해주세요")
      .regex(/^[A-Za-z가-힣]+$/, "영문 또는 한글만 입력하세요.")
      .min(2, "2자이상 입력해주세요")
      .max(20, "20자이상 입력할 수 없습니다"),
    password: z
      .string()
      .trim()
      .min(1, "비밀번호를 입력하세요")
      .min(8, "8자 이상 입력하세요")
      .max(50, "50자 이상 입력할 수 없습니다"),
    confirm: z
      .string()
      .trim()
      .min(1, "비밀번호 확인을 입력하세요")
      .min(8, "8자 이상 입력하세요")
      .max(50, "50자 이상 입력할 수 없습니다"),
  })
  .refine((data) => data.password === data.confirm, {
    error: "비밀번호와 일치하지 않습니다",
    path: ["confirm"],
  });

// 회원가입 폼 타입
type FormType = z.infer<typeof FormSchema>;

// 메인 컴포넌트
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
      nickname: "",
      password: "",
      confirm: "",
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
      await signUp.email(
        {
          email: formData.email,
          name: formData.nickname,
          password: formData.password,
        },
        {
          onSuccess: () => {
            toast.success("회원가입되었습니다.", { id: "success" });
            router.push("/dashboard");
          },
          onError: ({ error }) => {
            toast.error("회원가입에 실패했습니다.", { id: "error" });
            if (error.status === 422) {
              setError("이미 등록된 이메일입니다.");
              return;
            }

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
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={20}
                      type="text"
                      placeholder="닉네임을 입력하세요"
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

            <FormField
              control={form.control}
              disabled={isPending}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
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
                회원가입
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="justify-end">
        <p className="text-muted-foreground text-xs">
          가입하신 이메일이 있으신가요?
        </p>

        <Button
          disabled={isPending}
          className="cursor-pointer px-2 text-xs"
          variant="link"
          onClick={() => router.push("/sign-in")}
        >
          로그인
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MainComponent;
