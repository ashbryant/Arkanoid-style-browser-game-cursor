// =====================================================
// WEBANOID — Power-up Spawning and Physics
// Power-ups fall from destroyed bricks and can be
// caught by the paddle. Each type has a visual and effect.
// =====================================================

import { POWERUP_SPEED, POWERUP_SIZE, POWERUP_TYPES, CANVAS_H } from './constants.js'

// Colours for each power-up type on the canvas
const POWERUP_COLORS = {
  [POWERUP_TYPES.WIDE_PADDLE]: '#7fff00',
  [POWERUP_TYPES.SLOW_BALL]:   '#00cfff',
  [POWERUP_TYPES.MULTI_BALL]:  '#ff6b00',
}

const POWERUP_LABELS = {
  [POWERUP_TYPES.WIDE_PADDLE]: 'WIDE',
  [POWERUP_TYPES.SLOW_BALL]:   'SLOW',
  [POWERUP_TYPES.MULTI_BALL]:  'x2',
}

// Probability that a brick drop spawns a power-up (0–1)
const DROP_CHANCE = 0.12

const POWERUP_LIST = Object.values(POWERUP_TYPES)

/**
 * Maybe spawn a power-up when a brick is destroyed.
 * @param {number} brickCX - brick centre x
 * @param {number} brickCY - brick centre y
 * @returns {Object|null} power-up object or null
 */
export function maybeSpawnPowerup(brickCX, brickCY) {
  if (Math.random() > DROP_CHANCE) return null

  const type = POWERUP_LIST[Math.floor(Math.random() * POWERUP_LIST.length)]
  return createPowerup(type, brickCX, brickCY)
}

/**
 * Create a power-up object.
 * @param {string} type
 * @param {number} x  - spawn x (centre)
 * @param {number} y  - spawn y (centre)
 * @returns {Object}
 */
export function createPowerup(type, x, y) {
  return {
    type,
    x: x - POWERUP_SIZE / 2,
    y,
    width:  POWERUP_SIZE,
    height: POWERUP_SIZE,
    vy:     POWERUP_SPEED,
    color:  POWERUP_COLORS[type] || '#ffffff',
    label:  POWERUP_LABELS[type] || '?',
    active: true,
  }
}

/**
 * Move all active power-ups downward each frame.
 * Deactivate any that have left the screen.
 * @param {Object[]} powerups
 */
export function tickPowerups(powerups) {
  powerups.forEach(p => {
    if (!p.active) return
    p.y += p.vy
    if (p.y > CANVAS_H + POWERUP_SIZE) {
      p.active = false
    }
  })
}

/**
 * Check if a falling power-up has been caught by the paddle.
 * Uses simple AABB test between power-up and paddle.
 * @param {Object} powerup
 * @param {Object} paddle
 * @returns {boolean}
 */
export function powerupCaughtByPaddle(powerup, paddle) {
  if (!powerup.active) return false
  return !(
    powerup.x + powerup.width  < paddle.x ||
    powerup.x                  > paddle.x + paddle.width ||
    powerup.y + powerup.height < paddle.y ||
    powerup.y                  > paddle.y + paddle.height
  )
}
