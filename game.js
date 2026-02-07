const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const overlayMessage = overlay.querySelector(".overlay__message");
const startButton = document.getElementById("start-button");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("best-score");

const state = {
  running: false,
  score: 0,
  bestScore: 0,
  frame: 0,
  lastPipe: 0,
  pipes: [],
  bird: {
    x: canvas.width * 0.25,
    y: canvas.height * 0.5,
    radius: 16,
    velocity: 0,
  },
};

const gravity = 0.35;
const flapStrength = -6;
const pipeGap = 160;
const pipeWidth = 58;
const pipeSpacing = 150;
const groundHeight = 90;

const resetGame = () => {
  state.running = false;
  state.score = 0;
  state.frame = 0;
  state.lastPipe = 0;
  state.pipes = [];
  state.bird.y = canvas.height * 0.5;
  state.bird.velocity = 0;
  scoreEl.textContent = "0";
  overlayMessage.textContent = "Tap, click, or press Space to flap.";
  overlay.classList.add("is-visible");
};

const startGame = () => {
  state.running = true;
  overlay.classList.remove("is-visible");
};

const spawnPipe = () => {
  const minTop = 60;
  const maxTop = canvas.height - groundHeight - pipeGap - 80;
  const topHeight = Math.random() * (maxTop - minTop) + minTop;
  state.pipes.push({
    x: canvas.width + 20,
    top: topHeight,
    passed: false,
  });
};

const updateBird = () => {
  state.bird.velocity += gravity;
  state.bird.y += state.bird.velocity;
  if (state.bird.y + state.bird.radius >= canvas.height - groundHeight) {
    gameOver();
  }
  if (state.bird.y - state.bird.radius <= 0) {
    state.bird.y = state.bird.radius;
    state.bird.velocity = 0;
  }
};

const updatePipes = () => {
  state.pipes.forEach((pipe) => {
    pipe.x -= 2.4;
    if (!pipe.passed && pipe.x + pipeWidth < state.bird.x) {
      pipe.passed = true;
      state.score += 1;
      scoreEl.textContent = state.score.toString();
      if (state.score > state.bestScore) {
        state.bestScore = state.score;
        bestScoreEl.textContent = state.bestScore.toString();
      }
    }
  });
  state.pipes = state.pipes.filter((pipe) => pipe.x + pipeWidth > -40);
};

const checkCollisions = () => {
  for (const pipe of state.pipes) {
    const birdLeft = state.bird.x - state.bird.radius;
    const birdRight = state.bird.x + state.bird.radius;
    const birdTop = state.bird.y - state.bird.radius;
    const birdBottom = state.bird.y + state.bird.radius;

    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + pipeWidth;
    const gapTop = pipe.top;
    const gapBottom = pipe.top + pipeGap;

    const overlapsHorizontally = birdRight > pipeLeft && birdLeft < pipeRight;
    const hitsTop = birdTop < gapTop;
    const hitsBottom = birdBottom > gapBottom;

    if (overlapsHorizontally && (hitsTop || hitsBottom)) {
      gameOver();
      break;
    }
  }
};

const drawBackground = () => {
  ctx.fillStyle = "#0b1025";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1b295b";
  ctx.beginPath();
  ctx.arc(70, 80, 40, 0, Math.PI * 2);
  ctx.arc(130, 110, 55, 0, Math.PI * 2);
  ctx.arc(190, 85, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1f2f66";
  ctx.beginPath();
  ctx.arc(250, 140, 50, 0, Math.PI * 2);
  ctx.arc(300, 110, 35, 0, Math.PI * 2);
  ctx.fill();
};

const drawGround = () => {
  ctx.fillStyle = "#141927";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
  ctx.fillStyle = "#1f2436";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, 12);
};

const drawPipes = () => {
  state.pipes.forEach((pipe) => {
    ctx.fillStyle = "#3ad6a3";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(
      pipe.x,
      pipe.top + pipeGap,
      pipeWidth,
      canvas.height - groundHeight - (pipe.top + pipeGap),
    );
    ctx.fillStyle = "#29b387";
    ctx.fillRect(pipe.x - 6, pipe.top - 18, pipeWidth + 12, 18);
    ctx.fillRect(pipe.x - 6, pipe.top + pipeGap, pipeWidth + 12, 18);
  });
};

const drawBird = () => {
  ctx.fillStyle = "#ffcf66";
  ctx.beginPath();
  ctx.arc(state.bird.x, state.bird.y, state.bird.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1a0b24";
  ctx.beginPath();
  ctx.arc(state.bird.x + 6, state.bird.y - 6, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff7ac6";
  ctx.beginPath();
  ctx.moveTo(state.bird.x + 12, state.bird.y);
  ctx.lineTo(state.bird.x + 26, state.bird.y - 6);
  ctx.lineTo(state.bird.x + 26, state.bird.y + 6);
  ctx.closePath();
  ctx.fill();
};

const gameOver = () => {
  if (!state.running) {
    return;
  }
  state.running = false;
  overlayMessage.textContent = "night has been killed by u";
  startButton.textContent = "Restart";
  overlay.classList.add("is-visible");
};

const tick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPipes();
  drawBird();
  drawGround();

  if (state.running) {
    state.frame += 1;
    updateBird();
    if (state.frame - state.lastPipe > pipeSpacing) {
      spawnPipe();
      state.lastPipe = state.frame;
    }
    updatePipes();
    checkCollisions();
  }

  requestAnimationFrame(tick);
};

const flap = () => {
  if (!state.running) {
    startGame();
  }
  state.bird.velocity = flapStrength;
};

const handleInput = (event) => {
  if (event.type === "keydown" && event.code !== "Space") {
    return;
  }
  flap();
};

startButton.addEventListener("click", () => {
  if (!state.running) {
    startGame();
  }
});

window.addEventListener("keydown", handleInput);
window.addEventListener("pointerdown", handleInput);

resetGame();
tick();
