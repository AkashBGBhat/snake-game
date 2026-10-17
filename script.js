// ================= SETUP =================
// Find the canvas and the drawing context (our pen).
const paper = document.getElementById('paper');
const pen = paper.getContext('2d');
const restartBtn = document.getElementById('restartBtn');

// Each segment is an {x, y} object, similar to a C struct.
// Index 0 is the head; the last element is the tail.
let snake = [];
let direction = 'right';
let gameOver = false;
let score = 0;
let food = { x: 200, y: 100 };
let gameLoop = null; // The timer ID lets us stop or replace the loop.

// ================= FOOD =================
// Return true if any segment occupies these coordinates.
function isOnSnake(x, y) {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      return true;
    }
  }
  return false;
}

// Pick a grid cell, then reject and retry if the snake occupies it.
// Math.floor(Math.random() * 20) chooses an integer from 0 to 19.
// Multiplying by 20 converts the cell index into a pixel coordinate.
// Limitation: a completely full board has no free cell; see README.
function spawnFood() {
  let spot;
  do {
    spot = {
      x: Math.floor(Math.random() * 20) * 20,
      y: Math.floor(Math.random() * 20) * 20
    };
  } while (isOnSnake(spot.x, spot.y));
  return spot;
}

// ================= DRAWING =================
// Paint in order: background, snake, food, then score.
function drawSnake() {
  // Erase the previous frame first.
  pen.fillStyle = 'black';
  pen.fillRect(0, 0, 400, 400);

  // Set the snake color BEFORE the loop so every segment is green.
  pen.fillStyle = 'lightgreen';
  for (let i = 0; i < snake.length; i++) {
    pen.fillRect(snake[i].x, snake[i].y, 20, 20);
  }

  // The pen keeps its color until we change it again.
  pen.fillStyle = 'red';
  pen.fillRect(food.x, food.y, 20, 20);

  // Draw score last so the background cannot erase it.
  // For text, y = 25 is the baseline, not the top edge.
  pen.fillStyle = 'green';
  pen.font = '20px Arial';
  pen.fillText('Score: ' + score, 10, 25);
}

// ================= GAME LOOP =================
// One movement step. The timer calls this every 200 milliseconds.
function gameStep() {
  const head = snake[0];

  // Build a new object without changing the previous head.
  let newHead;
  if (direction === 'right') { newHead = { x: head.x + 20, y: head.y }; }
  if (direction === 'left')  { newHead = { x: head.x - 20, y: head.y }; }
  if (direction === 'up')    { newHead = { x: head.x, y: head.y - 20 }; }
  if (direction === 'down')  { newHead = { x: head.x, y: head.y + 20 }; }

  // Add a head at the FRONT of the array.
  snake.unshift(newHead);

  // Compare coordinate values; object equality would compare identity.
  if (newHead.x === food.x && newHead.y === food.y) {
    score = score + 10;
    food = spawnFood();
    // No pop after eating: the snake keeps its tail and grows by one.
  } else {
    snake.pop(); // Remove the last segment to keep the same length.
  }

  // A 20px square at 380 is still inside a 400px board.
  if (newHead.x < 0 || newHead.x > 380 || newHead.y < 0 || newHead.y > 380) {
    gameOver = true;
  }

  // Skip index 0: the new head must not be compared against itself.
  // Check after removing the tail, because that cell may now be free.
  for (let i = 1; i < snake.length; i++) {
    if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
      gameOver = true;
    }
  }

  if (gameOver) {
    clearInterval(gameLoop);
    // Keep the last drawn frame and overlay the result.
    // The attempted crash position is not drawn.
    pen.fillStyle = 'red';
    pen.font = '40px Arial';
    pen.fillText('GAME OVER', 80, 200);
    pen.font = '20px Arial';
    pen.fillText('Final Score: ' + score, 130, 240);
    restartBtn.style.display = 'inline-block';
    return; // Leave without drawing another normal frame.
  }

  drawSnake();
}

// ================= START / RESTART =================
// Reset state and replace the timer: no page reload is necessary.
function startGame() {
  snake = [
    { x: 200, y: 200 }, // Head, on the 20px grid.
    { x: 180, y: 200 },
    { x: 160, y: 200 }
  ];
  direction = 'right';
  gameOver = false;
  score = 0;
  food = spawnFood();
  restartBtn.style.display = 'none';

  // Clear first so repeated restarts never leave multiple active timers.
  clearInterval(gameLoop);
  gameLoop = setInterval(gameStep, 200);
  drawSnake();
}

// ================= INPUT =================
// Keys change direction; only gameStep moves the snake.
// Block a direct reversal into the neck.
// Rapid multiple turns within one tick remain a known limitation.
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft'  && direction !== 'right') { direction = 'left'; }
  if (event.key === 'ArrowRight' && direction !== 'left')  { direction = 'right'; }
  if (event.key === 'ArrowUp'    && direction !== 'down')  { direction = 'up'; }
  if (event.key === 'ArrowDown'  && direction !== 'up')    { direction = 'down'; }
});

// Function declarations are hoisted: they can be called before their
// textual definition. Referenced let/const variables must be initialized.
startGame();
