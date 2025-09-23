import { useQuery } from "@tanstack/react-query";

type ParametersType = {
  postId: string;
};

const fetchComments = async ({ postId }: ParametersType) => {
  const response = await fetch(`/api/posts/${postId}/comments`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }
  return json;
};

export const useGetComments = ({ postId }: ParametersType) => {
  const query = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments({ postId }),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5분
  });

  return query;
};
