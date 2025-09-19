import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  description: string;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export const LoadingModal = ({ isOpen, setIsOpen, description }: Props) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="flex aspect-square w-[240px] items-center justify-center">
        <AlertDialogHeader className="flex flex-col items-center gap-6">
          <AlertDialogTitle className="inline-flex gap-1">
            <Image src="/logo.svg" alt="logo" width={16} height={16} />
            <span className="text-primary">프롬프트 저장소</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col items-center gap-6">
            <Loader2Icon className="text-primary size-20 animate-spin" />
            <span className="animate-pulse text-sm">{description}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
