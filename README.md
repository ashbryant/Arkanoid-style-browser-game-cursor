# WEBANOID

> A retro arcade brick-breaker in the spirit of Arkanoid (1986)
> Built with Vue 3 + Vite. Destroy the Web. Save the Internet.

---

## Project Overview

Webanoid is a browser-based brick-breaker arcade game. The player controls a paddle to bounce a ball and destroy themed blocks — broken layouts, rogue popups, cookie banners, CMS fragments, and other web-design horrors. The visual style targets a 1986 CRT arcade cabinet aesthetic: dark background, bright neon pixels, chunky fonts, high contrast.

## Design Goals

- **Retro first** — gameplay, feel, and visuals reflect 1986 arcade style
- **Web theme second** — brick types, level names, and copy reference web dev clichés
- **Readable code** — small modules, clear naming, useful comments
- **Testable logic** — pure functions for physics, collision, scoring, lives

## Retro and Web-Theme Direction

Level titles use web-dev clichés (10 unique levels):
- "Above the Fold" · "Make My Logo Bigger" · "Works on My Machine"
- "It Looked Fine in Figma" · "Quick CSS Fix" · "Can You Just..."
- "Add More White Space" · "Launch It Friday" · "Pixel Perfect" · "Final Final V2"

After the last level, the game loops with increasing speed.

Brick types reference fictional parody web components — not real brand logos:
- `<div>` · POPUP · !cookie · CMS · WIDGET · 404 · heavy blocks

## Tech Stack

| Tool              | Purpose                             |
|-------------------|-------------------------------------|
| Vue 3             | UI, menus, overlays, state          |
| Vite              | Dev server, bundler                 |
| Canvas API        | Gameplay rendering                  |
| Vitest            | Unit + component testing            |
| Vue Test Utils    | Component test helpers              |
| Web Audio API     | Sound effects and music (no files)  |
| localStorage      | High score + audio prefs            |

## Install

```bash
npm install
```

## Dev Server

```bash
npm run dev
```

Starts Vite with hot reload. Open http://localhost:5173

## Build

```bash
npm run build
```

## Test

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
```

## Controls

| Input         | Action                    |
|---------------|---------------------------|
| ← → / A D     | Move paddle               |
| Space / Enter | Launch ball / confirm     |
| Escape        | Pause / resume            |
| M             | Toggle master mute        |
| Mouse move    | Move paddle               |
| Click         | Launch ball / confirm     |
| Touch drag    | Move paddle               |
| Touch tap     | Launch ball / confirm     |

## Pause Controls

- **Keyboard:** Escape key
- **Mouse:** Click the pause button (top-right of game area)
- **Touch:** Tap the pause button (top-right of game area)

When paused, all gameplay halts safely and resumes without breaking ball physics, music state, or input.

## Mobile Behaviour

- Touch drag or direct touch controls the paddle
- Landscape orientation preferred
- Small portrait screens show a rotate-device prompt
- Canvas scales to fill viewport on mobile

## Audio Controls

| Control             | How                         |
|---------------------|-----------------------------|
| Master mute         | M key or sound button HUD   |
| Music toggle        | Music button in HUD         |
| SFX toggle          | SFX button in HUD           |

Audio preferences are saved to localStorage under key `webanoid_audio`.
All sounds are synthesised via Web Audio API — no audio files needed.
Audio starts only after first user interaction (browser autoplay policy).

## High Score Behaviour

- Top 10 scores stored in localStorage under key `webanoid_scores`
- If a new score qualifies, the player is prompted for 3 initials in arcade style
- Scores include: initials, score value, level reached, date
- New high score is highlighted in the table

## Cheat Behaviour (Developer Notes)

A hidden cheat enables **infinite lives** during gameplay.

> **Secret code:** Type **BIGBOSS** on the keyboard during gameplay (any capitalisation).
> A brief neon pink flash confirms activation.
> This is a developer/tester convenience — not advertised in-game.

To disable: remove the `checkCheat()` call in `GameCanvas.vue` or clear `src/game/cheat.js`.

## Project Structure

```
src/
  main.js                 # Vue app entry
  App.vue                 # Root: screen routing (title → game → gameover)
  style.css               # Global retro styles (Press Start 2P, CRT palette)
  components/
    TitleScreen.vue        # Start screen with hi-score preview
    GameCanvas.vue         # Canvas gameplay: input, game state, loop wiring
    GameOverScreen.vue     # Score display + initials entry flow
    InitialsEntry.vue      # Arcade 3-character initials input
    HighScoreTable.vue     # Top-10 display with highlight
    AudioControls.vue      # Mute/music/sfx toggle buttons
  game/
    constants.js           # All tunable game values
    levels.js              # 10 level definitions + getLevel()
    ball.js                # Ball state factory
    paddle.js              # Paddle state + movement functions
    bricks.js              # Brick grid builder
    collision.js           # AABB circle-rect detection
    physics.js             # Bounce angle, wall/ceiling reflection
    score.js               # Combo multiplier system
    lives.js               # Life management + infinite mode
    powerups.js            # Spawning, falling, paddle catch
    cheat.js               # BIGBOSS key sequence detector
    renderer.js            # All canvas draw calls
    gameLoop.js            # RAF loop, update logic
  audio/
    audioEngine.js         # Web Audio synth engine + music sequencer
  store/
    highScores.js          # localStorage top-10 CRUD
tests/
  collision.test.js
  physics.test.js
  score.test.js
  lives.test.js
  levels.test.js
  bricks.test.js
  highScores.test.js
  cheat.test.js
  smoke.test.js
```

## Where Level Data Lives

`src/game/levels.js` — `LEVELS` array. Each level has:
- `title` and `subtitle` (cliché web-dev text shown on transition screen)
- `rows` — 2D grid where 0 = empty, 1-7 = brick type
- `speedMultiplier` — applied to ball speed for that level

## Where Assets Live

- Fonts: Google Fonts (Press Start 2P) — loaded via CSS import
- Sounds: Generated at runtime via Web Audio API — no audio files
- Graphics: All drawn on Canvas in code — no sprite sheets
- Favicon: `public/favicon.svg`

## Power-ups

Three power-up types drop randomly (12% chance per brick destroyed):

| Label | Effect               |
|-------|----------------------|
| WIDE  | Widens the paddle    |
| SLOW  | Slows all balls      |
| x2    | Spawns a second ball |

## Known Limitations

- Audio requires user interaction before it starts (browser autoplay policy)
- No external image assets — all visuals are code-drawn
- No save/load mid-game (scores only are persisted)
- Multi-ball capped at 3 simultaneous balls

## Possible Next Improvements

- Additional power-up types (laser, shield, magnet paddle)
- Boss-style final level with animated enemy
- Optional CRT/scanline toggle in settings
- Gamepad / controller support
- Score share link
- Accessibility mode (reduced motion, high contrast)
