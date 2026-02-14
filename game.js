const phrase = ["WE", "LOVE", "THE", "WHOLE", "WORLD"];
const decoys = ["BUBBLES", "JELLY", "FUN", "PIZZA", "LAUGH", "FRIENDS", "OCEAN"];

const arena = document.getElementById("arena");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");
const progressEl = document.getElementById("progress");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const state = {
  x: 40,
  y: 40,
  speed: 240,
  keys: {},
  words: [],
  targetIndex: 0,
  score: 0,
  lives: 3,
  time: 60,
  running: true,
  lastFrame: 0,
  timerId: null,
};

function setPlayerPos() {
  player.style.left = `${state.x}px`;
  player.style.top = `${state.y}px`;
}

function makeWord(text, isTarget) {
  const el = document.createElement("div");
  el.className = `word ${isTarget ? "target" : ""}`;
  el.textContent = text;
  const maxX = arena.clientWidth - 120;
  const maxY = arena.clientHeight - 40;
  const word = {
    el,
    text,
    isTarget,
    x: Math.random() * Math.max(20, maxX) + 10,
    y: Math.random() * Math.max(20, maxY) + 10,
    vx: (Math.random() * 90 + 30) * (Math.random() > 0.5 ? 1 : -1),
    vy: (Math.random() * 90 + 30) * (Math.random() > 0.5 ? 1 : -1),
  };
  el.style.left = `${word.x}px`;
  el.style.top = `${word.y}px`;
  arena.appendChild(el);
  return word;
}

function spawnWords() {
  state.words.forEach((w) => w.el.remove());
  state.words = [];

  const target = phrase[state.targetIndex];
  state.words.push(makeWord(target, true));

  const pool = [...decoys].sort(() => Math.random() - 0.5).slice(0, 5);
  pool.forEach((d) => state.words.push(makeWord(d, false)));
}

function intersect(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

function updateWords(dt) {
  for (const w of state.words) {
    w.x += w.vx * dt;
    w.y += w.vy * dt;

    if (w.x < 0 || w.x > arena.clientWidth - w.el.offsetWidth) w.vx *= -1;
    if (w.y < 0 || w.y > arena.clientHeight - w.el.offsetHeight) w.vy *= -1;

    w.x = Math.max(0, Math.min(w.x, arena.clientWidth - w.el.offsetWidth));
    w.y = Math.max(0, Math.min(w.y, arena.clientHeight - w.el.offsetHeight));

    w.el.style.left = `${w.x}px`;
    w.el.style.top = `${w.y}px`;

    if (intersect(player.getBoundingClientRect(), w.el.getBoundingClientRect())) {
      if (w.isTarget) {
        state.score += 100;
        state.targetIndex += 1;
        progressEl.textContent = phrase.slice(0, state.targetIndex).join(" ");

        if (state.targetIndex >= phrase.length) {
          endGame(true);
        } else {
          spawnWords();
          statusEl.textContent = `Nice! Next word: ${phrase[state.targetIndex]}`;
        }
      } else {
        state.lives -= 1;
        livesEl.textContent = state.lives;
        w.el.classList.add("wrong");
        setTimeout(() => w.el.classList.remove("wrong"), 320);
        if (state.lives <= 0) endGame(false);
      }
      scoreEl.textContent = state.score;
      break;
    }
  }
}

function loop(ts) {
  if (!state.running) return;
  if (!state.lastFrame) state.lastFrame = ts;
  const dt = (ts - state.lastFrame) / 1000;
  state.lastFrame = ts;

  const step = state.speed * dt;
  if (state.keys.ArrowUp || state.keys.w) state.y -= step;
  if (state.keys.ArrowDown || state.keys.s) state.y += step;
  if (state.keys.ArrowLeft || state.keys.a) state.x -= step;
  if (state.keys.ArrowRight || state.keys.d) state.x += step;

  state.x = Math.max(0, Math.min(state.x, arena.clientWidth - player.offsetWidth));
  state.y = Math.max(0, Math.min(state.y, arena.clientHeight - player.offsetHeight));
  setPlayerPos();

  updateWords(dt);
  requestAnimationFrame(loop);
}

function endGame(won) {
  state.running = false;
  clearInterval(state.timerId);
  statusEl.textContent = won
    ? `🎉 You did it! The message is complete. Final score: ${state.score}`
    : `💥 Game over! Final score: ${state.score}. Press Restart to try again.`;
}

function startGame() {
  state.x = 40;
  state.y = arena.clientHeight / 2;
  state.targetIndex = 0;
  state.score = 0;
  state.lives = 3;
  state.time = 60;
  state.running = true;
  state.lastFrame = 0;

  scoreEl.textContent = state.score;
  livesEl.textContent = state.lives;
  timeEl.textContent = state.time;
  progressEl.textContent = "";
  statusEl.textContent = `Find this word first: ${phrase[0]}`;

  setPlayerPos();
  spawnWords();

  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    if (!state.running) return;
    state.time -= 1;
    timeEl.textContent = state.time;
    if (state.time <= 0) endGame(state.targetIndex >= phrase.length);
  }, 1000);

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  state.keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  state.keys[e.key] = false;
});
restartBtn.addEventListener("click", startGame);
window.addEventListener("resize", () => setPlayerPos());

startGame();
