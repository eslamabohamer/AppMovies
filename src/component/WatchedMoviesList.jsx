import { WatchedMovie } from "./WatchedMovie";

export function WatchedMoviesList({ watched, handelDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDelete={handelDeleteMovie}
        />
      ))}
    </ul>
  );
}
