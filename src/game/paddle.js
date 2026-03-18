// =====================================================
// WEBANOID — Paddle State Factory and Movement
// =====================================================

import {
  CANVAS_W, PADDLE_W, PADDLE_H, PADDLE_Y,
  PADDLE_SPEED, PADDLE_MIN_W, PADDLE_MAX_W,
} from './constants.js'

/**
 * Create a fresh paddle object centred on the canvas.
 * @returns {Object} paddle state
 */
export function createPaddle() {
  return {
    x: (CANVAS_W - PADDLE_W) / 2,
    y: PADDLE_Y,
    width: PADDLE_W,
    height: PADDLE_H,
    baseWidth: PADDLE_W,
    // Power-up timer: when > 0, wide-paddle effect is active
    widePowerupTimer: 0,
  }
}

/**
 * Move paddle left or right by keyboard input.
 * Clamps to canvas edges.
 *
 * @param {Object} paddle
 * @param {'left'|'right'} direction
 * @param {number} canvasW
 * @returns {Object} updated paddle (mutates in place)
 */
export function movePaddleByKey(paddle, direction, canvasW = CANVAS_W) {
  if (direction === 'left') {
    paddle.x = Math.max(0, paddle.x - PADDLE_SPEED)
  } else if (direction === 'right') {
    paddle.x = Math.min(canvasW - paddle.width, paddle.x + PADDLE_SPEED)
  }
  return paddle
}

/**
 * Move paddle to follow mouse/touch x position.
 * Centres paddle on pointer; clamps to canvas edges.
 *
 * @param {Object} paddle
 * @param {number} pointerX   - x position of pointer relative to canvas
 * @param {number} canvasW
 * @returns {Object} updated paddle (mutates in place)
 */
export function movePaddleToPointer(paddle, pointerX, canvasW = CANVAS_W) {
  paddle.x = Math.max(0, Math.min(canvasW - paddle.width, pointerX - paddle.width / 2))
  return paddle
}

/**
 * Apply wide-paddle power-up: expand paddle width and start timer.
 * @param {Object} paddle
 * @param {number} durationFrames  - how many frames the effect lasts
 */
export function applyWidePaddle(paddle, durationFrames = 600) {
  paddle.width = Math.min(PADDLE_MAX_W, paddle.baseWidth * 1.75)
  paddle.widePowerupTimer = durationFrames
}

/**
 * Tick the paddle power-up timer each frame.
 * When timer expires, restore original width.
 * @param {Object} paddle
 */
export function tickPaddlePowerup(paddle) {
  if (paddle.widePowerupTimer > 0) {
    paddle.widePowerupTimer--
    if (paddle.widePowerupTimer === 0) {
      paddle.width = paddle.baseWidth
    }
  }
}
