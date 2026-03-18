// =====================================================
// WEBANOID — Score and Combo System
// Pure functions; game loop calls these on each event.
// =====================================================

import { SCORE_MULTIPLIER_MAX } from './constants.js'

/**
 * Create a fresh score state object.
 * @returns {Object}
 */
export function createScore() {
  return {
    value: 0,
    combo: 1,          // multiplier increments with consecutive hits
    comboTimer: 0,     // frames until combo resets (reset on miss / new ball)
  }
}

/**
 * Add points for a brick hit.
 * Combo multiplier increases with each consecutive hit.
 * @param {Object} scoreState
 * @param {number} brickScore - base score value of the brick
 * @returns {number} points added this hit
 */
export function addBrickScore(scoreState, brickScore) {
  const points = brickScore * scoreState.combo
  scoreState.value += points
  // Increment combo (capped) and reset timer
  scoreState.combo = Math.min(scoreState.combo + 1, SCORE_MULTIPLIER_MAX)
  scoreState.comboTimer = 180  // ~3 seconds at 60fps
  return points
}

/**
 * Tick combo timer each frame. Resets combo when expired.
 * @param {Object} scoreState
 */
export function tickCombo(scoreState) {
  if (scoreState.comboTimer > 0) {
    scoreState.comboTimer--
    if (scoreState.comboTimer === 0) {
      scoreState.combo = 1
    }
  }
}

/**
 * Reset combo on ball loss or level transition.
 * @param {Object} scoreState
 */
export function resetCombo(scoreState) {
  scoreState.combo = 1
  scoreState.comboTimer = 0
}
