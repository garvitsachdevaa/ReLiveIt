const API_KEY = "77cf4d65"; 
let currentPage = 1;
let currentSearch = "love";

const movieGrid = document.querySelector(".movie-grid");
const searchForm = document.querySelector(".searchbar");
const searchInput = document.querySelector(".searchbar input");
const modal = document.getElementById("movie-modal");
const modalContent = document.getElementById("movie-details");
const closeBtn = document.querySelector(".close-btn");
const paginationInfo = document.querySelector(".page-info");
const prevBtn = document.querySelector(".page-btn:first-child");
const nextBtn = document.querySelector(".page-btn:last-child");


async function getMovies(searchTerm, page = 1) {
  const url = `httpS://www.omdbapi.com/?s=${searchTerm}&page=${page}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True") {
      showMovies(data.Search);
      paginationInfo.textContent = `Page ${page}`;
    } else {
      movieGrid.innerHTML = `<p>${data.Error}</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function showMovies(movies) {
  movieGrid.innerHTML = "";

  movies.forEach(movie => {
    const movieEl = document.createElement("figure");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}" alt="${movie.Title}">
      <figcaption>${movie.Title} (${movie.Year})</figcaption>
    `;

    movieEl.addEventListener("click", () => getMovieDetails(movie.imdbID));
    movieGrid.appendChild(movieEl);
  });
}

async function getMovieDetails(id) {
  const url = `http://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const movie = await res.json();

    modalContent.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}" alt="${movie.Title}">
      <div>
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>IMDB Rating:</strong> ⭐ ${movie.imdbRating}</p>
      </div>
    `;

    modal.style.display = "block";
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    movieGrid.innerHTML = `<p style="color:red; text-align:center;">❌ Please enter a movie name!</p>`;
    return;
  }

  currentSearch = searchTerm;
  currentPage = 1;
  getMovies(currentSearch, currentPage);
  searchInput.value = "";
});


prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies(currentSearch, currentPage);
  }
});
nextBtn.addEventListener("click", () => {
  currentPage++;
  getMovies(currentSearch, currentPage);
});

getMovies(currentSearch, currentPage);

const genreButtons = document.querySelectorAll(".genre-filters button");

genreButtons.forEach(btn => {
  btn.addEventListener("click", () => {
  
    genreButtons.forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    const genre = btn.getAttribute("data-genre");
    currentSearch = genre;
    currentPage = 1;
    getMovies(currentSearch, currentPage);
  });
});
