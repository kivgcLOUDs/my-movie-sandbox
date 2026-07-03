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
  currentPage = Math.trunc(Math.random() * 20);
  initialCount = 0;
  totalCount = 5;
  mode = "movie";
  newID;
  newUrlParams = new URLSearchParams(window.location.search);

  trendingAPI = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${this.currentPage}`;
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
      const res = await fetch(this.urlAPI, options);

      if (res.status === 504) throw new Error("Check internet connection");
      if (!res.ok) throw new Error("Check internet connection");
      if (res.status === 403) throw new Error("Server temporarily unavialable");
      if (res.status === 404) throw new Error("Query not found");
      if (res.status === 400) throw new Error("Try again");

      const data = await res.json();
      const { results } = data;
      this.maxNumberInPage = results.length - 1;
      const result = results.slice(this.initialCount, this.totalCount);

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
    const html = loopedData
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

    movieContainer.innerHTML = "";
    movieContainer.insertAdjacentHTML("afterbegin", html);

    ////////////////
    // CALLED SO AFTER CARDS LOADS IT CAN GET THIER DATA-SET
    this.selectedCards();
  }

  // GETING CARD ID TO LOAD MOVIE DETAILS
  selectedCards() {
    movieContainer.addEventListener("click", (e) => {
      if (!e.target.classList.contains === "movies-grid-items") return;

      movieCard.forEach((card) => {
        card.classList.add("card--active");
        console.log(card);
      });

      const closest = e.target.closest(".movies-grid-items");

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
    movieContainer.insertAdjacentHTML("afterbegin", loader);
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
      mBtn.addEventListener("click", function (e) {
        e.preventDefault();

        modeBtn.forEach((btn) => {
          btn.classList.remove("nav-mode-btn--active");
        });
        e.target.classList.add("nav-mode-btn--active");

        this.mode = e.target.dataset.mode;
      });
    });
  }

  // LOOPING OVER DATA TO SHOW DETIALS
  DisplayDetails(loopedData) {
    detailedContainer.innerHTML = ``;

    const data = loopedData;

    const html = `
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
                <p class="detailed-view-content-left-info-year">${data.release_date.slice(3).replaceAll("-", "/")}</p>
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
    detailedContainer.insertAdjacentHTML("beforeend", html);
  }

  // RECIVES DATA FROM CARDS AND RUNS ASYNCHRONOSLY TO GET ABOUT INFO
  DetailedAPI = async (id) => {
    this.toogleToDetailedView();
    this.loaderSpinner5();
    this.currentPage = 1;
    let result;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${id}&include_adult=false&language=en-US&page=${this.currentPage}`,
        options,
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      this.initDispaly();
      console.log(this.currentPage, this.initialCount, this.maxNumberInPage);

      result = data.results[0];

      if (result === undefined && result === "")
        throw new Error("no response found");

      console.log(result);
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
    </div>
    `;
    container.innerHTML = "";
    container.insertAdjacentHTML("beforeend", html);
  }
}

const app = new App();

// let maxNumberInPage;
// let currentPage = Math.trunc(Math.random() * 20);
// let initialCount = 0;
// let totalCount = 5;
// let mode = "movie";
// const newUrlParams = new URLSearchParams(window.location.search);
// /////////////////////
// // API CALLERS
// const trendingAPI = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${currentPage}`;
// let urlAPI = trendingAPI;

// /////////////////////////////
// // TOGGLE MODE BUTTON
// modeBtn.forEach((mBtn) => {
//   mBtn.addEventListener("click", function (e) {
//     e.preventDefault();

//     modeBtn.forEach((btn) => {
//       btn.classList.remove("nav-mode-btn--active");
//     });

//     // console.log(e.target);
//     e.target.classList.add("nav-mode-btn--active");

//     mode = e.target.dataset.mode;
//     console.log(mode);
//   });
// });

// function activeClasses() {
//   movieContainer.addEventListener("click", function (e) {
//     if (!e.target.classList.contains === "movies-grid-items") return;

//     movieCard.forEach((card) => {
//       card.classList.add("card--active");
//       console.log(card);
//     });

//     const closest = e.target.closest(".movies-grid-items");
//     closest.classList.add("card--active");

//     ////////////////
//     // FOR SWITCCHING TO DETAILED VIEW
//     const id = closest.dataset.id;
//     window.location.href = `#${id}`;
//     /////////////////
//   });
// }

// async function apiCall(url) {
//   loaderSpinner6();

//   try {
//     const res = await fetch(urlAPI, options);
//     const data = await res.json();
//     const { results } = data;
//     maxNumberInPage = results.length - 1;
//     const result = results.slice(this.initialCount, totalCount);

//     DisplayCards(result);

//     console.log(result);
//     console.log(results);

//     console.log(data);
//   } catch (err) {
//     // movieContainer.innerHTML = ``;
//     // movieContainer.insertAdjacentText = `An error ocurred: ${err.message}`;
//     console.error(err.message);
//   }
// }

// apiCall(urlAPI);

// // https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}

// ///////////////////
// // LOADER SPINNER
// function loaderSpinner6() {
//   const loader = `
//  <div class="loader">
//             <svg class="loader-spinner">
//               <use xlink:href="img/sprite.svg#icon-spinner6"></use>
//             </svg>
//           </div>`;

//   ////////////////
//   // ADDING LOADER
//   movieContainer.innerHTML = "";
//   movieContainer.insertAdjacentHTML("afterbegin", loader);
// }

// /////////////////////
// // EVENTLISTENERS

