import { useInfiniteQuery } from "@tanstack/react-query";

type parameterType = {
  pageParam: number;
  pageSize: number;
};

const fetchPosts = async ({ pageParam, pageSize }: parameterType) => {
  const queryObject: Record<string, string> = {
    page: pageParam.toString(),
    pageSize: pageSize.toString(),
  };
  const queryParams = new URLSearchParams(queryObject).toString();
  const response = await fetch(`/api/posts?${queryParams}`);
  const json = await response.json();

  return json;
};

export const useGetPosts = () => {
  const INITIAL_PAGE_SIZE = 20;

  const query = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: (props) => fetchPosts({ ...props, pageSize: INITIAL_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (response) => {
      if (!response) return;

      // 다음페이지가 있는지 확인
      const lastPage =
        response.page + 1 <= Math.ceil(response.total / response.pageSize);

      if (lastPage) {
        return response.page + 1;
      }

      return undefined;
    },
  });

  return query;
};
