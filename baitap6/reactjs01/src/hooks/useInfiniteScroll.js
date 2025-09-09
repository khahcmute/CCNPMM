import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";

export const useInfiniteScroll = ({
  hasNextPage,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = "100px",
}) => {
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      onLoadMore(nextPage);
    }
  }, [hasNextPage, isLoading, page, onLoadMore]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    ref,
    page,
    resetPage,
    loadMore,
  };
};
