// =====================================================
// WEBANOID — Physics / Bounce Calculations
// Pure functions — no side effects, fully testable.
//
// Ball bounce angle logic:
//   Where on the paddle the ball hits determines angle.
//   Left edge → angled left, right edge → angled right.
//   Centre → straight up.
//   This gives the player directional control.
// =====================================================

import { BOUNCE_ANGLE_MAX, CANVAS_W } from './constants.js'

/**
 * Calculate new ball velocity after paddle bounce.
 * @param {number} ballX    - ball centre x
 * @param {number} paddleX  - paddle left edge x
 * @param {number} paddleW  - paddle width
 * @param {number} speed    - current ball speed (magnitude)
 * @returns {{ vx: number, vy: number }}
 */
export function calcPaddleBounce(ballX, paddleX, paddleW, speed) {
  // Relative hit position: 0 = left edge, 1 = right edge, 0.5 = centre
  const relativeHit = (ballX - paddleX) / paddleW
  const clamped = Math.max(0, Math.min(1, relativeHit))

  // Map 0..1 to angle in degrees: left edge → -maxAngle, right edge → +maxAngle
  const angleDeg = (clamped - 0.5) * 2 * BOUNCE_ANGLE_MAX

  // Convert to radians and project onto x/y axes
  const angleRad = (angleDeg * Math.PI) / 180
  const vx = speed * Math.sin(angleRad)
  const vy = -Math.abs(speed * Math.cos(angleRad))  // always upward

  return { vx, vy }
}

/**
 * Reflect a velocity component on axis collision.
 * @param {number} v - velocity component (vx or vy)
 * @returns {number} reflected velocity
 */
export function reflect(v) {
  return -v
}

/**
 * Clamp ball speed between min and max.
 * Called after each speed increment to avoid runaway speeds.
 * @param {number} speed
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clampSpeed(speed, min, max) {
  return Math.min(max, Math.max(min, speed))
}

/**
 * Normalise a velocity vector to a given magnitude.
 * Used after component modifications to preserve speed.
 * @param {number} vx
 * @param {number} vy
 * @param {number} speed
 * @returns {{ vx: number, vy: number }}
 */
export function normaliseVelocity(vx, vy, speed) {
  const magnitude = Math.sqrt(vx * vx + vy * vy)
  if (magnitude === 0) return { vx: 0, vy: -speed }
  return {
    vx: (vx / magnitude) * speed,
    vy: (vy / magnitude) * speed,
  }
}

/**
 * Keep ball from getting stuck in a near-horizontal trajectory.
 * If |vy| is very small, nudge it to ensure vertical progress.
 * @param {number} vy
 * @param {number} speed
 * @returns {number} corrected vy
 */
export function enforceMinVertical(vy, speed) {
  const minVertical = speed * 0.25
  if (Math.abs(vy) < minVertical) {
    return vy < 0 ? -minVertical : minVertical
  }
  return vy
}

/**
 * Wall bounce: reflect vx if ball would leave canvas horizontally.
 * @param {number} x    - ball centre x after movement
 * @param {number} r    - ball radius
 * @param {number} vx   - current vx
 * @param {number} w    - canvas width
 * @returns {{ x: number, vx: number }}
 */
export function wallBounceX(x, r, vx, w) {
  if (x - r < 0) return { x: r, vx: Math.abs(vx) }
  if (x + r > w) return { x: w - r, vx: -Math.abs(vx) }
  return { x, vx }
}

/**
 * Ceiling bounce: reflect vy if ball hits the top wall.
 * @param {number} y    - ball centre y after movement
 * @param {number} r    - ball radius
 * @param {number} vy   - current vy
 * @returns {{ y: number, vy: number }}
 */
export function ceilingBounce(y, r, vy) {
  if (y - r < 0) return { y: r, vy: Math.abs(vy) }
  return { y, vy }
}
