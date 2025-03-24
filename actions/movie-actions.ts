"use server";

import { createServerSupabaseClient } from "utils/supabase/server";
import { Database } from "types_db";

export type Movie = Database["public"]["Tables"]["movie"]["Row"];
type MovieUpdate = Database["public"]["Tables"]["movie"]["Update"];

function handleError(error: Error) {
  if (error) {
    console.error(error);
    throw error;
  }
}

export async function updateMovie(movie: MovieUpdate) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("movie")
    .update({
      ...movie,
    })
    .eq("id", movie.id);

  handleError(error);
}

function getRange(favoriteCount: number, page: number, pageSize: number) {
  const start = (page - 1) * pageSize; // 현재 페이지의 시작 인덱스
  const end = start + pageSize - 1; // 현재 페이지의 마지막 인덱스

  const favStart = start < favoriteCount ? start : favoriteCount;
  const favEnd = Math.min(end, favoriteCount - 1);
  const favLength = Math.max(favEnd - favStart + 1, 0);

  const remStart = Math.max(0, start - favoriteCount);
  const remEnd = remStart + (pageSize - favLength) - 1;
  const remLength = Math.max(remEnd - remStart + 1, 0);

  return {
    favoriteRange: favLength > 0 ? [favStart, favEnd] : [],
    remainRange: remLength > 0 ? [remStart, remEnd] : [],
  };
}

async function searchMoviesByFavorite(
  search: string,
  range: number[],
  isFavorite: boolean
) {
  if (range.length === 0) {
    return [];
  }
  const [start, end] = range;

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .like("title", `%${search}%`)
    .eq("favorite", isFavorite)
    .order("id")
    .range(start, end);

  handleError(error);

  return data;
}

export async function searchMovies({
  search,
  page,
  pageSize,
  favoriteCount,
}: {
  search: string;
  page: number;
  pageSize: number;
  favoriteCount: number;
}) {
  const { favoriteRange, remainRange } = getRange(
    favoriteCount,
    page,
    pageSize
  );
  const [favoriteMovies, remainMovies] = await Promise.all([
    searchMoviesByFavorite(search, favoriteRange, true),
    searchMoviesByFavorite(search, remainRange, false),
  ]);

  const data = [...favoriteMovies, ...remainMovies];

  return {
    data,
    page,
    pageSize,
    hasNextPage: data.length === pageSize,
  };
}

export async function getMovie(id: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movie")
    .select()
    .eq("id", id)
    .maybeSingle();

  handleError(error);

  return data;
}
