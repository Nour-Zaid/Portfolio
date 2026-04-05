const salonMenuBtn = document.getElementById("salonMenuBtn");
const salonNav = document.getElementById("salonNav");

salonMenuBtn?.addEventListener("click", () => {
  salonNav.classList.toggle("open");
});

document.querySelectorAll("#salonNav a").forEach((link) => {
  link.addEventListener("click", () => salonNav.classList.remove("open"));
});

const revealNodes = document.querySelectorAll(".reveal");
const salonObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        salonObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealNodes.forEach((el) => salonObserver.observe(el));
