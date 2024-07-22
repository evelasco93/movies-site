const API_KEY = ""; // ENTER YOUR API KEY HERE
const API_LINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280"; 
const API_QUERY = `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=`; 

const mainSection = document.getElementById("movies-section");
const form = document.getElementById("form");
const searchValue = document.getElementById("query");

document.addEventListener("DOMContentLoaded", () => movieSearch(API_LINK)); 

async function movieSearch(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayMovies(movies) {
  mainSection.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    mainSection.appendChild(movieCard);
  });
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "card";

  const image = document.createElement("img");
  image.className = "thumbnail";
  image.src = `${IMG_PATH}${movie.poster_path}`;

  const title = document.createElement("a");
  title.className = "movie-title";
  title.href = `movie.html?id=${movie.id}&title=${movie.title}`;
  title.textContent = movie.title;

  card.appendChild(image);
  card.appendChild(title);

  return card;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchItem = searchValue.value.trim();

  if (searchItem) {
    movieSearch(API_QUERY + searchItem);
    searchValue.value = "";
  } else {
    alert("Please enter a movie title");
  }
});
