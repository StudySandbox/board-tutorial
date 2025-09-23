import { useMutation } from "@tanstack/react-query";

type ParametersType = {
  postId: string;
};

const fetchPostLike = async ({ postId }: ParametersType) => {
  const response = await fetch(`/api/posts/${postId}/likes`, {
    method: "POST",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json;
};

export const usePostLikeMutation = () => {
  const mutation = useMutation({
    mutationFn: fetchPostLike,
  });

  return mutation;
};
