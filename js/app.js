"use strict";

const API_KEY = "5a7e69c75d29626271fba5012cefe52b";

const modeBtn = document.querySelectorAll(".nav-mode-btn");
const movieCard = document.querySelectorAll(".movies-grid-items");
const movieContainer = document.querySelector(".movies-grid");

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

/////////////////////////
// TOGGLE ACTIVE CARDS
// movieCard.forEach((card) => {
//   card.style.transition = "all .4s";

//   card.addEventListener("click", function (e) {
//     const closest = e.target.closest(".movies-grid-items");
//     if (!closest) return;

//     movieCard.forEach((card) => {
//       card.classList.remove("card--active");
//     });

//     closest.classList.add("card--active");
//   });
// });

movieContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains === "movies-grid-items") return;

  movieCard.forEach((card) => {
    card.classList.remove("card--active");
  });

  const closest = e.target.closest(".movies-grid-items");
  closest.classList.add("card--active");
});

async function apiCall() {
  const randomPages = Math.trunc(Math.random() * 5);

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
      `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${randomPages}`,
      options,
    );
    const data = await res.json();

    const { results } = data;
    results.length = 9;
    console.log(results);

    const html = results
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
    console.error(err.message);
  }
}

apiCall();

// https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}
