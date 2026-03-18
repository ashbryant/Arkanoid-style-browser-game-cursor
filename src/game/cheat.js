// =====================================================
// WEBANOID — Hidden Cheats
//
// BIGBOSS  → Infinite lives (type during gameplay)
// WARP1-9  → Jump to level 1-9 (WARP0 = level 10)
//
// Not advertised in-game. See README developer notes.
// To disable: remove the checkCheat() call in GameCanvas.vue.
// =====================================================

const INFINITE_LIVES_CODE = 'BIGBOSS'
const LEVEL_SELECT_PREFIX  = 'WARP'
const BUFFER_MAX           = Math.max(INFINITE_LIVES_CODE.length, LEVEL_SELECT_PREFIX.length + 1)

/**
 * Create a cheat detector state object.
 * @returns {Object}
 */
export function createCheatDetector() {
  return {
    buffer:    '',     // rolling key buffer
    activated: false,  // true once BIGBOSS fires (infinite lives)
    flashTimer: 0,     // frames to show on-screen confirmation
    flashMessage: '',  // message text shown during flash
  }
}

/**
 * Process a single key press and check against all known cheat codes.
 * Returns an object describing the matched cheat, or null if no match yet.
 *
 * Return values:
 *   null                        — no cheat matched this key
 *   { type: 'infinite' }        — BIGBOSS sequence completed
 *   { type: 'level', level: N } — WARP + digit completed (N = 1-10)
 *
 * @param {Object} detector
 * @param {string} key  - e.key value from a keydown event
 * @returns {{ type: string, level?: number } | null}
 */
export function checkCheat(detector, key) {
  // Accept letters and digits only
  if (!/^[a-zA-Z0-9]$/.test(key)) return null

  // Store letters uppercased; digits as-is
  detector.buffer += /\d/.test(key) ? key : key.toUpperCase()

  // Rolling window — only keep the last BUFFER_MAX characters
  if (detector.buffer.length > BUFFER_MAX) {
    detector.buffer = detector.buffer.slice(-BUFFER_MAX)
  }

  // ---- Check BIGBOSS (infinite lives) ----
  if (detector.buffer.endsWith(INFINITE_LIVES_CODE)) {
    detector.activated   = true
    detector.flashTimer  = 180
    detector.flashMessage = '** INFINITE LIVES **'
    detector.buffer = ''
    return { type: 'infinite' }
  }

  // ---- Check WARP + digit (level select) ----
  // e.g. WARP3 → level 3, WARP0 → level 10
  const warpMatch = detector.buffer.match(new RegExp(`${LEVEL_SELECT_PREFIX}([0-9])$`))
  if (warpMatch) {
    const digit = parseInt(warpMatch[1])
    const level = digit === 0 ? 10 : digit   // 0 maps to level 10
    detector.flashTimer   = 120
    detector.flashMessage = `** WARP TO LV${level} **`
    detector.buffer = ''
    return { type: 'level', level }
  }

  return null
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
 * Whether the cheat confirmation flash should currently be shown.
 * @param {Object} detector
 * @returns {boolean}
 */
export function isCheatFlashing(detector) {
  return detector.flashTimer > 0
}
