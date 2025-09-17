"use client";

import { useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { notFound, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { signOut, useSession } from "@/lib/auth-client";

const MainComponent = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { data: session, isPending: isSessionPending } = useSession();
  const user = session?.user;

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

  if (isSessionPending) {
    return <div>Loading...</div>;
  }

  if (!isSessionPending && !user) {
    notFound();
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-neutral-300">
          환영합니다, {user?.name || "User"}님
        </p>
      </div>

      <Button
        disabled={isPending}
        className="cursor-pointer"
        onClick={onSignoutClick}
      >
        {isPending && <Loader2Icon className="size-4 animate-spin" />}
        로그아웃
      </Button>
    </>
  );
};

export default MainComponent;
