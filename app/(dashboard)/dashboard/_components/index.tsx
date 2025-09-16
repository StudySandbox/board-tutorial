"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const MainComponent = () => {
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  // 로그인 상태 아닐경우 로그인 페이지로 이동
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in");
    }
  }, [isPending, user, router]);

  return (
    <>
      <div>Main Component</div>
      <Button className="cursor-pointer" onClick={() => signOut()}>
        로그아웃
      </Button>
    </>
  );
};

export default MainComponent;
