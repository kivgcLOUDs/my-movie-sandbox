"use strict";

const API_KEY = "5a7e69c75d29626271fba5012cefe52b";

const modeBtn = document.querySelectorAll(".nav-mode-btn");
const movieCard = document.querySelectorAll(".movies-grid-items");
const movieContainer = document.querySelector(".movies-grid");
const detailedContainer = document.querySelector(".detailed-view-content");
const master = document.querySelector(".master");
const masterInput = document.querySelector(".master-input");
const masterBtn = document.querySelector(".master-input-btn");
const resultText = document.querySelector(".movies-trend-text");
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTdlNjljNzVkMjk2MjYyNzFmYmE1MDEyY2VmZTUyYiIsIm5iZiI6MTc3ODkzODc0OS43OTYsInN1YiI6IjZhMDg3MzdkYmQ3YWZlZTI3ZTUxOWZmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DQRzIPkZURQf_uhgjgWVBTfU8cTdlVObneRn6hh9UhY",
  },
};

let maxNumberInPage;
let currentPage = Math.trunc(Math.random() * 20);
let initialCount = 0;
let totalCount = 5;
let mode = "movie";
const newUrlParams = new URLSearchParams(window.location.search);

class App {
  maxNumberInPage;
  currentPage = Math.trunc(Math.random() * 20);
  initialCount = 0;
  totalCount = 5;
  mode = "movie";
  newUrlParams = new URLSearchParams(window.location.search);

  trendingAPI = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${currentPage}`;
  searchAPI = `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=${currentPage}`;
  urlAPI = this.trendingAPI;

  constructor() {
    this.apiCall(this.urlAPI);
    this.activeControls();
    masterBtn.addEventListener("click", this.searchBtnClick).bind(this);
  }

  async apiCall(url) {
    this.loaderSpinner6();

    try {
      const res = await fetch(this.urlAPI, options);
      const data = await res.json();
      const { results } = data;
      this.maxNumberInPage = results.length - 1;
      const result = results.slice(this.initialCount, this.totalCount);

      this.DisplayTrending(result);

      console.log(result);
      console.log(results);

      console.log(data);
    } catch (err) {
      // movieContainer.innerHTML = ``;
      // movieContainer.insertAdjacentText = `An error ocurred: ${err.message}`;
      console.error(err.message);
    }
  }

  //////////////////
  // SEARCH CONTROLS
  async DisplaySearchOutput(movieName) {
    loaderSpinner6();
    currentPage = 1;
    this.initialCount = 0;

    this.urlAPI = this.searchAPI;

    try {
      const res = await fetch(urlAPI, options);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const { results } = data;

      // ////////////////
      // // BASIC RESET FOR LOOPING ALGORITHM
      // this.initialCount = 0;
      // this.totalCount = 5;

      this.maxNumberInPage = results.length - 1;
      const result = results.slice(this.initialCount, this.totalCount);

      this.DisplayTrending(result);
      resultText.textContent = `Found Results`;

      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  }

  ///////////////
  //DISPLAY TRENDING MOVIES
  DisplayTrending(loopedData) {
    const html = loopedData
      .map((data) => {
        return `<div class="movies-grid-items" data-id="${data.id}">
              <div class="movies-grid-items-container">
                <img
                  class="movies-grid-items-img"
                  src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
                  alt="${data.original_title}"
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

    this.activeCard();
  }

  activeCard() {
    movieContainer.addEventListener("click", function (e) {
      if (!e.target.classList.contains === "movies-grid-items") return;

      movieCard.forEach((card) => {
        card.classList.add("card--active");
        console.log(card);
      });

      const closest = e.target.closest(".movies-grid-items");
      closest.classList.add("card--active");

      ////////////////
      // FOR SWITCCHING TO DETAILED VIEW
      const id = closest.dataset.id;
      window.location.href = `#${id}`;
      /////////////////
    });
  }

  searchBtnClick(e) {
    e.preventDefault();
    const inputValue = masterInput.value;
    this.totalCount = 8;
    DisplaySearchOutput(inputValue);
  }

  ///////////////////
  // LOADER SPINNER
  loaderSpinner6() {
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

  /////////////////
  // "SEE MORE CONTROLS FOR THE HOME PAGE"
  activeControls() {
    const btnNext = document.querySelector(".movies-btn--next");
    const btnPrevious = document.querySelector(".movies-btn--previous");
    btnPrevious.classList.add("hidden");

    btnPrevious.addEventListener("click", this.previousAction).bind(this);

    btnNext.addEventListener("click", this.nextAction).bind(this);
  }

  previousAction(e) {
    e.preventDefault();
    master.scrollIntoView({
      behaviour: "smooth",
    });

    if (this.initialCount === 0 && this.totalCount == 8)
      return btnPrevious.classList.add("hidden");

    if (currentPage > 1 && this.initialCount === 0) {
      currentPage--;
      this.initialCount = maxNumberInPage - 4;
      this.totalCount = maxNumberInPage + 1;
      console.log(this.initialCount, this.totalCount);
      return apiCall(urlAPI);
    }

    this.initialCount -= 5;
    this.totalCount -= 5;
    apiCall(urlAPI);
  }

  nextAction(e) {
    e.preventDefault();
    master.scrollIntoView({
      behaviour: "smooth",
    });

    if (this.totalCount >= maxNumberInPage) {
      currentPage++;

      this.initialCount = -5;
      this.totalCount = 0;
    }
    btnPrevious.classList.remove("hidden");
    this.initialCount += 5;
    this.totalCount += 5;
    apiCall(urlAPI);
  }

  initDispaly() {
    this.initialCount = 0;
    this.totalCount = 5;
    this.currentPage = 1;
  }
}

