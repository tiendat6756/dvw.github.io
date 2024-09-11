const header = document.querySelector("header");
const menu = document.querySelector("#mn-btn");
const close = document.querySelector("#cl-btn");

menu.addEventListener("click", () => {
  header.classList.toggle("show-mobile-menu");

})

close.addEventListener("click", () => {
  menu.click();

})