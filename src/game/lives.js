// =====================================================
// WEBANOID — Lives Management
// Pure functions; no side effects.
// =====================================================

import { LIVES_START } from './constants.js'

/**
 * Create a fresh lives state object.
 * @returns {Object}
 */
export function createLives() {
  return {
    count: LIVES_START,
    infinite: false,  // set true when the secret cheat is activated
  }
}

/**
 * Lose a life after the ball falls off screen.
 * When infinite mode is active, count stays the same.
 * @param {Object} livesState
 * @returns {Object} updated lives state (mutates in place)
 */
export function loseLife(livesState) {
  if (!livesState.infinite) {
    livesState.count = Math.max(0, livesState.count - 1)
  }
  return livesState
}

/**
 * @param {Object} livesState
 * @returns {boolean} true if the player has no lives left
 */
export function isGameOver(livesState) {
  return livesState.count <= 0 && !livesState.infinite
}

/**
 * Activate infinite lives cheat.
 * @param {Object} livesState
 */
export function activateInfiniteLives(livesState) {
  livesState.infinite = true
}

/**
 * Deactivate infinite lives cheat (for testing or reset).
 * @param {Object} livesState
 */
export function deactivateInfiniteLives(livesState) {
  livesState.infinite = false
}
