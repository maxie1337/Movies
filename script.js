let movielist = document.getElementById("movielist");
let movieinfo = document.getElementById("movieinfo");
let genreList = [];

function getMovieList() {
  fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
    {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGQ2ZjkwNmIzODZhYzQ3YzAwNDcwMWQ4ZjU0NWRmOCIsIm5iZiI6MTcwNDM2MjAwNC4zODksInN1YiI6IjY1OTY4MDE0ZWEzN2UwMDZmYTRjYWQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fAIGy5BaC3YiG8Y8WMLb3GSnG9eSm4h4OKMbQHC-pu0",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      allMovies = data.results;
      printMovieList(data.results);
    });
}

function getGenreList() {
  fetch("https://api.themoviedb.org/3/genre/movie/list?language=en-US", {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGQ2ZjkwNmIzODZhYzQ3YzAwNDcwMWQ4ZjU0NWRmOCIsIm5iZiI6MTcwNDM2MjAwNC4zODksInN1YiI6IjY1OTY4MDE0ZWEzN2UwMDZmYTRjYWQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fAIGy5BaC3YiG8Y8WMLb3GSnG9eSm4h4OKMbQHC-pu0",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      genreList = data.genres;
      printGenres(genreList);
    });
}

function printGenres(genres) {
  let genreList = document.getElementById("genrelist");
  genreList.innerHTML = "";
  genres.forEach((genre) => {
    let button = document.createElement("button");
    button.innerText = genre.name;
    button.addEventListener("click", () => filterMoviesByGenre(genre.id));
    genreList.appendChild(button);
  });
}

function filterMoviesByGenre(genreId) {
  let filteredMovies = allMovies.filter((movie) =>
    movie.genre_ids.includes(genreId)
  );
  printMovieList(filteredMovies);
}

function printMovieList(movies) {
  movielist.innerHTML = "";
  movies.map((movie) => {
    let li = document.createElement("li");
    li.innerText = movie.original_title;
    li.addEventListener("click", () => printMovieDetails(movie));
    movielist.appendChild(li);
  });
}

function printMovieDetails(movie) {
  movieinfo.innerHTML = "";

  let h3 = document.createElement("h3");
  h3.innerText = movie.original_title;

  let p = document.createElement("p");
  p.innerText = movie.overview;

  let genreNames = movie.genre_ids
    .map((genreId) => {
      let genre = genreList.find((g) => g.id == genreId);
      return genre ? genre.name : "Unknown genre";
    })
    .join(", ");

  let genre = document.createElement("h4");
  genre.innerText = "Genres: " + genreNames;

  let img = document.createElement("img");
  img.src = "http://image.tmdb.org/t/p/w500" + movie.poster_path;

  const voteAverageCard = createVoteAverageCard(movie.vote_average);

  watchListButton(movie);

  movieinfo.appendChild(h3);
  movieinfo.appendChild(p);
  movieinfo.appendChild(genre);
  movieinfo.appendChild(img);
  movieinfo.appendChild(voteAverageCard);
}

function watchListButton(movie) {
  let button = document.createElement("button");
  button.innerText = "Add to watchlist";

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (watchlist.some((item) => item.id === movie.id)) {
    button.innerText = "Remove from watchlist";
  } else {
    button.innerText = "Add to watchlist";
  }

  button.addEventListener("click", () => addMovieToLocalStorage(button, movie));

  movieinfo.appendChild(button);
}

function addMovieToLocalStorage(button, movie) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const alreadyListed = watchlist.findIndex((item) => item.id === movie.id);
  if (alreadyListed !== -1) {
    watchlist.splice(alreadyListed, 1);
    button.innerText = "Add to watchlist";
  } else {
    watchlist.push(movie);
    button.innerText = "Remove from watchlist";
  }

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

const createVoteAverageCard = (voteAverage) => {
  const card = document.createElement("div");
  card.classList.add("vote-average-card");
  card.innerHTML = `
  <div class="vote-average-card__text">Rating</div>
  <div class="vote-average-card__rating">${voteAverage}</div>
  `;

  if (voteAverage >= 7) {
    // Green
    card.style.backgroundColor = "#79ff79";
  } else if (voteAverage >= 4) {
    // Yellow
    card.style.backgroundColor = "#fbff79";
  } else if (voteAverage === 0) {
    // Grey
    card.style.backgroundColor = "#c8c8c8";
  } else {
    // Red
    card.style.backgroundColor = "#ff7979";
  }

  return card;
};

getGenreList();
getMovieList();
