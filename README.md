# 🐍 Snake Game

A classic browser Snake game built with HTML, CSS, and vanilla JavaScript. My
first web project, built to practice JavaScript fundamentals while learning
programming — no frameworks, no libraries, just a canvas and a timer.

## What It Does

- A green snake glides on a 400×400 board, moving one grid cell every 200ms
- Eat the red food to grow longer and score **10 points** per meal
- Steer with the arrow keys; hitting a wall or your own body ends the game
- Direct reversals (e.g. turning left while gliding right) are blocked
- The **Start Over** button restarts instantly — no page reload

## How to Play

Open `index.html` in any browser and use the arrow keys.

| Key | Action |
|---|---|
| ⬅️ Arrow Left | Turn left |
| ➡️ Arrow Right | Turn right |
| ⬆️ Arrow Up | Turn up |
| ⬇️ Arrow Down | Turn down |
| Start Over button | Reset after game over |

## Gameplay Features

| Feature | Behavior |
|---|---|
| Grid | 400 × 400 canvas with 20px cells |
| Movement | One cell every 200ms via `setInterval` |
| Growth | Eating keeps the tail instead of removing it |
| Food spawn | Random cell, re-rolled if it lands on the snake |
| Collision | Walls and self-collision both end the game |
| Restart | Resets state and guarantees exactly one timer |

## Concepts Demonstrated

- Arrays as the snake's body (`unshift` / `pop` = move head / drop tail)
- Objects as grid cells (`{x, y}` — like a C `struct`)
- `setInterval` game loop and `clearInterval` to stop it
- `keydown` event listeners (input changes direction, loop moves the snake)
- Canvas drawing: `fillStyle`, `fillRect`, `fillText`, and paint order
- Strict equality (`===`) and comparing object fields (`x` and `y` separately)
- `do...while` reject-and-retry loop for food spawning
- Separating HTML (structure), CSS (looks), and JS (behavior)
- Restart lifecycle: clear the old timer before creating a new one

## Planned Improvements

- [ ] Speed up slightly as the snake grows
- [ ] Pause key (Space)
- [ ] High score saved in `localStorage`
- [ ] Limit to one direction change per tick (input queue)
- [ ] WASD support alongside arrow keys
- [ ] Mobile / touch controls

## Files

- `index.html` — page structure, canvas, and restart button
- `style.css` — colors, border, and button styling
- `script.js` — the complete game logic, commented
- `.gitignore` — ignores editor and local files

## Built With

HTML, CSS, and JavaScript — written as my first web project, learning JS by
translating C concepts (arrays, structs, loops) into browser code.

## Author

**Akash Bhat** — [github.com/AkashBGBhat](https://github.com/AkashBGBhat)
