import { describe, it, expect } from 'vitest'
import { buildBricks, allBricksCleared, countActiveBricks } from '../src/game/bricks.js'

const SAMPLE_ROWS = [
  [1, 2, 0],
  [0, 3, 1],
]

describe('buildBricks', () => {
  it('creates a brick for each non-zero cell', () => {
    const bricks = buildBricks(SAMPLE_ROWS)
    expect(bricks.length).toBe(4)  // 1,2,3,1 → 4 bricks
  })

  it('assigns correct type data to bricks', () => {
    const bricks = buildBricks(SAMPLE_ROWS)
    const firstBrick = bricks[0]
    expect(firstBrick.typeId).toBe(1)
    expect(typeof firstBrick.color).toBe('string')
    expect(firstBrick.hp).toBeGreaterThan(0)
  })

  it('sets x/y positions based on grid index', () => {
    const bricks = buildBricks([[1, 0, 1]])
    expect(bricks[0].x).toBeLessThan(bricks[1].x)
  })

  it('ignores empty (0) cells', () => {
    const bricks = buildBricks([[0, 0, 0]])
    expect(bricks.length).toBe(0)
  })
})

describe('allBricksCleared', () => {
  it('returns true when all bricks have hp 0', () => {
    const bricks = [{ hp: 0 }, { hp: 0 }]
    expect(allBricksCleared(bricks)).toBe(true)
  })

  it('returns false when any brick has hp > 0', () => {
    const bricks = [{ hp: 0 }, { hp: 1 }]
    expect(allBricksCleared(bricks)).toBe(false)
  })
})

describe('countActiveBricks', () => {
  it('counts only bricks with hp > 0', () => {
    const bricks = [{ hp: 1 }, { hp: 0 }, { hp: 2 }]
    expect(countActiveBricks(bricks)).toBe(2)
  })
})
