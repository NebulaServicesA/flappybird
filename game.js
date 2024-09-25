const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let level = 1;
let score = 0;
let bird = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  radius: 20, // For rounded corners
  gravity: 1.5,
  velocity: 0,
  lift: -15
};
let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 3;
let frames = 0;
let isGameOver = false;
let skinColor = '#ffeb3b'; // Default bird skin color

// Load bird skins (optional, if you want skins)
const birdSkins = ['#ffeb3b', '#e91e63', '#4caf50', '#03a9f4', '#ff5722']; // Example skin colors

// Event listener for bird jump
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isGameOver) {
    bird.velocity = bird.lift;
  }
});

// Game loop
function gameLoop() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Bird movement
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  if (bird.y > canvas.height - bird.radius) {
    bird.y = canvas.height - bird.radius;
    isGameOver = true;
  }

  // Draw bird with rounded corners
  ctx.beginPath();
  ctx.arc(bird.x + bird.radius, bird.y + bird.radius, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = skinColor;
  ctx.fill();
  ctx.closePath();

  // Pipes generation
  if (frames % 100 === 0) {
    pipes.push({
      x: canvas.width,
      y: Math.floor(Math.random() * (canvas.height - pipeGap))
    });
  }

  // Draw pipes with rounded corners
  pipes.forEach((pipe, index) => {
    ctx.fillStyle = '#388e3c'; // Pipe color
    ctx.lineJoin = "round";

    // Upper pipe
    ctx.beginPath();
    ctx.roundRect(pipe.x, 0, pipeWidth, pipe.y, 10); // Rounded corners for pipes
    ctx.fill();
    ctx.closePath();

    // Lower pipe
    ctx.beginPath();
    ctx.roundRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap), 10); // Rounded corners for pipes
    ctx.fill();
    ctx.closePath();

    pipe.x -= pipeSpeed;

    // Check for collisions
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipeWidth &&
      (bird.y - bird.radius < pipe.y || bird.y + bird.radius > pipe.y + pipeGap)
    ) {
      isGameOver = true;
    }

    // Remove off-screen pipes and update score
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
      document.getElementById('score').innerText = score;

      // Increase level every 5 points
      if (score % 5 === 0 && level < 20) {