/////////////////////
// API CALLERS
const trendingAPI = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${currentPage}`;
let urlAPI = trendingAPI;

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

    mode = e.target.dataset.mode;
    console.log(mode);
  });
});

function activeClasses() {
  movieContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains === "movies-grid-items") return;

    movieCard.forEach((card) => {
      card.classList.add("card--active");
      console.log(card);
    });

    const closest = e.target.closest(".movies-grid-items");
    closest.classList.add("card--active");

    ////////////////
    // FOR SWITCCHING TO DETAILED VIEW
    const id = closest.dataset.id;
    window.location.href = `#${id}`;
    /////////////////
  });
}

async function apiCall(url) {
  loaderSpinner6();

  try {
    const res = await fetch(urlAPI, options);
    const data = await res.json();
    const { results } = data;
    maxNumberInPage = results.length - 1;
    const result = results.slice(this.initialCount, totalCount);

    DisplayTrending(result);

    console.log(result);
    console.log(results);

    console.log(data);
  } catch (err) {
    // movieContainer.innerHTML = ``;
    // movieContainer.insertAdjacentText = `An error ocurred: ${err.message}`;
    console.error(err.message);
  }
}

apiCall(urlAPI);

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

/////////////////////
// EVENTLISTENERS

masterInput.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputValue = masterInput.value;
  totalCount = 8;
  DisplaySearchOutput(inputValue);
});

masterBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const inputValue = masterInput.value;
  totalCount = 8;
  DisplaySearchOutput(inputValue);
});

//////////////////
// SEARCH CONTROLS
async function DisplaySearchOutput(movieName) {
  loaderSpinner6();
  currentPage = 1;
  initialCount = 0;
  totalCount = 5;

  const searchAPI = `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=${currentPage}`;
  urlAPI = searchAPI;

  try {
    const res = await fetch(urlAPI, options);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const { results } = data;

    // ////////////////
    // // BASIC RESET FOR LOOPING ALGORITHM
    // initialCount = 0;
    // totalCount = 5;

    maxNumberInPage = results.length - 1;
    const result = results.slice(initialCount, totalCount);

    DisplayTrending(result);
    resultText.textContent = `Found Results`;

    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
}

/////////////////
// "SEE MORE CONTROLS FOR THE HOME PAGE"
function activeControls() {
  const btnNext = document.querySelector(".movies-btn--next");
  const btnPrevious = document.querySelector(".movies-btn--previous");
  btnPrevious.classList.add("hidden");

  btnPrevious.addEventListener("click", previousAction);

  btnNext.addEventListener("click", nextAction);

  function previousAction(e) {
    e.preventDefault();
    master.scrollIntoView({
      behaviour: "smooth",
    });

    if (initialCount === 0 && totalCount == 8)
      return btnPrevious.classList.add("hidden");

    if (currentPage > 1 && initialCount === 0) {
      currentPage--;
      initialCount = maxNumberInPage - 4;
      totalCount = maxNumberInPage + 1;
      console.log(initialCount, totalCount);
      return apiCall(urlAPI);
    }

    initialCount -= 5;
    totalCount -= 5;
    apiCall(urlAPI);
  }
  function nextAction(e) {
    e.preventDefault();
    master.scrollIntoView({
      behaviour: "smooth",
    });

    if (totalCount >= maxNumberInPage) {
      currentPage++;

      initialCount = -5;
      totalCount = 0;
    }
    btnPrevious.classList.remove("hidden");
    initialCount += 5;
    totalCount += 5;
    apiCall(urlAPI);
  }
}
activeControls();

function DisplayTrending(loopedData) {
  const html = loopedData
    .map((data) => {
      return `<div class="movies-grid-items" data-id="${data.id}">
              <div class="movies-grid-items-container">
                <img
                  class="movies-grid-items-img"
                  src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
                  alt="${data.original_title}"
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

  activeClasses();
}

function DisplayDetails(id) {
  detailedContainer.innerHTML = ``;
  const html = `
    <div class="detailed-view-content">
          <div class="detailed-view-content-right">
            <img
              class="movies-grid-items-img"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfPozAFHXPYGZ3TNJUaJpyBa_Oe55L902ijuYGbuKtCQ&s"
              alt="movie name"
            />
          </div>

          <div class="detailed-view-content-left">
            <div class="detailed-view-content-left-chips">
              <p class="detailed-view-content-left-chips-text">sci-fi</p>
              <p class="detailed-view-content-left-chips-text">Adveture</p>
              <p class="detailed-view-content-left-chips-text">Drama</p>
            </div>
            <h1 class="detailed-view-content-left-header">Dune: Part Two</h1>

            <div class="detailed-view-content-left-info">
              <p class="detailed-view-content-left-info-year">2024</p>
              <p class="detailed-view-content-left-info-time">2h 45m</p>
              <p class="detailed-view-content-left-info-director">
                Directed by Van Dik
              </p>
            </div>

            <div class="detailed-view-content-left-ratings">
              <div class="detailed-view-content-left-ratings-rate">8.5</div>
              <div class="detailed-view-content-left-ratings-info">
                <p class="detailed-view-content-left-ratings-info-text">
                  TMDB score
                </p>
                <p
                  class="detailed-view-content-left-ratings-info-text detailed-view-content-left-ratings-info-text--2"
                >
                  Based on 12,400 ratings
                </p>
              </div>
            </div>

            <h2 class="detailed-view-content-left-about">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Voluptatem repellat veritatis modi numquam commodi odit molestias
              hic iste officia facere reprehenderit
            </h2>

            <button class="detailed-view-content-left--btn">
              <span class="trans--1"> &hearts; </span>add to favourite
            </button>
          </div>
        </div>
  `;
}
