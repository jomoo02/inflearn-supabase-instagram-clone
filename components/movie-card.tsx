import Link from "next/link";
import type { Movie } from "actions/movie-actions";
import MovieFavoriteIcon from "./movie-favorite-icon";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="col-span-1 relative">
      <img src={movie.image_url} className="w-full" />

      <Link href={`/movies/${movie.id}`}>
        <div className="absolute top-0 right-0 px-1.5 py-2">
          <MovieFavoriteIcon favorite={movie.favorite} />
        </div>
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex justify-center items-center bg-black opacity-0 hover:opacity-80 transition-opacity duration-300">
          <p className="text-xl font-bold text-white">{movie.title}</p>
        </div>
      </Link>
    </div>
  );
}
