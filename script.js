let movielist = document.getElementById("movielist");
let movieinfo = document.getElementById("movieinfo");

function getMovieList() {
    fetch("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc", {
        method: "GET",
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGQ2ZjkwNmIzODZhYzQ3YzAwNDcwMWQ4ZjU0NWRmOCIsIm5iZiI6MTcwNDM2MjAwNC4zODksInN1YiI6IjY1OTY4MDE0ZWEzN2UwMDZmYTRjYWQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fAIGy5BaC3YiG8Y8WMLb3GSnG9eSm4h4OKMbQHC-pu0"
        }
    })
    .then(res => res.json())
    .then(data => {
        printMovieList(data.results);
    });
}

function printMovieList(movies) {
    movies.map(movie => { 
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

    let img = document.createElement("img");
    img.src = "http://image.tmdb.org/t/p/w500" + movie.poster_path; 

    movieinfo.appendChild(h3);
    movieinfo.appendChild(p);
    movieinfo.appendChild(img);
    
}

getMovieList();