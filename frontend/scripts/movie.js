const API_KEY = ""; // ENTER YOUR API KEY HERE
const BASE_API_LINK = `https://api.themoviedb.org/3/movie/`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const REVIEWS_API = "http://localhost:3000/api/v1/reviews/";
const mainSection = document.getElementById("movie-details");

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  const movieTitle = urlParams.get("title");
  if (movieId) {
    document.title = movieTitle;
    const movieApiLink = `${BASE_API_LINK}${movieId}?api_key=${API_KEY}`;
    movieSearch(movieApiLink, movieId);
  } else {
    console.error("Movie ID not found in URL");
  }
});

async function movieSearch(url, movieId) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const movieInfo = createMovieInfo(data, movieId);
    mainSection.appendChild(movieInfo);
    await movieReviews(REVIEWS_API, movieId);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function createMovieInfo(movie, movieId) {
  const wrapper = document.createElement("div");
  wrapper.className = "movie-wrapper";

  const movieContainer = document.createElement("div");
  movieContainer.className = "movie-container";

  const poster = document.createElement("div");
  poster.className = "poster";

  const image = document.createElement("img");
  image.className = "poster-image";
  image.src = `${IMG_PATH}${movie.poster_path}`;

  const movieDetails = document.createElement("div");
  movieDetails.className = "movie-details";

  const title = document.createElement("h3");
  title.className = "title";
  title.textContent = movie.title;

  const rating = document.createElement("p");
  rating.className = "movie-rating";
  const ratingValue = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  rating.innerHTML = ratingValue ? `<strong>Rating:</strong> ${ratingValue} <span class="star">★</span>` : "<strong>Rating:</strong> -";

  const overview = document.createElement("p");
  overview.className = "movie-overview";
  overview.textContent = movie.overview;

  const genres = getGenres(movie.genres);

  const addReviewButton = document.createElement("button");
  addReviewButton.className = "add-review-button";
  addReviewButton.textContent = "Add Review";
  addReviewButton.addEventListener("click", () => openReviewModal(movieId));

  poster.appendChild(image);
  movieDetails.appendChild(title);
  movieDetails.appendChild(rating);
  movieDetails.appendChild(overview);
  movieDetails.appendChild(genres);
  movieDetails.appendChild(addReviewButton);
  movieContainer.appendChild(poster);
  movieContainer.appendChild(movieDetails);
  wrapper.appendChild(movieContainer);

  return wrapper;
}

function getGenres(tags) {
  const genres = document.createElement("div");
  genres.className = "genres";

  for (let tag of tags) {
    const genre = document.createElement("span");
    genre.className = "genre-tag";
    genre.textContent = tag.name;
    genres.appendChild(genre);
  }
  return genres;
}

