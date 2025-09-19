import { useMutation } from "@tanstack/react-query";

type ParametersType = {
  title: string;
  content: string;
};

const fetchPostCreatePost = async ({ title, content }: ParametersType) => {
  const response = await fetch("/api/posts", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      title,
      content,
    }),
  });

  const json = await response.json();

  return json.data;
};

export const useCreatePostMutation = () => {
  const mutation = useMutation({ mutationFn: fetchPostCreatePost });

  return mutation;
};
