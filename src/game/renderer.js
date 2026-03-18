// =====================================================
// WEBANOID — Canvas Renderer
// All draw calls live here. The game loop calls render()
// once per frame with the current game state snapshot.
//
// Coordinate system: (0,0) = top-left of canvas.
// All sizes are in logical canvas pixels (480x640).
// =====================================================

import {
  CANVAS_W, CANVAS_H,
  POWERUP_TYPES,
} from './constants.js'

// ---- Helpers ----

/** Draw a pixel-perfect rectangle (1px border, no anti-alias) */
function drawRect(ctx, x, y, w, h, fillColor, strokeColor, lineWidth = 1) {
  ctx.fillStyle = fillColor
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
  if (strokeColor) {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = lineWidth
    ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w) - 1, Math.round(h) - 1)
  }
}

/** Draw centred text */
function drawText(ctx, text, x, y, font, color, align = 'center') {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  ctx.fillText(text, Math.round(x), Math.round(y))
}

// ---- Background ----

export function drawBackground(ctx) {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Subtle grid lines for retro feel — very dark, not distracting
  ctx.strokeStyle = 'rgba(0,255,65,0.04)'
  ctx.lineWidth = 1
  const step = 32
  for (let x = 0; x < CANVAS_W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke()
  }
  for (let y = 0; y < CANVAS_H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
  }
}

// ---- Bricks ----

export function drawBricks(ctx, bricks) {
  bricks.forEach(brick => {
    if (brick.hp <= 0) return

    // Flash white briefly when hit
    const isFlashing = brick.flashTimer > 0
    const fill = isFlashing ? '#ffffff' : brick.color
    // Darken multi-hp bricks that have taken damage
    const damageFade = brick.maxHp > 1 ? (brick.hp / brick.maxHp) : 1
    const displayFill = isFlashing ? '#ffffff' : shadeColor(brick.color, damageFade)

    drawRect(ctx, brick.x, brick.y, brick.width, brick.height, displayFill, 'rgba(0,0,0,0.6)', 1)

    // Label — small retro font
    const fontSize = brick.width > 36 ? 6 : 5
    ctx.font = `${fontSize}px 'Press Start 2P', monospace`
    ctx.fillStyle = isFlashing ? '#000' : 'rgba(0,0,0,0.8)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      brick.label,
      Math.round(brick.x + brick.width / 2),
      Math.round(brick.y + brick.height / 2)
    )

    // HP pip dots for multi-hp bricks
    if (brick.maxHp > 1) {
      for (let i = 0; i < brick.hp; i++) {
        ctx.fillStyle = '#fff'
        ctx.fillRect(brick.x + brick.width - 6 - i * 5, brick.y + 2, 3, 3)
      }
    }
  })
}

/** Darken/lighten a hex colour by a 0–1 factor */
function shadeColor(hex, factor) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const nr = Math.round(r * (0.4 + 0.6 * factor))
  const ng = Math.round(g * (0.4 + 0.6 * factor))
  const nb = Math.round(b * (0.4 + 0.6 * factor))
  return `rgb(${nr},${ng},${nb})`
}

// ---- Paddle ----

export function drawPaddle(ctx, paddle) {
  const isWide = paddle.widePowerupTimer > 0
  const color = isWide ? '#7fff00' : '#00cfff'
  const glowColor = isWide ? 'rgba(127,255,0,0.4)' : 'rgba(0,207,255,0.3)'

  // Glow halo
  ctx.shadowBlur = 10
  ctx.shadowColor = glowColor

  drawRect(ctx, paddle.x, paddle.y, paddle.width, paddle.height, color, 'rgba(255,255,255,0.3)', 1)

  // Centre pip
  const pipX = paddle.x + paddle.width / 2 - 2
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillRect(Math.round(pipX), Math.round(paddle.y + 3), 4, 6)

  ctx.shadowBlur = 0
  ctx.shadowColor = 'transparent'
}

// ---- Ball ----

