"use client";

import MovieCard from "./movie-card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchMovies } from "actions/movie-actions";
import { Spinner } from "@material-tailwind/react";
import { useRecoilValue } from "recoil";
import { searchState } from "utils/recoil/atoms";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

// function missingNumbers(arr: number[]): number[] {
//   const allNumbers = new Set([...Array(140)].map((_, i) => i + 1));
//   arr.forEach((num) => allNumbers.delete(num));
//   return Array.from(allNumbers);
// }

export default function MovieCardList({
  favoriteCount,
}: {
  favoriteCount: number;
}) {
  const search = useRecoilValue(searchState);

  const pageSize = 12;

  const { data, isFetchingNextPage, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ["movie", search],
      queryFn: ({ pageParam }) =>
        searchMovies({
          search,
          pageSize,
          page: pageParam,
          favoriteCount,
        }),
      getNextPageParam: (lastPage) => {
        if (lastPage.data.length < pageSize) {
          return null;
        }
        return lastPage.page ? lastPage.page + 1 : null;
      },
    });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && !isFetchingNextPage) {
      console.log("next", hasNextPage);
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-1 w-full h-full">
      {
        <>
          {data?.pages
            ?.map((page) => page.data)
            ?.flat()
            ?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          <div ref={ref} className="h-px" />
        </>
      }
      {(isFetching || isFetchingNextPage) && (
        <div className="flex justify-center items-center col-span-3 md:col-span-4 py-20">
          <Spinner />
        </div>
      )}
    </div>
  );
}
