import { useEffect, useState } from "react";
import "./App.css";
import { NavBar } from "./component/NavBar";
import { Search } from "./component/Search";
import { NumResults } from "./component/NumResults";
import { Main } from "./component/Main";
import { Box } from "./component/Box";
import { Loading } from "./component/Loading";
import { MovieList } from "./component/MovieList";
import { Error } from "./component/Error";
import { StartRating } from "./component/StartRating";
import { WatchedMoviesList } from "./component/WatchedMoviesList";
import { WatchedSummary } from "./component/WatchedSummary";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const key = "452d9fe";
// !...............................................................................................................
export default function AppUsePopcom() {
  const [watched, setWatched] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedID, setSelectedId] = useState(null);
  //!..................................................................................................*//////////////////////// */
  function HandelSelectedMovieId(id) {
    setSelectedId((selectedID) => (selectedID === id ? null : id));
  }
  function CloseMovie() {
    setSelectedId(null);
  }
  function HandelAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handelDeleteMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  //!..................................................................................................*//////////////////////// */

  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        setIsloading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Error fetching movies  ");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
        setIsloading(false);
        setError("");
      } catch (error) {
        console.error(error.message);
        if (error.name !== "AbortError") setError(error);
      } finally {
        setIsloading(false);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      setError();
      return;
    }
    fetchMovies();

    return () => controller.abort();
  }, [query]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isloading && <Loading />}
          {!isloading && !error && (
            <MovieList
              movies={movies}
              HandelSelectedMovieId={HandelSelectedMovieId}
            />
          )}
          {error && <Error error={error} />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetials
              selectedID={selectedID}
              OnCloseMovie={CloseMovie}
              HandelAddWatched={HandelAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                handelDeleteMovie={handelDeleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetials({ watched, selectedID, OnCloseMovie, HandelAddWatched }) {
  const [movie, setMovie] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Rated: rated,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Director: director,
    Actors: actors,
    Plot: plot,
    Language: language,
    Country: contery,
    Poster: poster,
    imdbRating,
  } = movie;
  function handelAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      poster,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    HandelAddWatched(newWatchedMovie);
    OnCloseMovie();
  }
  // !...............................................................................
  useEffect(() => {
    const getMovieDetials = async () => {
      try {
        setIsloading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedID}`
        );
        const data = await res.json();
        // console.log(data);
        setMovie(data);
        setIsloading(false);
      } catch {
        console.log("error");
      }
    };
    getMovieDetials();
  }, [selectedID]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => {
      //@must  is return >>>  function
      document.title = "usePopcorn";
      console.log(`clean up  effect for movies ${title}`);
    };
  }, [title]);

  useEffect(() => {
    function callback(e) {
      if (e.code == "Backspace") OnCloseMovie();
      console.log("clean");
    }
    document.addEventListener("keydown", callback);

    return () => document.removeEventListener("keydown", callback);
  }, [OnCloseMovie]);

  return (
    <div className="details">
      {isloading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={OnCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released}-{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟 </span>
                {imdbRating} IMBD Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!iswatched ? (
                <>
                  <StartRating
                    maxRating={10}
                    size={24}
                    defultRating={+imdbRating}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handelAdd}>
                      + Add to list watched
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} ⭐️ </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>starting {actors}</p>
            <p>Director by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

