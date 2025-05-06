// Client-side multiplayer car game logic
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.style.display = "none";

const socket = io();
let room = null;
let player = { x: 175, y: 500, w: 50, h: 100, color: "cyan", score: 0 };
let otherPlayer = { x: 175, y: 100, w: 50, h: 100, color: "orange" };
let coins = [];
let smokes = [];
let keys = {};
let playing = false;

// UI Events
document.getElementById("createBtn").onclick = () => socket.emit("createRoom");
document.getElementById("joinBtn").onclick = () => {
  const code = document.getElementById("roomCode").value.trim().toUpperCase();
  socket.emit("joinRoom", code);
};

socket.on("roomCreated", (code) => {
  document.getElementById("status").textContent = `Room Created: ${code}`;
  room = code;
});

socket.on("roomJoined", (code) => {
  document.getElementById("status").textContent = `Joined Room: ${code}`;
  room = code;
});

socket.on("joinFailed", () => {
  document.getElementById("status").textContent = "Failed to join room.";
});

socket.on("startGame", () => {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  playing = true;
  spawnCoins();
  requestAnimationFrame(gameLoop);
});

// Controls
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= 5;
  if (keys["ArrowRight"] && player.x < canvas.width - player.w) player.x += 5;
  if (keys["ArrowUp"] && player.y > 0) player.y -= 5;
  if (keys["ArrowDown"] && player.y < canvas.height - player.h) player.y += 5;
  smokes.push({ x: player.x + player.w / 2, y: player.y + player.h, opacity: 1 });
  socket.emit("playerMove", { room, x: player.x, y: player.y });
}

socket.on("updateOtherPlayer", ({ x, y }) => {
  otherPlayer.x = x;
  otherPlayer.y = y;
});

function spawnCoins() {
  setInterval(() => {
    if (playing) {
      coins.push({ x: Math.random() * (canvas.width - 20), y: 0, r: 10 });
    }
  }, 1000);
}

function drawSmoke() {
  for (let i = smokes.length - 1; i >= 0; i--) {
    const s = smokes[i];
    ctx.fillStyle = `rgba(128,128,128,${s.opacity})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 10, 0, Math.PI * 2);
    ctx.fill();
    s.y += 1;
    s.opacity -= 0.02;
    if (s.opacity <= 0) smokes.splice(i, 1);
  }
}

function checkCoinCollision() {
  coins = coins.filter(c => {
    const hit = player.x < c.x + c.r && player.x + player.w > c.x && player.y < c.y + c.r && player.y + player.h > c.y;
    if (hit) player.score += 10;
    return !hit;
  });
}

function drawUI() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + player.score, 10, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!playing) return;

  movePlayer();
  drawSmoke();

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = otherPlayer.color;
  ctx.fillRect(otherPlayer.x, otherPlayer.y, otherPlayer.w, otherPlayer.h);

  ctx.fillStyle = "gold";
  coins.forEach(c => {
    c.y += 2;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });

  checkCoinCollision();
  drawUI();
  requestAnimationFrame(gameLoop);
}
