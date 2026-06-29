"use strict";

const API_KEY = "5a7e69c75d29626271fba5012cefe52b";

const modeBtn = document.querySelectorAll(".nav-mode-btn");
const movieCard = document.querySelectorAll(".movies-grid-items");
const movieContainer = document.querySelector(".movies-grid");

let maxNumberInPage;
let currentPage = 1;

let initialCount = 0;
let totalCount = 5;

/////////////////////////////
// TOGGLE MODE BUTTON
modeBtn.forEach((mBtn) => {
  mBtn.addEventListener("click", function (e) {
    e.preventDefault();

    modeBtn.forEach((btn) => {
      btn.classList.remove("nav-mode-btn--active");
    });

    // console.log(e.target);
    e.target.classList.add("nav-mode-btn--active");
  });
});

movieContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains === "movies-grid-items") return;

  movieCard.forEach((card) => {
    card.classList.remove("card--active");
  });

  const closest = e.target.closest(".movies-grid-items");
  closest.classList.add("card--active");
});

async function apiCall() {
  loaderSpinner6();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTdlNjljNzVkMjk2MjYyNzFmYmE1MDEyY2VmZTUyYiIsIm5iZiI6MTc3ODkzODc0OS43OTYsInN1YiI6IjZhMDg3MzdkYmQ3YWZlZTI3ZTUxOWZmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DQRzIPkZURQf_uhgjgWVBTfU8cTdlVObneRn6hh9UhY",
    },
  };

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${currentPage}`,
      options,
    );
    const data = await res.json();
    const { results } = data;

    maxNumberInPage = results.length - 1;

    const result = results.slice(initialCount, totalCount);
    console.log(result);
    console.log(results);

    const html = result
      .map((data) => {
        return `<div class="movies-grid-items">
              <div class="movies-grid-items-container">
                <img
                  class="movies-grid-items-img"
                  src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
                  alt="movie name"
                />
              </div>
              <!-- src="https://tmdb.org${data.poster_path}" -->

              <div class="movies-grid-items-info">
                <h3 class="movies-grid-items-info-title">${data.original_title}</h3>
                <p class="movies-grid-items-info-year">${data.release_date}</p>
              </div>
            </div>`;
      })
      .join("");

    movieContainer.innerHTML = "";
    movieContainer.insertAdjacentHTML("beforeend", html);

    console.log(data);
  } catch (err) {
    // movieContainer.innerHTML = ``;
    // movieContainer.insertAdjacentText = `An error ocurred: ${err.message}`;
    console.error(err.message);
  }
}

apiCall();

// https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}

///////////////////
// LOADER SPINNER
function loaderSpinner6() {
  const loader = `
 <div class="loader">
            <svg class="loader-spinner">
              <use xlink:href="img/sprite.svg#icon-spinner6"></use>
            </svg>
          </div>`;

  ////////////////
  // ADDING LOADER
  movieContainer.innerHTML = "";
  movieContainer.insertAdjacentHTML("afterbegin", loader);
}

const controlbtnHTML = `<div class="movies-btn">
              <button class="movies-grid-btn movies-btn--previous">
                <span>&larr;</span> previous
              </button>
              <button class="movies-grid-btn movies-btn--next">
                next <span>&rarr;</span>
              </button>
            </div>`;

/////////////////////
// EVENTLISTENERS

function activeControls() {
  const btnNext = document.querySelector(".movies-btn--next");
  const btnPrevious = document.querySelector(".movies-btn--previous");
  btnPrevious.classList.add("hidden");

  btnPrevious.addEventListener("click", function (e) {
    e.preventDefault();

    if (initialCount === 0 && totalCount == 8) {
      return btnPrevious.classList.add("hidden");
    } else {
      initialCount -= 8;
      totalCount -= 8;
      apiCall();
      console.log(initialCount, totalCount);
    }
  });

  btnNext.addEventListener("click", function (e) {
    e.preventDefault();

    if (totalCount >= maxNumberInPage) {
      currentPage++;

      initialCount = -8;
      totalCount = 0;
    }
    btnPrevious.classList.remove("hidden");
    initialCount += 8;
    totalCount += 8;
    apiCall();
    console.log(initialCount, totalCount);
  });
}

activeControls();
