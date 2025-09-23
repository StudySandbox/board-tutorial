import { useMutation } from "@tanstack/react-query";

type ParametersType = {
  postId: string;
  commentId: string;
};

const fetchDeleteComment = async ({ postId, commentId }: ParametersType) => {
  const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json;
};

export const useDeleteComment = () => {
  const mutation = useMutation({
    mutationFn: fetchDeleteComment,
  });

  return mutation;
};
