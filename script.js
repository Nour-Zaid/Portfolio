const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle?.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const revealElements = document.querySelectorAll(".reveal");
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

revealElements.forEach((el) => observer.observe(el));

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const glow1 = document.querySelector(".bg-glow-1");
const glow2 = document.querySelector(".bg-glow-2");

window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 18;
  const y = (e.clientY / window.innerHeight - 0.5) * 18;

  if (glow1) glow1.style.transform = `translate(${x}px, ${y}px)`;
  if (glow2) glow2.style.transform = `translate(${-x}px, ${-y}px)`;
});

document.getElementById("year").textContent = new Date().getFullYear();
