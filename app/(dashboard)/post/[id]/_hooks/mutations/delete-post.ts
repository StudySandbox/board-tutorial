import { useMutation } from "@tanstack/react-query";

type ParametersType = {
  postId: string;
};

const fetchDeletePost = async ({ postId }: ParametersType) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
  });

  const json = response.json();

  return json;
};

export const useDeletePost = () => {
  const mutation = useMutation({ mutationFn: fetchDeletePost });

  return mutation;
};