export function drawBall(ctx, ball) {
  // Motion trail — fades from current position backwards
  ball.trail.forEach((pos, i) => {
    const alpha = (i / ball.trail.length) * 0.35
    ctx.beginPath()
    ctx.arc(Math.round(pos.x), Math.round(pos.y), ball.radius * 0.6, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0,207,255,${alpha})`
    ctx.fill()
  })

  // Glow
  ctx.shadowBlur = 12
  ctx.shadowColor = '#00cfff'

  // Ball body
  ctx.beginPath()
  ctx.arc(Math.round(ball.x), Math.round(ball.y), ball.radius, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  // Highlight
  ctx.beginPath()
  ctx.arc(Math.round(ball.x - 2), Math.round(ball.y - 2), Math.max(1, ball.radius * 0.3), 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fill()

  ctx.shadowBlur = 0
  ctx.shadowColor = 'transparent'
}

// ---- Power-ups ----

export function drawPowerups(ctx, powerups) {
  powerups.forEach(p => {
    if (!p.active) return

    ctx.shadowBlur = 8
    ctx.shadowColor = p.color

    drawRect(ctx, p.x, p.y, p.width, p.height, p.color, 'rgba(255,255,255,0.5)', 1)

    ctx.font = "6px 'Press Start 2P', monospace"
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(p.label, Math.round(p.x + p.width / 2), Math.round(p.y + p.height / 2))

    ctx.shadowBlur = 0
    ctx.shadowColor = 'transparent'
  })
}

// ---- HUD (top bar: score, level, lives) ----

export function drawHud(ctx, score, level, lives, combo) {
  // Top strip background
  ctx.fillStyle = 'rgba(0,0,0,0.85)'
  ctx.fillRect(0, 0, CANVAS_W, 48)
  ctx.strokeStyle = '#00ff41'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, 48); ctx.lineTo(CANVAS_W, 48); ctx.stroke()

  const font = "8px 'Press Start 2P', monospace"

  // Score
  drawText(ctx, 'SCORE', 8, 14, "6px 'Press Start 2P', monospace", '#00ff41', 'left')
  drawText(ctx, String(score).padStart(6, '0'), 8, 32, font, '#ffffff', 'left')

  // Level
  drawText(ctx, 'LVL', CANVAS_W / 2, 14, "6px 'Press Start 2P', monospace", '#00ff41', 'center')
  drawText(ctx, String(level), CANVAS_W / 2, 32, font, '#ffffff', 'center')

  // Lives
  drawText(ctx, 'LIVES', CANVAS_W - 8, 14, "6px 'Press Start 2P', monospace", '#00ff41', 'right')
  for (let i = 0; i < Math.min(lives, 5); i++) {
    // Mini ball icons for each life
    ctx.beginPath()
    ctx.arc(CANVAS_W - 14 - i * 14, 32, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#00cfff'
    ctx.fill()
  }

  // Combo indicator — shown if combo > 1
  if (combo > 1) {
    drawText(ctx, `x${combo}`, CANVAS_W / 2, 44, "7px 'Press Start 2P', monospace", '#ffd700', 'center')
  }
}

// ---- "Ball on paddle" launch prompt ----

export function drawLaunchPrompt(ctx, frameCount) {
  // Blink every 30 frames
  if (Math.floor(frameCount / 30) % 2 === 0) {
    drawText(
      ctx,
      'SPACE / CLICK TO LAUNCH',
      CANVAS_W / 2,
      CANVAS_H - 20,
      "6px 'Press Start 2P', monospace",
      '#00ff41'
    )
  }
}

// ---- Pause overlay (drawn on canvas) ----

export function drawPauseOverlay(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.65)'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  drawText(ctx, 'PAUSED', CANVAS_W / 2, CANVAS_H / 2 - 20, "20px 'Press Start 2P', monospace", '#00ff41')
  drawText(ctx, 'ESC TO RESUME', CANVAS_W / 2, CANVAS_H / 2 + 20, "8px 'Press Start 2P', monospace", '#ffffff')
}

// ---- Cheat flash notification ----

export function drawCheatFlash(ctx, flashTimer) {
  if (flashTimer <= 0) return
  const alpha = Math.min(1, flashTimer / 30)
  ctx.fillStyle = `rgba(255,0,128,${alpha * 0.15})`
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
  drawText(
    ctx,
    '** INFINITE LIVES **',
    CANVAS_W / 2,
    CANVAS_H / 2,
    "10px 'Press Start 2P', monospace",
    `rgba(255,0,128,${alpha})`
  )
}

// ---- Level transition screen (shown between levels) ----

export function drawLevelTransition(ctx, levelTitle, levelSubtitle, levelNum, countdown) {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  drawText(ctx, `LEVEL ${levelNum}`, CANVAS_W / 2, 200, "14px 'Press Start 2P', monospace", '#00ff41')
  drawText(ctx, levelTitle, CANVAS_W / 2, 260, "10px 'Press Start 2P', monospace", '#00cfff')

  // Subtitle wraps manually (canvas has no word wrap)
  const words = levelSubtitle.split(' ')
  let line = '', y = 310
  words.forEach(word => {
    const test = line ? line + ' ' + word : word
    ctx.font = "6px 'Press Start 2P', monospace"
    if (ctx.measureText(test).width > 380 && line) {
      drawText(ctx, line, CANVAS_W / 2, y, "6px 'Press Start 2P', monospace", '#888888')
      line = word
      y += 18
    } else {
      line = test
    }
  })
  if (line) drawText(ctx, line, CANVAS_W / 2, y, "6px 'Press Start 2P', monospace", '#888888')

  // Countdown
  drawText(
    ctx,
    countdown > 0 ? `GET READY... ${countdown}` : 'GO!',
    CANVAS_W / 2,
    420,
    "8px 'Press Start 2P', monospace",
    '#ff6b00'
  )
}

// ---- Game over screen ----

export function drawGameOver(ctx, score, hiScore) {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  drawText(ctx, 'GAME OVER', CANVAS_W / 2, 200, "20px 'Press Start 2P', monospace", '#ff0080')
  drawText(ctx, `SCORE: ${String(score).padStart(6, '0')}`, CANVAS_W / 2, 280, "10px 'Press Start 2P', monospace", '#ffffff')
  if (hiScore > 0) {
    drawText(ctx, `HI: ${String(hiScore).padStart(6, '0')}`, CANVAS_W / 2, 310, "8px 'Press Start 2P', monospace", '#ffd700')
  }
}

// ---- Main render entry point ----

/**
 * Full frame render. Called by the game loop each RAF tick.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} state  - current game state snapshot
 */
export function render(ctx, state) {
  const {
    bricks, paddle, balls, powerups,
    score, level, lives, combo,
    paused, frameCount,
    cheatFlashTimer,
    transitioning, levelTitle, levelSubtitle, transitionCountdown,
    gameOver, hiScore,
    ballOnPaddle,
  } = state

  drawBackground(ctx)

  if (transitioning) {
    drawLevelTransition(ctx, levelTitle, levelSubtitle, level, transitionCountdown)
    return
  }

  if (gameOver) {
    drawGameOver(ctx, score, hiScore)
    return
  }

  drawBricks(ctx, bricks)
  drawPowerups(ctx, powerups)
  drawPaddle(ctx, paddle)

  balls.forEach(ball => drawBall(ctx, ball))

  if (ballOnPaddle) {
    drawLaunchPrompt(ctx, frameCount)
  }

  drawHud(ctx, score, level, lives, combo)

  if (paused) {
    drawPauseOverlay(ctx)
  }

  drawCheatFlash(ctx, cheatFlashTimer)

  // Tick brick flash timers (renderer owns this cosmetic state)
  bricks.forEach(b => { if (b.flashTimer > 0) b.flashTimer-- })
}
