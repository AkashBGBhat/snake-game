# Snake Game

A browser Snake game built with HTML, CSS, and vanilla JavaScript. This learning project connects familiar C concepts (loops, arrays, structs, conditions, and functions) to canvas drawing and browser events.

The snake is light green, food is red, and each meal earns **10 points**. No frameworks, build step, or runtime dependencies are required.

## Run locally

Download this repository using **Code → Download ZIP**, extract it, and open `index.html` in a desktop browser. Keep the HTML, CSS, and JavaScript files in the same folder. The game starts immediately.

Alternatively:

```sh
git clone https://github.com/AkashBGBhat/snake-game.git
cd snake-game
```

Then open `index.html`. VS Code Live Server is optional. Node.js is only needed for tests, not for playing.

## Controls

| Control | Action |
| --- | --- |
| Left arrow | Turn left |
| Right arrow | Turn right |
| Up arrow | Turn up |
| Down arrow | Turn down |
| Start Over button | Reset after game over without reloading |

A direct reversal is blocked. Hitting a wall or the body ends the round.

## Features

| Feature | Behavior |
| --- | --- |
| Grid | 400 × 400 canvas with 20px cells |
| Starting position | Head at `(200, 200)` with three segments |
| Movement | One cell every 200ms |
| Growth | Eating keeps the tail instead of removing it |
| Score | Ten points per meal, drawn after the board |
| Food placement | Re-rolls occupied cells |
| Collision | Wall and body detection |
| Restart | Resets state and keeps one active timer |

## Project layout

| File | Purpose |
| --- | --- |
| `index.html` | Page structure, canvas, restart button, asset references |
| `style.css` | Page colors, border, and button styling |
| `script.js` | Commented state, drawing, input, and game loop |
| `tests/snake.test.cjs` | Dependency-free Node tests with simulated canvas and timers |
| `.gitignore` | Common local development files to exclude |

## How it works

`snake` is an array of coordinate objects. Each tick builds a new head and adds it with `unshift()`. Normally, `pop()` removes the tail. After eating, skipping `pop()` grows the snake by one segment.

Keyboard events update `direction`; the timer performs movement. Drawing erases the board first, then paints the snake, food, and score. A shared start function resets state for both the first round and later restarts.

`isOnSnake()` checks food candidates. Self-collision uses a separate loop starting at index 1 so it does not compare the head with itself.

## Checks

With Node.js 22 installed:

```sh
node --check script.js
node --check tests/snake.test.cjs
node --test tests/snake.test.cjs
```

These are JavaScript syntax checks and characterization tests, not a browser end-to-end suite or a separate linter/type-checker. No npm installation is needed.

**Verification status:** tests have been added but have not been executed by the publishing assistant. Uploading the planned GitHub Actions workflow failed, so automated CI is not configured in this branch. Do not interpret the absence of failed checks as a passing test run.

The tests cover movement, growth, scoring, food rejection, four walls, body collision, vacated-tail movement, direct reversal, restart, and canvas drawing order. Two future improvements are explicitly marked TODO rather than reported as implemented.

The tutorial version was manually checked during development. Canvas mocks verify drawing calls, not visual appearance in a real browser.

## Known limitations and future improvements

This first version preserves the tutorial gameplay rather than silently redesigning it.

| Limitation | Possible follow-up |
| --- | --- |
| Two rapid direction changes before a movement tick can bypass the direct-reversal guard | Accept only one turn per tick, or add a validated input queue |
| Food retry has no finite retry bound and loops forever on a completely full board | Pick from free cells and add a win state |
| Arrow keys may also scroll a scrollable page | Prevent default behavior for handled game keys |
| Fixed-size canvas and keyboard-only controls | Responsive layout and touch controls |
| Score text can overlap gameplay near the top left | Move score into a separate page element |
| Automated workflow upload did not complete | Add GitHub Actions and execute the checks before treating the release as verified |

A screenshot is not included yet. There is no hosted-play URL; publishing the repository does not itself enable GitHub Pages.

## Learning notes

| Concept | Lesson |
| --- | --- |
| Array of objects | Similar to an array of coordinate structs in C |
| Event listener | Input changes state independently of the timer |
| Canvas drawing | Paint order and persistent `fillStyle` matter |
| Object comparison | Compare `x` and `y`; object equality checks identity |
| Function declarations | JavaScript hoists declarations; referenced variables still need initialization |
| Separation of files | HTML provides structure, CSS styles it, JavaScript runs behavior |
| Restart lifecycle | Clear the previous timer before creating a new one |

## License

No license has been selected for this repository.
