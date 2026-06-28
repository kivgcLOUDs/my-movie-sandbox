"use strict";

const modeBtn = document.querySelectorAll(".nav-mode-btn");
const movieCard = document.querySelectorAll(".movies-grid-items");

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
movieCard.forEach((card) => {
  card.style.transition = "all .4s";

  card.addEventListener("click", function (e) {
    const closest = e.target.closest(".movies-grid-items");
    if (!closest) return;

    movieCard.forEach((card) => {
      card.classList.remove("card--active");
    });

    closest.classList.add("card--active");
  });
});
