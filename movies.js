const API_KEY = "b372aa9e39b19d959df05fbe983a5b0e"; // ENTER YOUR API KEY HERE
const API_LINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280"; // static path for the cover image for movies
const API_QUERY = `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=`; // base query for moviedb api

const mainSection = document.getElementById("movies-section");
const form = document.getElementById("form");
const searchValue = document.getElementById("query");

movieSearch(API_LINK); // returns the latest movie list from the API

function movieSearch(url) {
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      console.log(data.results); // debugging
      data.results.forEach((element) => {
        const div_row = document.createElement("div");
        div_row.className = "row";
        const div_column = document.createElement("div");
        div_column.className = "column";
        const div_card = document.createElement("div");
        div_card.className = "card";
        const center = document.createElement("center");
        const image = document.createElement("img");
        image.className = "thumbnail";
        const title = document.createElement("h3");
        title.className = "movie-title";

        // assigning values
        image.src = IMG_PATH + element.poster_path;
        title.innerHTML = `${element.title}`;

        // structuring the movie cards
        center.appendChild(image);
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);

        // adding movie cards to the main section
        mainSection.appendChild(div_row);
      });
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  mainSection.innerHTML = "";

  const searchItem = searchValue.value;

  if (searchItem) {
    movieSearch(API_QUERY + searchItem);
    searchValue.value = "";
  } else {
    alert("Please enter a movie title");
  }
});
