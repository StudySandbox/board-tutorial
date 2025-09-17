// Dashboard Group Layout

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
}

const DashboardGroupLayout = async ({ children }: Props) => {
  // 유저 세션
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return <>{children}</>;
};

export default DashboardGroupLayout;
