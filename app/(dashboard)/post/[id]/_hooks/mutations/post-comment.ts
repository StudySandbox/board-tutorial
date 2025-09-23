import { useMutation } from "@tanstack/react-query";

type ParametersType = {
  postId: string;
  content: string;
};

const fetchPostComment = async ({ postId, content }: ParametersType) => {
  const response = await fetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json;
};

export const usePostComment = () => {
  const mutation = useMutation({
    mutationFn: fetchPostComment,
  });

  return mutation;
};