// masterInput.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const inputValue = masterInput.value;
//   totalCount = 8;
//   DisplaySearchOutput(inputValue);
// });

// masterBtn.addEventListener("click", function (e) {
//   e.preventDefault();
//   const inputValue = masterInput.value;
//   totalCount = 8;
//   DisplaySearchOutput(inputValue);
// });

// //////////////////
// // SEARCH CONTROLS
// async function DisplaySearchOutput(movieName) {
//   loaderSpinner6();
//   currentPage = 1;
//   initialCount = 0;
//   totalCount = 5;

//   const searchAPI = `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=${currentPage}`;
//   urlAPI = searchAPI;

//   try {
//     const res = await fetch(urlAPI, options);
//     if (!res.ok) throw new Error();
//     const data = await res.json();
//     const { results } = data;

//     // ////////////////
//     // // BASIC RESET FOR LOOPING ALGORITHM
//     // initialCount = 0;
//     // totalCount = 5;

//     maxNumberInPage = results.length - 1;
//     const result = results.slice(initialCount, totalCount);

//     DisplayCards(result);
//     resultText.textContent = `Found Results`;

//     console.log(data);
//   } catch (err) {
//     console.error(err.message);
//   }
// }

// /////////////////
// // "SEE MORE CONTROLS FOR THE HOME PAGE"
// function activeControls() {
//   const btnNext = document.querySelector(".movies-btn--next");
//   const btnPrevious = document.querySelector(".movies-btn--previous");
//   btnPrevious.classList.add("hidden");

//   btnPrevious.addEventListener("click", previousAction);

//   btnNext.addEventListener("click", nextAction);

//   function previousAction(e) {
//     e.preventDefault();
//     master.scrollIntoView({
//       behaviour: "smooth",
//     });

//     if (initialCount === 0 && totalCount == 8)
//       return btnPrevious.classList.add("hidden");

//     if (currentPage > 1 && initialCount === 0) {
//       currentPage--;
//       initialCount = maxNumberInPage - 4;
//       totalCount = maxNumberInPage + 1;
//       console.log(initialCount, totalCount);
//       return apiCall(urlAPI);
//     }

//     initialCount -= 5;
//     totalCount -= 5;
//     apiCall(urlAPI);
//   }
//   function nextAction(e) {
//     e.preventDefault();
//     master.scrollIntoView({
//       behaviour: "smooth",
//     });

//     if (totalCount >= maxNumberInPage) {
//       currentPage++;

//       initialCount = -5;
//       totalCount = 0;
//     }
//     btnPrevious.classList.remove("hidden");
//     initialCount += 5;
//     totalCount += 5;
//     apiCall(urlAPI);
//   }
// }
// activeControls();

// function DisplayCards(loopedData) {
//   const html = loopedData
//     .map((data) => {
//       return `<div class="movies-grid-items" data-id="${data.id}">
//               <div class="movies-grid-items-container">
//                 <img
//                   class="movies-grid-items-img"
//                   src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
//                   alt="${data.original_title}"
//                 />
//               </div>
//               <!-- src="https://tmdb.org${data.poster_path}" -->

//               <div class="movies-grid-items-info">
//                 <h3 class="movies-grid-items-info-title">${data.original_title}</h3>
//                 <p class="movies-grid-items-info-year">${data.release_date}</p>
//               </div>
//             </div>`;
//     })
//     .join("");

//   movieContainer.innerHTML = "";
//   movieContainer.insertAdjacentHTML("beforeend", html);

//   activeClasses();
// }

// function DisplayDetails(id) {
//   detailedContainer.innerHTML = ``;
//   const html = `
//     <div class="detailed-view-content">
//           <div class="detailed-view-content-right">
//             <img
//               class="movies-grid-items-img"
//               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfPozAFHXPYGZ3TNJUaJpyBa_Oe55L902ijuYGbuKtCQ&s"
//               alt="movie name"
//             />
//           </div>

//           <div class="detailed-view-content-left">
//             <div class="detailed-view-content-left-chips">
//               <p class="detailed-view-content-left-chips-text">sci-fi</p>
//               <p class="detailed-view-content-left-chips-text">Adveture</p>
//               <p class="detailed-view-content-left-chips-text">Drama</p>
//             </div>
//             <h1 class="detailed-view-content-left-header">Dune: Part Two</h1>

//             <div class="detailed-view-content-left-info">
//               <p class="detailed-view-content-left-info-year">2024</p>
//               <p class="detailed-view-content-left-info-time">2h 45m</p>
//               <p class="detailed-view-content-left-info-director">
//                 Directed by Van Dik
//               </p>
//             </div>

//             <div class="detailed-view-content-left-ratings">
//               <div class="detailed-view-content-left-ratings-rate">8.5</div>
//               <div class="detailed-view-content-left-ratings-info">
//                 <p class="detailed-view-content-left-ratings-info-text">
//                   TMDB score
//                 </p>
//                 <p
//                   class="detailed-view-content-left-ratings-info-text detailed-view-content-left-ratings-info-text--2"
//                 >
//                   Based on 12,400 ratings
//                 </p>
//               </div>
//             </div>

//             <h2 class="detailed-view-content-left-about">
//               Lorem ipsum dolor sit, amet consectetur adipisicing elit.
//               Voluptatem repellat veritatis modi numquam commodi odit molestias
//               hic iste officia facere reprehenderit
//             </h2>

//             <button class="detailed-view-content-left--btn">
//               <span class="trans--1"> &hearts; </span>add to favourite
//             </button>
//           </div>
//         </div>
//   `;
// }