async function movieReviews(url, movieId) {
  try {
    const res = await fetch(`${url}movie/${movieId}`);
    const data = await res.json();
    console.log(data);

    if (data.length > 0) {
      const reviewsTitle = document.createElement("h2");
      reviewsTitle.className = "reviews-title";
      reviewsTitle.textContent = "Reviews";
      mainSection.appendChild(reviewsTitle);
    }

    for (const review of data) {
      const reviewContainer = document.createElement("div");
      reviewContainer.className = "review-container";
      reviewContainer.id = review._id;

      const user = document.createElement("p");
      user.className = "review-user";
      user.innerHTML = `<strong>${review.user}</strong> <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>`;

      const reviewText = document.createElement("p");
      reviewText.className = "review-text";
      reviewText.textContent = decodeURIComponent(review.review);
      reviewText.contentEditable = false;

      const iconsContainer = document.createElement("div");
      iconsContainer.className = "icons-container";

      const editIcon = document.createElement("span");
      editIcon.className = "edit-icon";
      editIcon.innerHTML = "✏️";
      editIcon.addEventListener("click", () => enableEditing(reviewText, updateButton, cancelButton, iconsContainer));

      const deleteIcon = document.createElement("span");
      deleteIcon.className = "delete-icon";
      deleteIcon.innerHTML = "🗑️"; 
      deleteIcon.addEventListener("click", () => confirmDeleteReview(review._id));

      const updateButton = document.createElement("button");
      updateButton.className = "update-button";
      updateButton.textContent = "Update";
      updateButton.style.display = "none";
      updateButton.addEventListener("click", () => updateReview(review._id, review.user, reviewText.textContent));

      const cancelButton = document.createElement("button");
      cancelButton.className = "cancel-button";
      cancelButton.textContent = "Cancel";
      cancelButton.style.display = "none";
      cancelButton.addEventListener("click", () => cancelEditing(reviewText, updateButton, cancelButton, iconsContainer, review.review));

      iconsContainer.appendChild(editIcon);
      iconsContainer.appendChild(deleteIcon);

      reviewContainer.appendChild(user);
      reviewContainer.appendChild(reviewText);
      reviewContainer.appendChild(iconsContainer);
      reviewContainer.appendChild(updateButton);
      reviewContainer.appendChild(cancelButton);
      mainSection.appendChild(reviewContainer);
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
}

function enableEditing(reviewText, updateButton, cancelButton, iconsContainer) {
  reviewText.contentEditable = true;
  reviewText.focus();
  updateButton.style.display = "inline-block";
  cancelButton.style.display = "inline-block";
  iconsContainer.style.display = "none";
}

function cancelEditing(reviewText, updateButton, cancelButton, iconsContainer, originalText) {
  reviewText.contentEditable = false;
  reviewText.textContent = decodeURIComponent(originalText);
  updateButton.style.display = "none";
  cancelButton.style.display = "none";
  iconsContainer.style.display = "flex";
}

async function updateReview(reviewId, username, newText) {
  const updateUrl = `${REVIEWS_API}${reviewId}`;
  try {
    const res = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: username, review: newText })
    });
    if (res.ok) {
      console.log(`Updated review with ID: ${reviewId}`);
      window.location.reload(); 
    } else {
      console.error("Failed to update review");
    }
  } catch (error) {
    console.error("Error updating review:", error);
  }
}

function confirmDeleteReview(reviewId) {
  const confirmDelete = confirm("Are you sure you want to delete this review?");
  if (confirmDelete) {
    deleteReview(reviewId);
  }
}

async function deleteReview(reviewId) {
  const deleteUrl = `${REVIEWS_API}${reviewId}`;
  try {
    const res = await fetch(deleteUrl, {
      method: 'DELETE'
    });
    if (res.ok) {
      console.log(`Deleted review with ID: ${reviewId}`);
      document.getElementById(reviewId).remove();
      window.location.reload();
    } else {
      console.error("Failed to delete review");
    }
  } catch (error) {
    console.error("Error deleting review:", error);
  }
}

function openReviewModal(movieId) {
    const modal = document.createElement("div");
    modal.className = "modal";
  
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
  
    const closeModal = document.createElement("span");
    closeModal.className = "close-button";
    closeModal.innerHTML = "&times;";
    closeModal.addEventListener("click", () => modal.remove());
  
    const form = document.createElement("form");
    form.className = "review-form";
  
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name:";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "name";
    nameInput.required = true;
  
    const reviewLabel = document.createElement("label");
    reviewLabel.textContent = "Review:";
    const reviewInput = document.createElement("textarea");
    reviewInput.name = "review";
    reviewInput.required = true;
  
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
  
    const postButton = document.createElement("button");
    postButton.type = "submit";
    postButton.textContent = "Post Review";
  
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => modal.remove());
  
    buttonContainer.appendChild(postButton);
    buttonContainer.appendChild(cancelButton);
  
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(reviewLabel);
    form.appendChild(reviewInput);
    form.appendChild(buttonContainer);
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      postReview(movieId, nameInput.value, reviewInput.value);
      modal.remove();
    });
  
    modalContent.appendChild(closeModal);
    modalContent.appendChild(form);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }  

async function postReview(movieId, userName, reviewText) {
  const postUrl = `${REVIEWS_API}new`;
  try {
    const res = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        movieId: movieId,
        user: userName,
        review: reviewText
      })
    });
    if (res.ok) {
      console.log(`Posted new review for movie ID: ${movieId}`);
      window.location.reload();
    } else {
      console.error("Failed to post review");
    }
  } catch (error) {
    console.error("Error posting review:", error);
  }
}
