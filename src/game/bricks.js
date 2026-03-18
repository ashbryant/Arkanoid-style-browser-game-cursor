// =====================================================
// WEBANOID — Brick Grid Builder
// Converts a level row definition into a flat array of
// brick objects with screen positions and type data.
// =====================================================

import {
  BRICK_W, BRICK_H, BRICK_PAD,
  BRICK_OFFSET_X, BRICK_OFFSET_Y,
  BRICK_TYPES,
} from './constants.js'

/**
 * Build the brick array for a given level.
 * @param {number[][]} rows   - 2D grid from levels.js (0 = empty, 1-7 = type)
 * @returns {Object[]} array of brick objects
 */
export function buildBricks(rows) {
  const bricks = []

  rows.forEach((row, rowIndex) => {
    row.forEach((typeId, colIndex) => {
      if (typeId === 0) return  // empty cell

      const type = BRICK_TYPES[typeId]
      if (!type) return

      const x = BRICK_OFFSET_X + colIndex * (BRICK_W + BRICK_PAD)
      const y = BRICK_OFFSET_Y + rowIndex * (BRICK_H + BRICK_PAD)

      bricks.push({
        x,
        y,
        width:  BRICK_W,
        height: BRICK_H,
        typeId,
        color:  type.color,
        label:  type.label,
        hp:     type.hp,
        maxHp:  type.hp,
        score:  type.score,
        // flash timer: plays a brief hit-flash animation when struck
        flashTimer: 0,
      })
    })
  })

  return bricks
}

/**
 * Check whether all breakable bricks have been cleared.
 * Bricks with 3hp (heavy blocks) are still breakable — just tough.
 * @param {Object[]} bricks
 * @returns {boolean}
 */
export function allBricksCleared(bricks) {
  return bricks.every(b => b.hp <= 0)
}

/**
 * Count remaining active bricks.
 * @param {Object[]} bricks
 * @returns {number}
 */
export function countActiveBricks(bricks) {
  return bricks.filter(b => b.hp > 0).length
}
