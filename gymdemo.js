const menuBtn = document.getElementById("menuBtn");
const gymNav = document.getElementById("gymNav");

menuBtn?.addEventListener("click", () => {
  gymNav.classList.toggle("open");
});

document.querySelectorAll("#gymNav a").forEach((link) => {
  link.addEventListener("click", () => gymNav.classList.remove("open"));
});

const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => observer.observe(el));

document.querySelectorAll('a[href="#join"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log("Join CTA clicked");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
