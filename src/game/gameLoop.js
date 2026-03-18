// =====================================================
// WEBANOID — Main Game Loop
// Uses requestAnimationFrame. This module owns the RAF
// handle and all per-frame update logic.
//
// State is kept in a plain reactive object passed in from
// GameCanvas.vue. The loop reads and mutates it directly.
//
// Flow each frame:
//   1. Skip update if paused or transitioning
//   2. Move paddle (from input state)
//   3. Move ball(s)
//   4. Collision detection: walls, paddle, bricks
//   5. Tick timers (power-ups, cheat, combo)
//   6. Render
//   7. Check win / lose conditions → emit events
// =====================================================

import {
  CANVAS_W, CANVAS_H,
  BALL_SPEED_STEP, BALL_SPEED_MAX, BALL_SPEED_INIT,
  POWERUP_TYPES,
} from './constants.js'
import {
  calcPaddleBounce, wallBounceX, ceilingBounce,
  normaliseVelocity, enforceMinVertical,
} from './physics.js'
import { collisionFace, ballLost, ballHitsPaddle, ballHitsBrick } from './collision.js'
import { addBrickScore, tickCombo, resetCombo } from './score.js'
import { loseLife, isGameOver } from './lives.js'
import { tickPaddlePowerup, movePaddleByKey, movePaddleToPointer, applyWidePaddle } from './paddle.js'
import { createBall, createExtraBall } from './ball.js'
import { maybeSpawnPowerup, tickPowerups, powerupCaughtByPaddle } from './powerups.js'
import { allBricksCleared } from './bricks.js'
import { tickCheat } from './cheat.js'
import { render } from './renderer.js'

const TRAIL_LENGTH = 6   // frames of motion trail on ball

let rafHandle = null

/**
 * Start the game loop.
 *
 * @param {Object}         gsRef     - wrapper: { current: gameState }
 *                                    Use a wrapper so GameCanvas.vue can swap the
 *                                    state object (on level transition / reset) without
 *                                    restarting the loop — the loop always reads gsRef.current.
 * @param {HTMLCanvasElement} canvas
 * @param {Object}         input     - live input state { left, right, pointer, fire }
 * @param {Object}         callbacks - { onBallLost, onLevelClear, onGameOver }
 */
export function startLoop(gsRef, canvas, input, callbacks) {
  const ctx = canvas.getContext('2d')
  let lastTime = performance.now()

  function loop(timestamp) {
    rafHandle = requestAnimationFrame(loop)

    // Cap delta to avoid spiral of death on tab-unfocus
    const delta = Math.min(timestamp - lastTime, 33)
    lastTime = timestamp

    // Always read from gsRef.current so level transitions work
    const gs = gsRef.current
    update(gs, input, callbacks, delta)
    render(ctx, buildRenderState(gs))
  }

  rafHandle = requestAnimationFrame(loop)
}

/** Stop the game loop (e.g. when component unmounts or game ends) */
export function stopLoop() {
  if (rafHandle !== null) {
    cancelAnimationFrame(rafHandle)
    rafHandle = null
  }
}

// ---- Build the render state snapshot ----

function buildRenderState(gs) {
  return {
    bricks:              gs.bricks,
    paddle:              gs.paddle,
    balls:               gs.balls,
    powerups:            gs.powerups,
    score:               gs.scoreState.value,
    level:               gs.levelIndex + 1,
    lives:               gs.livesState.count,
    combo:               gs.scoreState.combo,
    paused:              gs.paused,
    frameCount:          gs.frameCount,
    cheatFlashTimer:     gs.cheatDetector.flashTimer,
    cheatFlashMessage:   gs.cheatDetector.flashMessage,
    transitioning:       gs.transitioning,
    levelTitle:          gs.levelTitle,
    levelSubtitle:       gs.levelSubtitle,
    transitionCountdown: gs.transitionCountdown,
    gameOver:            gs.gameOver,
    hiScore:             gs.hiScore,
    ballOnPaddle:        gs.balls.some(b => !b.launched),
    infiniteLives:       gs.livesState.infinite,
  }
}

// ---- Per-frame update ----

function update(gs, input, callbacks, delta) {
  gs.frameCount++

  // Nothing to do when paused or showing transition
  if (gs.paused || gs.transitioning || gs.gameOver) return

  // 1. Paddle movement
  updatePaddle(gs, input)

  // 2. Ball(s)
  gs.balls.forEach((ball, idx) => {
    updateBall(gs, ball, idx, input, callbacks)
  })

  // Remove dead balls (lost off screen). Keep at least 1 slot.
  const removedBalls = gs.balls.filter(b => b._lost)
  gs.balls = gs.balls.filter(b => !b._lost)

  // If ALL balls are lost, lose a life and reset
  if (gs.balls.length === 0) {
    handleBallLost(gs, callbacks)
    return
  }

  // 3. Tick falling power-ups
  tickPowerups(gs.powerups)
  gs.powerups.forEach(p => {
    if (powerupCaughtByPaddle(p, gs.paddle)) {
      p.active = false
      applyPowerup(gs, p.type)
    }
  })
  gs.powerups = gs.powerups.filter(p => p.active)

  // 4. Tick timers
  tickPaddlePowerup(gs.paddle)
  tickCombo(gs.scoreState)
  tickCheat(gs.cheatDetector)

  // 5. Level clear?
  if (allBricksCleared(gs.bricks)) {
    callbacks.onLevelClear()
  }
}

// ---- Paddle ----

