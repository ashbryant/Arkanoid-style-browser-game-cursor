// =====================================================
// WEBANOID — Ball State Factory
// Returns a fresh ball object.
// Ball position is set relative to paddle on launch.
// =====================================================

import {
  CANVAS_W, CANVAS_H,
  BALL_RADIUS, BALL_SPEED_INIT,
  PADDLE_Y, PADDLE_W, PADDLE_H,
} from './constants.js'

/**
 * Create a new ball object sitting on the paddle ready to launch.
 * @param {number} paddleX - paddle left edge (to centre ball on paddle)
 * @param {number} paddleW - current paddle width
 * @returns {Object} ball state
 */
export function createBall(paddleX = (CANVAS_W - PADDLE_W) / 2, paddleW = PADDLE_W) {
  return {
    x: paddleX + paddleW / 2,
    y: PADDLE_Y - BALL_RADIUS - 1,
    vx: 2.5,
    vy: -BALL_SPEED_INIT,
    radius: BALL_RADIUS,
    speed: BALL_SPEED_INIT,
    launched: false,  // false = ball is glued to paddle until player acts
    trail: [],        // last N positions for a retro motion trail effect
  }
}

/**
 * Create a second ball for the multi-ball power-up.
 * Launched at a mirrored angle from the primary ball's position.
 * @param {{ x, y, vx, vy, speed, radius }} primaryBall
 * @returns {Object} new ball
 */
export function createExtraBall(primaryBall) {
  return {
    ...createBall(),
    x: primaryBall.x,
    y: primaryBall.y,
    vx: -primaryBall.vx,
    vy: primaryBall.vy,
    speed: primaryBall.speed,
    launched: true,
    trail: [],
  }
}
