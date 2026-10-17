// Characterization tests for the tutorial game, without browser dependencies.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadGame() {
  const drawings = [];
  const timers = new Map();
  const listeners = {};
  let nextTimer = 0;
  const pen = {
    fillStyle: '', font: '',
    fillRect(...args) { drawings.push({ kind: 'rect', color: this.fillStyle, args }); },
    fillText(...args) { drawings.push({ kind: 'text', color: this.fillStyle, args }); }
  };
  const button = { style: {} };
  const context = vm.createContext({
    document: {
      getElementById(id) {
        if (id === 'paper') return { getContext: () => pen };
        if (id === 'restartBtn') return button;
        throw new Error(`Unexpected element: ${id}`);
      },
      addEventListener(name, handler) { listeners[name] = handler; }
    },
    setInterval(fn, delay) {
      const id = ++nextTimer;
      timers.set(id, { fn, delay });
      return id;
    },
    clearInterval(id) { timers.delete(id); }
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8'), context);
  return {
    run: (code) => vm.runInContext(code, context),
    key: (key) => listeners.keydown({ key }),
    drawings, timers, button
  };
}

test('starts at 200,200 with three segments, zero score and one timer', () => {
  const game = loadGame();
  assert.equal(game.run('snake[0].x'), 200);
  assert.equal(game.run('snake[0].y'), 200);
  assert.equal(game.run('snake.length'), 3);
  assert.equal(game.run('score'), 0);
  assert.equal(game.button.style.display, 'none');
  assert.equal(game.timers.size, 1);
  assert.equal([...game.timers.values()][0].delay, 200);
});

test('moves one cell without growing when no food is eaten', () => {
  const game = loadGame();
  game.run('food = { x: 0, y: 0 }; gameStep();');
  assert.equal(game.run('snake[0].x'), 220);
  assert.equal(game.run('snake.length'), 3);
  assert.equal(game.run('score'), 0);
});

test('eating adds ten points and one segment', () => {
  const game = loadGame();
  game.run('food = { x: 220, y: 200 }; gameStep();');
  assert.equal(game.run('score'), 10);
  assert.equal(game.run('snake.length'), 4);
  assert.equal(game.run('isOnSnake(food.x, food.y)'), false);
});

test('food rejects an occupied candidate and returns a free grid cell', () => {
  const game = loadGame();
  game.run(`
    const originalRandom = Math.random;
    const values = [0.5, 0.5, 0, 0];
    let randomIndex = 0;
    Math.random = () => values[randomIndex++];
    try { food = spawnFood(); } finally { Math.random = originalRandom; }
  `);
  assert.equal(game.run('food.x'), 0);
  assert.equal(game.run('food.y'), 0);
  assert.equal(game.run('randomIndex'), 4);
});

for (const [direction, x, y] of [
  ['left', 0, 200], ['right', 380, 200],
  ['up', 200, 0], ['down', 200, 380]
]) {
  test(`hitting the ${direction} wall stops the timer and shows restart`, () => {
    const game = loadGame();
    game.run(`snake = [{ x: ${x}, y: ${y} }]; direction = '${direction}'; food = { x: 100, y: 100 }; gameStep();`);
    assert.equal(game.run('gameOver'), true);
    assert.equal(game.timers.size, 0);
    assert.equal(game.button.style.display, 'inline-block');
    assert.ok(game.drawings.some((d) => d.kind === 'text' && d.args[0] === 'GAME OVER'));
  });
}

test('hitting a body segment ends the game', () => {
  const game = loadGame();
  game.run(`snake = [
    { x: 200, y: 200 }, { x: 200, y: 220 },
    { x: 220, y: 220 }, { x: 220, y: 200 },
    { x: 240, y: 200 }
  ]; direction = 'right'; food = { x: 0, y: 0 }; gameStep();`);
  assert.equal(game.run('gameOver'), true);
});

test('moving into a tail cell is allowed when that tail moves away', () => {
  const game = loadGame();
  game.run(`snake = [
    { x: 200, y: 200 }, { x: 200, y: 220 },
    { x: 220, y: 220 }, { x: 220, y: 200 }
  ]; direction = 'right'; food = { x: 0, y: 0 }; gameStep();`);
  assert.equal(game.run('gameOver'), false);
});

test('blocks direct reversal and accepts a perpendicular turn', () => {
  const game = loadGame();
  game.key('ArrowLeft');
  assert.equal(game.run('direction'), 'right');
  game.key('ArrowUp');
  assert.equal(game.run('direction'), 'up');
});

test('restart resets state and repeated starts leave exactly one timer', () => {
  const game = loadGame();
  game.run('score = 50; gameOver = true; direction = "down"; startGame(); startGame();');
  assert.equal(game.run('score'), 0);
  assert.equal(game.run('gameOver'), false);
  assert.equal(game.run('direction'), 'right');
  assert.equal(game.run('snake.length'), 3);
  assert.equal(game.timers.size, 1);
});

test('renders a green snake, red food and score last', () => {
  const game = loadGame();
  game.drawings.length = 0;
  game.run('drawSnake();');
  assert.equal(game.drawings[0].color, 'black');
  assert.ok(game.drawings.slice(1, 4).every((d) => d.color === 'lightgreen'));
  assert.equal(game.drawings[4].color, 'red');
  assert.equal(game.drawings.at(-1).args[0], 'Score: 0');
});

// Known tutorial limitations, not claims of passing coverage.
test.todo('limit direction changes to one accepted turn per tick');
test.todo('handle a completely full board without an endless food search');
