// =====================================================
// WEBANOID — High Score Storage
// Reads/writes top 10 scores to localStorage.
// Key: 'webanoid_scores'
// Format: [{ initials, score, level, date }]
// =====================================================

const STORAGE_KEY = 'webanoid_scores'
const MAX_SCORES = 10

/**
 * Load all stored high scores, sorted descending by score.
 * @returns {Array<{ initials: string, score: number, level: number, date: string }>}
 */
export function loadHighScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

/**
 * Save a new score entry. Keeps only top MAX_SCORES.
 * @param {string} initials  - 3 characters (uppercase)
 * @param {number} score
 * @param {number} level     - level reached
 * @returns {Array} updated scores list
 */
export function saveHighScore(initials, score, level = 1) {
  const scores = loadHighScores()
  const entry = {
    initials: initials.toUpperCase().slice(0, 3).padEnd(3, ' '),
    score,
    level,
    date: new Date().toISOString().slice(0, 10),
  }
  scores.push(entry)
  scores.sort((a, b) => b.score - a.score)
  const trimmed = scores.slice(0, MAX_SCORES)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Storage may be unavailable in some contexts — fail silently
  }
  return trimmed
}

/**
 * Check if a score qualifies for the high score table.
 * @param {number} score
 * @returns {boolean}
 */
export function qualifiesForHighScore(score) {
  if (score <= 0) return false
  const scores = loadHighScores()
  if (scores.length < MAX_SCORES) return true
  return score > scores[scores.length - 1].score
}

/**
 * Clear all stored scores. Used for testing.
 */
export function clearHighScores() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
