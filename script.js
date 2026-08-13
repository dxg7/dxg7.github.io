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
  const colors = ["139,92,246", "167,139,250", "124,58,237"];
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

const colors = ["#8b5cf6", "#a78bfa", "#7c3aed", "#6d28d9", "#c4b5fd", "#ede9fe"];

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

const PLAYLIST = [
  { title: "slim body bitch", artist: "predayed", src: "music.mp3", cover: "cover.jpg" },
  // ADD MORE SONGS HERE, e.g.:
  // { title: "Song name", artist: "Artist", src: "file.mp3", cover: "art.jpg" },
];
let current = 0;

const audio = document.getElementById("track");
const playerEl = document.querySelector(".player");
const btnPlay = document.getElementById("btnPlay");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnList = document.getElementById("btnList");
const btnVol = document.getElementById("btnVol");
const barFill = document.getElementById("barFill");
const barEl = document.querySelector(".player-bar");
const timeCur = document.getElementById("timeCur");
const timeDur = document.getElementById("timeDur");
const icoPlay = btnPlay.querySelector(".ico-play");
const icoPause = btnPlay.querySelector(".ico-pause");
const icoVolOn = btnVol.querySelector(".ico-vol-on");
const icoVolOff = btnVol.querySelector(".ico-vol-off");
const titleEl = document.querySelector(".player-title");
const artistEl = document.querySelector(".player-artist");
const artImg = document.querySelector(".player-art-img");
const artFallback = document.querySelector(".art-fallback");
const volSlider = document.getElementById("volSlider");
const playlistEl = document.getElementById("playlist");
const playerTop = document.querySelector(".player-top");

function fmt(t) {
  if (isNaN(t) || !isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function setPlaying(playing) {
  icoPlay.style.display = playing ? "none" : "";
  icoPause.style.display = playing ? "" : "none";
  playerEl.classList.toggle("playing", playing);
}

function updateVolIcon() {
  const on = !audio.muted && audio.volume > 0;
  icoVolOn.style.display = on ? "" : "none";
  icoVolOff.style.display = on ? "none" : "";
}

function loadTrack(i, autoplay) {
  current = (i + PLAYLIST.length) % PLAYLIST.length;
  const t = PLAYLIST[current];
  audio.src = t.src;
  titleEl.textContent = t.title;
  artistEl.textContent = t.artist;
  if (t.cover) {
    artImg.src = t.cover;
    artImg.style.display = "";
    artFallback.style.display = "none";
  } else {
    artImg.style.display = "none";
    artFallback.style.display = "";
  }
  audio.load();
  timeDur.textContent = "0:00";
  timeCur.textContent = "0:00";
  barFill.style.width = "0%";
  if (autoplay) audio.play();
  renderPlaylist();
  playerTop.classList.remove("track-change");
  void playerTop.offsetWidth;
  playerTop.classList.add("track-change");
}

function renderPlaylist() {
  playlistEl.innerHTML = "";
  PLAYLIST.forEach((t, i) => {
    const item = document.createElement("div");
    item.className = "playlist-item" + (i === current ? " active" : "");
    const art = t.cover
      ? '<img src="' + t.cover + '" alt="" draggable="false" />'
      : '<span class="pl-note"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg></span>';
    item.innerHTML =
      art +
      '<div class="playlist-item-info">' +
      '<div class="pl-title">' + t.title + "</div>" +
      '<div class="pl-artist">' + t.artist + "</div>" +
      "</div>";
    item.addEventListener("click", () => {
      loadTrack(i, true);
      playlistEl.hidden = true;
    });
    playlistEl.appendChild(item);
  });
}

audio.addEventListener("loadedmetadata", () => {
  timeDur.textContent = fmt(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  timeCur.textContent = fmt(audio.currentTime);
  barFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
});

audio.addEventListener("play", () => setPlaying(true));
audio.addEventListener("pause", () => setPlaying(false));
audio.addEventListener("ended", () => loadTrack(current + 1, true));

btnPlay.addEventListener("click", togglePlay);

btnNext.addEventListener("click", () => loadTrack(current + 1, true));

btnPrev.addEventListener("click", () => {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    loadTrack(current - 1, true);
  }
});

btnList.addEventListener("click", () => {
  playlistEl.hidden = !playlistEl.hidden;
});

document.addEventListener("click", (e) => {
  if (!playlistEl.hidden && !e.target.closest(".player")) {
    playlistEl.hidden = true;
  }
});

barEl.addEventListener("click", (e) => {
  const rect = barEl.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  audio.currentTime = ratio * audio.duration;
});

volSlider.addEventListener("input", () => {
  audio.volume = volSlider.value / 100;
  audio.muted = audio.volume === 0;
  updateVolIcon();
});

btnVol.addEventListener("click", () => {
  audio.muted = !audio.muted;
  updateVolIcon();
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "INPUT") {
    e.preventDefault();
    togglePlay();
  }
});

loadTrack(0, false);

const viewsEl = document.getElementById("viewsCount");
const FAKE_VIEWS = 10;

async function loadViews() {
  let base = 0;
  try {
    const res = await fetch("https://api.countapi.xyz/hit/dxg7/profile-views");
    const data = await res.json();
    base = parseInt(data.value, 10) || 0;
  } catch (err) {
    base = parseInt(localStorage.getItem("viewsFallback") || "0", 10) + 1;
    localStorage.setItem("viewsFallback", String(base));
  }
  viewsEl.textContent = (base + FAKE_VIEWS).toLocaleString("en-US");
}

loadViews();
