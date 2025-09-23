import { useMutation } from "@tanstack/react-query";

type ParametersType = {
  postId: string;
};

const fetchDeleteLike = async ({ postId }: ParametersType) => {
  const response = await fetch(`/api/posts/${postId}/likes`, {
    method: "DELETE",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json;
};

export const useDeleteLikeMutation = () => {
  const mutation = useMutation({
    mutationFn: fetchDeleteLike,
  });

  return mutation;
};
