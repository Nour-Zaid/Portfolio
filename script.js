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

// Throttled glow tracking — one update per animation frame max
const glow1 = document.querySelector(".bg-glow-1");
const glow2 = document.querySelector(".bg-glow-2");
let mouseRaf = null;
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (mouseRaf) return;
  mouseRaf = requestAnimationFrame(() => {
    const x = (mouseX / window.innerWidth - 0.5) * 18;
    const y = (mouseY / window.innerHeight - 0.5) * 18;
    if (glow1) glow1.style.transform = `translate(${x}px, ${y}px)`;
    if (glow2) glow2.style.transform = `translate(${-x}px, ${-y}px)`;
    mouseRaf = null;
  });
}, { passive: true });

document.getElementById("year").textContent = new Date().getFullYear();

function animateCounter(el) {
  const target = Number(el.dataset.target);
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-number").forEach((el) => counterObserver.observe(el));

// Particle canvas — skip entirely if user prefers reduced motion
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let rafId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  // Debounced resize — don't thrash canvas size on every pixel
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  }, { passive: true });

  // Fewer dots on small screens — halves the O(n²) line checks
  const DOTS = window.innerWidth < 768 ? 28 : 60;
  const LINE_DIST = 130;
  const LINE_DIST_SQ = LINE_DIST * LINE_DIST;

  const dots = Array.from({ length: DOTS }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: Math.random() * 1.4 + 0.4,
    a: Math.random() * 0.4 + 0.08,
  }));

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = canvas.width;
      if (d.x > canvas.width) d.x = 0;
      if (d.y < 0) d.y = canvas.height;
      if (d.y > canvas.height) d.y = 0;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(125, 139, 255, ${d.a})`;
      ctx.fill();
    }

    // Squared distance check avoids Math.sqrt on every pair
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distSq = dx * dx + dy * dy;
        if (distSq < LINE_DIST_SQ) {
          const alpha = 0.1 * (1 - Math.sqrt(distSq) / LINE_DIST);
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(125, 139, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(renderParticles);
  }

  renderParticles();

  // Pause animation loop when tab is not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      renderParticles();
    }
  });
}
