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
let skinColor = '#ff0'; // Default bird skin color

// Load bird skins (optional, if you want skins)
const birdSkins = ['#ff0', '#f00', '#0f0', '#00f', '#f0f']; // Example skin colors

// Event listeners for bird movement
document.addEventListener('keydown', () => {
  if (!isGameOver) {
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
  if (bird.y > canvas.height - bird.height) {
    bird.y = canvas.height - bird.height;
    isGameOver = true;
  }

  // Draw bird
  ctx.fillStyle = skinColor;
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Pipes generation
  if (frames % 100 === 0) {
    pipes.push({
      x: canvas.width,
      y: Math.floor(Math.random() * (canvas.height - pipeGap))
    });
  }

  // Draw pipes
  pipes.forEach((pipe, index) => {
    // Upper pipe
    ctx.fillStyle = '#228B22';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
    // Lower pipe
    ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height);

    pipe.x -= pipeSpeed;

    // Check for collisions
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
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
        level++;
        pipeSpeed += 0.5;
        document.getElementById('level-number').innerText = level;

        // Change skin every 5 levels
        if (level % 5 === 0) {
          skinColor = birdSkins[level / 5 % birdSkins.length];
        }
      }
    }
  });

  frames++;
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
