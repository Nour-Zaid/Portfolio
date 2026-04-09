const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const navLinks = nav.querySelectorAll("a");
const year = document.getElementById("year");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

year.textContent = new Date().getFullYear();