function updatePaddle(gs, input) {
  if (input.left)  movePaddleByKey(gs.paddle, 'left')
  if (input.right) movePaddleByKey(gs.paddle, 'right')

  // Pointer wins over keys if both active — gives smooth mouse/touch feel
  if (input.pointerX !== null) {
    movePaddleToPointer(gs.paddle, input.pointerX)
  }

  // Move un-launched ball with paddle
  gs.balls.forEach(ball => {
    if (!ball.launched) {
      ball.x = gs.paddle.x + gs.paddle.width / 2
      ball.y = gs.paddle.y - ball.radius - 1
    }
  })
}

// ---- Ball update (movement + collisions) ----

function updateBall(gs, ball, ballIdx, input, callbacks) {
  if (!ball.launched) {
    // Ball waiting on paddle — launch on fire input
    if (input.fire) {
      ball.launched = true
      // Don't clear input.fire here — let the key-up / timeout handle it.
      // Clearing it in the loop was causing missed signals when the frame
      // ran faster than the consuming logic expected.
    }
    return
  }

  // Update trail
  ball.trail.push({ x: ball.x, y: ball.y })
  if (ball.trail.length > TRAIL_LENGTH) ball.trail.shift()

  // Move ball
  ball.x += ball.vx
  ball.y += ball.vy

  // Wall bounce (left / right)
  const wallX = wallBounceX(ball.x, ball.radius, ball.vx, CANVAS_W)
  ball.x = wallX.x; ball.vx = wallX.vx

  // Ceiling bounce
  const ceil = ceilingBounce(ball.y, ball.radius, ball.vy)
  ball.y = ceil.y; ball.vy = ceil.vy

  // Bottom — ball lost
  if (ballLost(ball.y, ball.radius, CANVAS_H)) {
    ball._lost = true
    return
  }

  // Paddle collision — only when ball is moving downward (prevents sticking)
  if (ball.vy > 0 && ballHitsPaddle(ball, gs.paddle)) {
    const bounce = calcPaddleBounce(ball.x, gs.paddle.x, gs.paddle.width, ball.speed)
    ball.vx = bounce.vx
    ball.vy = bounce.vy
    // Push ball above paddle to avoid double-hit
    ball.y = gs.paddle.y - ball.radius - 1
    callbacks.onPaddleHit()
  }

  // Brick collisions
  for (let i = 0; i < gs.bricks.length; i++) {
    const brick = gs.bricks[i]
    if (brick.hp <= 0) continue
    if (!ballHitsBrick(ball, brick)) continue

    // Determine which face was hit → reflect correct axis
    const face = collisionFace(ball.x, ball.y, ball.radius, brick.x, brick.y, brick.width, brick.height)
    if (face === 'left' || face === 'right') {
      ball.vx = -ball.vx
    } else {
      ball.vy = -ball.vy
    }

    // Push ball out of brick
    separateBallFromBrick(ball, brick, face)

    // Damage brick
    brick.hp--
    brick.flashTimer = 6   // brief white flash

    // Score
    const pts = addBrickScore(gs.scoreState, brick.score)

    // Speed up ball slightly per hit (capped)
    ball.speed = Math.min(ball.speed + BALL_SPEED_STEP, BALL_SPEED_MAX * gs.speedMultiplier)
    const v = normaliseVelocity(ball.vx, ball.vy, ball.speed)
    ball.vx = v.vx
    ball.vy = enforceMinVertical(v.vy, ball.speed)

    // Maybe drop power-up
    if (brick.hp <= 0) {
      const pu = maybeSpawnPowerup(brick.x + brick.width / 2, brick.y + brick.height / 2)
      if (pu) gs.powerups.push(pu)
    }

    callbacks.onBrickHit(brick, pts)
    break  // Only one brick hit per frame per ball
  }
}

/** Push ball just outside brick face to prevent tunnelling */
function separateBallFromBrick(ball, brick, face) {
  if (face === 'top')    ball.y = brick.y - ball.radius
  if (face === 'bottom') ball.y = brick.y + brick.height + ball.radius
  if (face === 'left')   ball.x = brick.x - ball.radius
  if (face === 'right')  ball.x = brick.x + brick.width + ball.radius
}

// ---- Ball lost ----

function handleBallLost(gs, callbacks) {
  loseLife(gs.livesState)
  resetCombo(gs.scoreState)

  if (isGameOver(gs.livesState)) {
    gs.gameOver = true
    callbacks.onGameOver()
  } else {
    // Immediately restore a ball on the paddle. This is critical —
    // if gs.balls stays empty for multiple frames the loop calls
    // handleBallLost again every frame until lives hit 0 (re-entrancy bug).
    gs.balls = [createBall(gs.paddle.x, gs.paddle.width)]
    callbacks.onBallLost()
  }
}

// ---- Power-up effects ----

function applyPowerup(gs, type) {
  switch (type) {
    case POWERUP_TYPES.WIDE_PADDLE:
      applyWidePaddle(gs.paddle)
      break

    case POWERUP_TYPES.SLOW_BALL:
      // Halve each active ball's speed temporarily
      gs.balls.forEach(ball => {
        ball.speed = Math.max(BALL_SPEED_INIT * 0.7, ball.speed * 0.6)
        const v = normaliseVelocity(ball.vx, ball.vy, ball.speed)
        ball.vx = v.vx; ball.vy = v.vy
      })
      break

    case POWERUP_TYPES.MULTI_BALL:
      // Spawn a second ball from the first active one
      if (gs.balls.length < 3) {
        const primary = gs.balls.find(b => b.launched)
        if (primary) gs.balls.push(createExtraBall(primary))
      }
      break
  }
}
