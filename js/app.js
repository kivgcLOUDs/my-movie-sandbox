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
const btnNext = document.querySelector(".movies-btn--next");
const btnPrevious = document.querySelector(".movies-btn--previous");
const searchView = document.querySelector(".search-view");
const backBtn = document.querySelector(".btn--back");
const detailedView = document.querySelector(".detailed-view");
const moviesContainer = document.querySelector(".movies");

const headerContainer = document.querySelector(".master");
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTdlNjljNzVkMjk2MjYyNzFmYmE1MDEyY2VmZTUyYiIsIm5iZiI6MTc3ODkzODc0OS43OTYsInN1YiI6IjZhMDg3MzdkYmQ3YWZlZTI3ZTUxOWZmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DQRzIPkZURQf_uhgjgWVBTfU8cTdlVObneRn6hh9UhY",
  },
};

// CHECK OUT Bang My Box: The Robin Byrd Story

class App {
  maxNumberInPage;
  inputValue = masterInput.value;
  currentPage = Math.trunc(Math.random() * 30) + 1;
  initialCount = 0;
  totalCount = 8;
  mode = "movie";
  newID;
  newUrlParams = new URLSearchParams(window.location.search);

  trendingTvAPI = `https://api.themoviedb.org/3/trending/tv/day?language=en-US&page=${this.currentPage}`;
  trendingAPI = `https://api.themoviedb.org/3/trending/${this.mode}/day?language=en-US&page=${this.currentPage}`;
  searchAPI;
  urlAPI = this.trendingAPI;

