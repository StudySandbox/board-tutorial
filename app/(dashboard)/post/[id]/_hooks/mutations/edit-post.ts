import { useMutation } from "@tanstack/react-query";

type ParametersType = {
  id: string;
  title: string;
  content: string;
};

const fetchPatchEditPost = async ({ title, content, id }: ParametersType) => {
  const response = await fetch(`/api/posts/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      title,
      content,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json;
};

export const useEditPostMutation = () => {
  const mutation = useMutation({ mutationFn: fetchPatchEditPost });

  return mutation;
};
