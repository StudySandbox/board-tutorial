"use client";

import { Dispatch, MouseEvent, SetStateAction } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletePost } from "../../_hooks/mutations/delete-post";
import { Loader2Icon, Trash2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  postId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteConfirmModal = ({ isOpen, setIsOpen, postId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useDeletePost();

  const onDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    mutate(
      { postId },
      {
        onSuccess: () => {
          toast.success("게시글이 삭제되었습니다.", { id: "success" });
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: ["posts"] });
          router.replace("/dashboard");
        },
        onError: (error) => {
          toast.error(error.message, { id: "error" });
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>게시글을 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            삭제된 게시글은 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="cursor-pointer">
            <XIcon className="size-4" />
            <span>닫기</span>
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="cursor-pointer"
            onClick={onDeleteClick}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
            <span>삭제</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