  constructor() {
    this.apiCall(this.urlAPI);
    this.activeControls();
    this.modeToggle();

    // SERCH BTN EVENT LISTERNER
    masterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const inputValue = masterInput.value;
      this.totalCount = 8;
      this.DisplaySearchOutput(inputValue);
    });

    // BACK BUTTON EVENT LISTENER
    backBtn.addEventListener("click", this.toggleToSearchView);
  }

  // FIRST EVER API CALL THAT IS CALLED IMMEDIATLY TO DISPLAY TRENDING MOVIES
  apiCall = async (url) => {
    this.loaderSpinner6();

    try {
      const res = await fetch(url, options);

      if (res.status === 504) throw new Error("Check internet connection");
      if (!res.ok) throw new Error("Check internet connection");
      if (res.status === 403) throw new Error("Server temporarily unavialable");
      if (res.status === 404) throw new Error("Query not found");
      if (res.status === 400) throw new Error("Try again");

      const data = await res.json();
      const { results } = data;
      this.maxNumberInPage = results.length - 1;
      const result = results.slice(this.initialCount, this.totalCount);

      movieContainer.innerHTML = ``;
      this.DisplayCards(result);
    } catch (err) {
      console.error(err.message);
      this.errorMessage(movieContainer, err.message);
    }
  };

  // SEARCH CONTROLS
  DisplaySearchOutput = async (movieName) => {
    this.loaderSpinner6();
    this.currentPage = 1;
    this.initialCount = 0;
    masterInput.blur();

    this.searchAPI = `https://api.themoviedb.org/3/search/${this.mode}?query=${movieName}&include_adult=false&language=en-US&page=${this.currentPage}`;
    this.urlAPI = this.searchAPI;

    try {
      const res = await fetch(this.urlAPI, options);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const { results } = data;

      this.maxNumberInPage = results.length - 1;
      const result = results.slice(this.initialCount, this.totalCount);

      this.DisplayCards(result);
      resultText.textContent = `Found Results`;

      console.log(data);
    } catch (err) {
      console.error(err.message);
      this.errorMessage(movieContainer, err.message);
    }
  };

  //DISPLAY TRENDING MOVIES CARDS
  DisplayCards(loopedData) {
    console.log(loopedData);
    const movieHTML = loopedData
      .map((data) => {
        return `<div class="movies-grid-items" data-id="${data.original_title}">
              <div class="movies-grid-items-container">
                <img
                  class="movies-grid-items-img"
                  src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
                  alt="${data.title}"
                />
              </div>
              <!-- src="https://tmdb.org${data.poster_path}" -->

              <div class="movies-grid-items-info">
                <h3 class="movies-grid-items-info-title">${data.title}</h3>
                <p class="movies-grid-items-info-year">${data.release_date}</p>
              </div>
            </div>`;
      })
      .join("");

    const tvHTML = loopedData
      .map((data) => {
        return `<div class="movies-grid-items" data-id="${data.name}">
              <div class="movies-grid-items-container">
                <img
                  class="movies-grid-items-img"
                  src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
                  alt="${data.name}"
                />
              </div>
              <!-- src="https://tmdb.org${data.poster_path}" -->

              <div class="movies-grid-items-info">
                <h3 class="movies-grid-items-info-title">${data.name}</h3>
                <p class="movies-grid-items-info-year">${data.first_air_date}</p>
              </div>
            </div>`;
      })
      .join("");

    movieContainer.innerHTML = "";

    if (this.mode === "tv")
      movieContainer.insertAdjacentHTML("beforeend", tvHTML);
    if (this.mode === "movie")
      movieContainer.insertAdjacentHTML("beforeend", movieHTML);

    // movieContainer.insertAdjacentHTML("afterbegin", html);

    ////////////////
    // CALLED SO AFTER CARDS LOADS IT CAN GET THIER DATA-SET
    this.selectedCards();
  }

  // GETING CARD ID TO LOAD MOVIE DETAILS
  selectedCards() {
    movieContainer.addEventListener("click", (e) => {
      const closest = e.target.closest(".movies-grid-items");

      // if (!e.target.closest("movies-grid-items")) return;
      // console.log(e.target);

      movieCard.forEach((card) => {
        card.classList.add("card--active");
        console.log(card);
      });

      ////////////////
      // FOR SWITCCHING TO DETAILED VIEW
      const id = closest.dataset.id;
      window.location.href = `#${id}`;
      document.title = id;
      this.newID = id;

      this.DetailedAPI(this.newID);
    });
  }

  // LOADER SPINNER
  loaderSpinner6() {
    const loader = `
 <div class="loader">
            <svg class="loader-spinner">
              <use xlink:href="img/sprite.svg#icon-spinner6"></use>
            </svg>
          </div>`;

    // ADDING LOADER
    movieContainer.innerHTML = "";
    movieContainer.insertAdjacentHTML("beforeend", loader);
  }

  //TO TOGGLE SPINNER FOR DETAILED VIEW
  loaderSpinner5() {
    detailedContainer.innerHTML = "";
    const loader = `
 <div class="loader">
            <svg class="loader-spinner">
              <use xlink:href="img/sprite.svg#icon-spinner6"></use>
            </svg>
          </div>`;

    detailedContainer.insertAdjacentHTML("beforeend", loader);
  }

  // TO TOGGLE BETWEEN VIEWS
  toggleToSearchView() {
    document.title = "Chine Search";
    window.location.href = `#ChineSearch`;

    detailedView.classList.add("hidden");
    searchView.classList.remove("hidden");
  }

  // TO TOGGLE BETWEEN VIEWS
  toogleToDetailedView() {
    searchView.classList.add("hidden");
    detailedView.classList.remove("hidden");
  }

  // "SEE MORE CONTROLS FOR THE HOME PAGE"
  activeControls() {
    btnPrevious.classList.add("hidden");

    btnPrevious.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.initialCount === 0 && this.currentPage == 1) return;

      master.scrollIntoView({
        behaviour: "smooth",
      });

      if (this.currentPage > 1 && this.initialCount === 0) {
        this.currentPage--;
        this.initialCount = this.maxNumberInPage - 4;
        this.totalCount = this.maxNumberInPage + 1;
        return this.apiCall(this.urlAPI);
      }

      this.initialCount -= 5;
      this.totalCount -= 5;

      console.log(
        "Btn Previous:",
        this.initialCount,
        this.totalCount,
        "pages",
        this.currentPage,
        this.maxNumberInPage,
      );
      this.apiCall(this.urlAPI);
    });

    btnNext.addEventListener("click", (e) => {
      e.preventDefault();
      master.scrollIntoView({
        behaviour: "smooth",
      });

      if (this.totalCount >= this.maxNumberInPage) {
        this.currentPage++;

        this.initialCount = -5;
        this.totalCount = 0;
      }
      btnPrevious.classList.remove("hidden");
      this.initialCount += 5;
      this.totalCount += 5;

      console.log(
        "Btn Next:",
        this.initialCount,
        this.totalCount,
        "pages",
        this.currentPage,
        this.maxNumberInPage,
      );
      this.apiCall(this.urlAPI);
    });
  }

  //INITIAL RESET (STATE)
  initDispaly() {
    this.initialCount = 0;
    this.totalCount = 5;
    this.currentPage = 1;
  }

  // TOGGLE MODE BUTTON
  modeToggle() {
    modeBtn.forEach((mBtn) => {
      mBtn.addEventListener("click", (e) => {
        e.preventDefault();

        masterInput.value = ``;
        masterInput.blur();

        modeBtn.forEach((btn) => {
          btn.classList.remove("nav-mode-btn--active");
        });
        e.target.classList.add("nav-mode-btn--active");

        if (e.target.dataset.mode === "tv") {
          this.mode = "tv";
          this.urlAPI = this.trendingTvAPI;
          this.apiCall(this.urlAPI);
        } else {
          this.mode = "movie";
          this.urlAPI = this.trendingAPI;
          this.apiCall(this.urlAPI);
        }

        console.log(this.mode);
      });
    });
  }

  // LOOPING OVER DATA TO SHOW DETIALS
  DisplayDetails(loopedData) {
    detailedContainer.innerHTML = ``;

    const data = loopedData;

    const movieHTML = `
      <div class="detailed-view-content">
      
            <div class="detailed-view-content-right">


              <img
                class="movies-grid-items-img"
                src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
                alt="${data.title}"
              />
            </div>
  
            <div class="detailed-view-content-left">
            <!--
              <div class="detailed-view-content-left-chips">
                <p class="detailed-view-content-left-chips-text">sci-fi</p>
                <p class="detailed-view-content-left-chips-text">Adveture</p>
                <p class="detailed-view-content-left-chips-text">Drama</p>
              </div>
              -->
              <h1 class="detailed-view-content-left-header">${data.title}</h1>
  
              <div class="detailed-view-content-left-info">
                <p class="detailed-view-content-left-info-year">${data.release_date}</p>
                <p class="detailed-view-content-left-info-time">2h 45m</p>
                <p class="detailed-view-content-left-info-director">
                  Directed by Van Dik
                </p>
              </div>
  
              <div class="detailed-view-content-left-ratings">
                <div class="detailed-view-content-left-ratings-rate">${data.vote_average.toFixed(1)}</div>
                <div class="detailed-view-content-left-ratings-info">
                  <p class="detailed-view-content-left-ratings-info-text">
                    TMDB score
                  </p>
                  <p
                    class="detailed-view-content-left-ratings-info-text detailed-view-content-left-ratings-info-text--2"
                  >
                    Based on ${data.vote_count} ratings
                  </p>
                </div>
              </div>
  
              <h2 class="detailed-view-content-left-about">
                ${data.overview}
              </h2>
  
              <button class="detailed-view-content-left--btn">
                <span class="trans--1"> &hearts; </span>add to favourite
              </button>
            </div>
          </div>
    `;

    const tvHTML = `
      <div class="detailed-view-content">
      
            <div class="detailed-view-content-right">


              <img
                class="movies-grid-items-img"
                src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
                alt="${data.name}"
              />
            </div>
  
            <div class="detailed-view-content-left">
            <!--
              <div class="detailed-view-content-left-chips">
                <p class="detailed-view-content-left-chips-text">sci-fi</p>
                <p class="detailed-view-content-left-chips-text">Adveture</p>
                <p class="detailed-view-content-left-chips-text">Drama</p>
              </div>
              -->
              <h1 class="detailed-view-content-left-header">${data.name}</h1>
  
              <div class="detailed-view-content-left-info">
                <p class="detailed-view-content-left-info-year">${data.first_air_date}</p>
                <p class="detailed-view-content-left-info-time">2h 45m</p>
                <p class="detailed-view-content-left-info-director">
                  Directed by Van Dik
                </p>
              </div>
  
              <div class="detailed-view-content-left-ratings">
                <div class="detailed-view-content-left-ratings-rate">${data.vote_average.toFixed(1)}</div>
                <div class="detailed-view-content-left-ratings-info">
                  <p class="detailed-view-content-left-ratings-info-text">
                    TMDB score
                  </p>
                  <p
                    class="detailed-view-content-left-ratings-info-text detailed-view-content-left-ratings-info-text--2"
                  >
                    Based on ${data.vote_count} ratings
                  </p>
                </div>
              </div>
  
              <h2 class="detailed-view-content-left-about">
                ${data.overview}
              </h2>
  
              <button class="detailed-view-content-left--btn">
                <span class="trans--1"> &hearts; </span>add to favourite
              </button>
            </div>
          </div>
    `;

    if (this.mode === "tv") {
      detailedContainer.insertAdjacentHTML("beforeend", tvHTML);
    } else {
      detailedContainer.insertAdjacentHTML("beforeend", movieHTML);
    }
  }

  // RECIVES DATA FROM CARDS AND RUNS ASYNCHRONOSLY TO GET ABOUT INFO
  DetailedAPI = async (id) => {
    this.toogleToDetailedView();
    this.loaderSpinner5();
    this.currentPage = 1;
    let result;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/${this.mode}?query=${id}&include_adult=false&language=en-US&page=${this.currentPage}`,
        options,
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      this.initDispaly();

      result = data.results[0];

      if (result === undefined || result === "")
        throw new Error("no response found");
    } catch (err) {
      console.error(err.message);

      this.errorMessage(detailedContainer, err.message);
    } finally {
      detailedContainer.innerHTML = "";
      this.DisplayDetails(result);
    }
  };

  // ERROR MESSAGE FOR EACH DISPLAYS
  errorMessage(container, msg) {
    const html = `
    <div class="errorMessage">
      <h1 class="msg">An error occured: ${msg}</h1>

      <div class="err">
      
      <button class="err-btn">Retry</button>
      </div>
    </div>
    `;
    container.innerHTML = "";
    container.insertAdjacentHTML("beforeend", html);

    document
      .querySelector(".err-btn")
      .addEventListener("click", () => this.apiCall(this.urlAPI));
  }

  // TO CHECK IF ONLINE FROM TIME TO TIME TO RELOAD THE PAGE
  internetStatus() {
    const internet = navigator.onLine;

    if (internet) {
      this.apiCall(this.urlAPI);
    } else {
      return;
    }
  }

  internetStatusInterval() {
    setInterval(() => {
      this.internetStatus();
    }, 5000);
  }
}

const app = new App();
