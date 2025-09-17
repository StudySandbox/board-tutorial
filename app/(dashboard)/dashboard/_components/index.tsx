"use client";

import { useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const MainComponent = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  return (
    <>
      <div>Main Component</div>
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
