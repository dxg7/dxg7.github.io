const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let W, H, particles = [];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle() {
  const colors = ["139,92,246", "34,211,238", "244,114,182"];
  const c = colors[Math.floor(Math.random() * colors.length)];
  return {
    x: rand(0, W),
    y: rand(0, H),
    r: rand(0.6, 1.8),
    vx: rand(-0.18, 0.18),
    vy: rand(-0.28, 0.1),
    color: c,
    alpha: rand(0.08, 0.3),
    pulse: rand(0.005, 0.02),
  };
}

function initParticles() {
  const count = Math.min(Math.floor(W / 22), 80);
  particles = Array.from({ length: count }, createParticle);
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha += p.pulse;
    if (p.alpha > 0.3 || p.alpha < 0.08) p.pulse *= -1;

    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    if (p.y < -20) p.y = H + 20;
    if (p.y > H + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  resize();
  initParticles();
});

resize();
initParticles();
if (!reduceMotion) draw();

const dot = document.querySelector(".cursor-dot");

window.addEventListener("mousemove", (e) => {
  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";
});

document.querySelectorAll(".link").forEach((link) => {
  link.addEventListener("mousemove", (e) => {
    const rect = link.getBoundingClientRect();
    link.style.setProperty("--mx", e.clientX - rect.left + "px");
    link.style.setProperty("--my", e.clientY - rect.top + "px");
  });

  link.addEventListener("mouseenter", () => dot.classList.add("is-hover"));
  link.addEventListener("mouseleave", () => dot.classList.remove("is-hover"));
});

const colors = ["#8b5cf6", "#22d3ee", "#f472b6", "#fbbf24", "#34d399", "#60a5fa"];

function burst(x, y) {
  const count = 55;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const size = rand(4, 8);
    piece.style.width = size + "px";
    piece.style.height = size * rand(0.5, 1.2) + "px";
    piece.style.left = x + "px";
    piece.style.top = y + "px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--dur", rand(0.9, 1.7) + "s");
    piece.style.setProperty("--rot", rand(-720, 720) + "deg");
    piece.style.transform = `translate(${rand(-30, 30)}px, ${rand(-60, -20)}px)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1800);
  }
}

document.querySelectorAll(".link").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (reduceMotion) return;
    const rect = link.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});
