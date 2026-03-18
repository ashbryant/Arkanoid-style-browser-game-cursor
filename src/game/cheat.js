// =====================================================
// WEBANOID — Hidden Cheat: Infinite Lives
//
// Secret code: type "BIGBOSS" during gameplay (case insensitive).
// Not advertised in-game. Documented here and in README only.
//
// To disable: comment out the keydown listener registration in
// useCheat() or remove the call to useCheat() from GameCanvas.vue.
//
// The cheat state lives in livesState (from lives.js) so it is
// automatically saved through all normal game resets, unless
// the player returns to the title screen (which resets everything).
// =====================================================

const CHEAT_SEQUENCE = 'BIGBOSS'

/**
 * Create a cheat detector state object.
 * Feed keyboard characters into checkCheat() each keydown event.
 * @returns {Object}
 */
export function createCheatDetector() {
  return {
    buffer: '',         // growing key buffer
    activated: false,   // true once cheat fires
    flashTimer: 0,      // frames to show "CHEAT ON" flash
  }
}

/**
 * Process a single key press. Returns true if the cheat sequence was just completed.
 * Keeps only the last N characters where N = sequence length.
 *
 * @param {Object} detector
 * @param {string} key  - e.key (e.g. 'B', 'i', 'g' etc)
 * @returns {boolean} true if the cheat was just activated this call
 */
export function checkCheat(detector, key) {
  // Only track letters
  if (!/^[a-zA-Z]$/.test(key)) return false

  detector.buffer += key.toUpperCase()

  // Keep buffer at most as long as the cheat sequence
  if (detector.buffer.length > CHEAT_SEQUENCE.length) {
    detector.buffer = detector.buffer.slice(-CHEAT_SEQUENCE.length)
  }

  if (detector.buffer === CHEAT_SEQUENCE) {
    detector.activated = true
    detector.flashTimer = 180  // 3 seconds at 60fps
    detector.buffer = ''       // reset so it can't re-trigger immediately
    return true
  }

  return false
}

/**
 * Tick the flash timer each frame.
 * @param {Object} detector
 */
export function tickCheat(detector) {
  if (detector.flashTimer > 0) {
    detector.flashTimer--
  }
}

/**
 * Check if the cheat flash message should be shown.
 * @param {Object} detector
 * @returns {boolean}
 */
export function isCheatFlashing(detector) {
  return detector.flashTimer > 0
}
