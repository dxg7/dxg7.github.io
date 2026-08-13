const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let W, H, particles = [];

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
    r: rand(1, 2.6),
    vx: rand(-0.25, 0.25),
    vy: rand(-0.35, 0.15),
    color: c,
    alpha: rand(0.2, 0.7),
    pulse: rand(0.01, 0.04),
  };
}

function initParticles() {
  const count = Math.min(Math.floor(W / 14), 140);
  particles = Array.from({ length: count }, createParticle);
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha += p.pulse;
    if (p.alpha > 0.75 || p.alpha < 0.15) p.pulse *= -1;

    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    if (p.y < -20) p.y = H + 20;
    if (p.y > H + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(148,163,255,${(1 - dist / 130) * 0.16})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  resize();
  initParticles();
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

resize();
if (reduceMotion) {
  initParticles();
  ctx.clearRect(0, 0, W, H);
} else {
  initParticles();
  draw();
}

const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
let mx = 0, my = 0, rx = 0, ry = 0;

window.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
});

function ringLoop() {
  rx += (mx - rx) * 0.16;
  ry += (my - ry) * 0.16;
  ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  requestAnimationFrame(ringLoop);
}
ringLoop();

document.querySelectorAll("a, .link, button").forEach((el) => {
  el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
  el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
});

const colors = ["#8b5cf6", "#22d3ee", "#f472b6", "#fbbf24", "#34d399", "#60a5fa"];

function burst(x, y) {
  const count = 70;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const size = rand(5, 10);
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
