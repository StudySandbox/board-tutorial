import { useQuery } from "@tanstack/react-query";

type ParametersType = {
  postId: string;
};

const fetchPost = async ({ postId }: ParametersType) => {
  const response = await fetch(`/api/posts/${postId}`);

  const json = await response.json();

  return json;
};

export const useGetPost = ({ postId }: ParametersType) => {
  const query = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost({ postId }),
    enabled: !!postId,
    staleTime: Infinity,
  });

  return query;
};
