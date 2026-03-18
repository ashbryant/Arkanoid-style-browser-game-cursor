# WEBANOID

> A retro arcade brick-breaker in the spirit of Arkanoid (1986)
> Built with Vue 3 + Vite. Destroy the Web. Save the Internet.

---

## Project Overview

Webanoid is a browser-based brick-breaker arcade game. The player controls a paddle to bounce a ball and destroy themed blocks — broken layouts, rogue popups, cookie banners, and other web-design horrors. The visual style targets a 1986 CRT arcade cabinet aesthetic: dark background, bright neon pixels, chunky fonts, high contrast.

## Design Goals

- **Retro first** — gameplay, feel, and visuals reflect 1986 arcade style
- **Web theme second** — brick types, level names, and copy reference web dev clichés
- **Readable code** — small modules, clear naming, useful comments
- **Testable logic** — pure functions for physics, collision, scoring, lives

## Retro and Web-Theme Direction

Level titles use web-dev clichés:
- "Above the Fold", "Make My Logo Bigger", "Works on My Machine"
- "It Looked Fine in Figma", "Quick CSS Fix", "Can You Just..."

Brick types reference fictional parody web components — not real brand logos.

## Tech Stack

| Tool              | Purpose                             |
|-------------------|-------------------------------------|
| Vue 3             | UI, menus, overlays, state          |
| Vite              | Dev server, bundler                 |
| Canvas API        | Gameplay rendering                  |
| Vitest            | Unit + component testing            |
| Vue Test Utils    | Component test helpers              |
| Web Audio API     | Sound effects and music             |
| localStorage      | High score persistence              |

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
npm test         # run all tests once
npm run test:watch  # watch mode
```

## Controls

| Input       | Action                    |
|-------------|---------------------------|
| ← →         | Move paddle               |
| Space       | Launch ball / confirm     |
| Escape      | Pause / resume            |
| M           | Toggle master mute        |
| Mouse move  | Move paddle               |
| Click       | Launch ball / confirm     |
| Touch drag  | Move paddle               |
| Touch tap   | Launch ball / confirm     |

## Pause Controls

- **Keyboard:** Escape key
- **Mouse:** Click the pause button (top-right of game area)
- **Touch:** Tap the pause button (top-right of game area)

When paused, all gameplay halts safely and resumes without breaking ball physics, music state, or input.

## Mobile Behaviour

- Touch drag or direct touch controls the paddle
- Landscape orientation preferred
- Small portrait screens show a rotate-device prompt
- Degrades gracefully on small screens

## Audio Controls

| Control                 | Location          |
|-------------------------|-------------------|
| Master mute (M key)     | Keyboard / HUD    |
| Music toggle            | Settings overlay  |
| SFX toggle              | Settings overlay  |

Audio preferences are saved to localStorage.
Audio starts only after first user interaction (browser autoplay policy).

## High Score Behaviour

- Top 10 scores stored in localStorage under key `webanoid_scores`
- If a new score qualifies, the player is prompted for 3 initials in arcade style
- Scores include: initials, score value, level reached
- Displayed on the title screen and game over screen

## Cheat Behaviour (Developer Notes)

A hidden cheat enables **infinite lives** during gameplay.

> **Cheat code:** Type **BIGBOSS** on the keyboard during gameplay.
> A brief confirmation flash appears on screen when activated.
> This is a developer/tester convenience — not advertised in-game.

To disable the cheat: remove or comment out the handler in `src/game/cheat.js`.

## Project Structure

```
src/
  main.js              # Vue app entry
  App.vue              # Root component, screen routing
  style.css            # Global retro styles
  components/          # Vue UI components
    TitleScreen.vue
    GameCanvas.vue
    PauseOverlay.vue
    HudOverlay.vue
    LevelTransition.vue
    GameOver.vue
    HighScoreTable.vue
    InitialsEntry.vue
    AudioControls.vue
  game/                # Pure game logic modules
    constants.js
    renderer.js
    ball.js
    paddle.js
    bricks.js
    collision.js
    physics.js
    levels.js
    powerups.js
    score.js
    lives.js
    cheat.js
    gameLoop.js
  audio/               # Web Audio API engine
    audioEngine.js
    music.js
  store/               # localStorage helpers
    highScores.js
tests/                 # Vitest test files
  collision.test.js
  physics.test.js
  score.test.js
  lives.test.js
  levels.test.js
  highScores.test.js
  cheat.test.js
  components/
    TitleScreen.test.js
    GameStateTransitions.test.js
```

## Level Data

Level definitions live in `src/game/levels.js`.
Each level exports: title, brick layout grid, background tint, and difficulty multiplier.

## Assets

- Fonts: Google Fonts (Press Start 2P) — loaded via CSS
- Sounds: Generated via Web Audio API — no external audio files
- Graphics: All drawn on Canvas in code — no sprite sheets required
- Favicon: `public/favicon.svg`

## Known Limitations

- Milestone 1: Only title screen and test runner; gameplay not yet present
- Audio requires user interaction before it starts (browser policy)
- No external image assets — all visuals are code-drawn

## Possible Next Improvements

- Additional power-up types (laser, shield, magnet)
- Multiple ball colours per level
- Boss-style final level
- Local leaderboard shareable link
- Gamepad / controller support
- Accessibility mode (reduced motion, high contrast)
