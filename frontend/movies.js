const API_KEY = ""; // ENTER YOUR API KEY HERE
const API_LINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280"; // static path for the cover image for movies
const API_QUERY = `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=`; // base query for moviedb api

const mainSection = document.getElementById("movies-section");
const form = document.getElementById("form");
const searchValue = document.getElementById("query");

document.addEventListener('DOMContentLoaded', () => movieSearch(API_LINK)); // returns the latest movie list from the API

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
  mainSection.innerHTML = '';
  movies.forEach(movie => {
    const movieCard = createMovieCard(movie);
    mainSection.appendChild(movieCard);
  });
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "card";

  const center = document.createElement("center");
  const image = document.createElement("img");
  image.className = "thumbnail";
  image.src = `${IMG_PATH}${movie.poster_path}`;
  
  const title = document.createElement("h3");
  title.className = "movie-title";
  title.textContent = movie.title;

  center.appendChild(image);
  card.appendChild(center);
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
