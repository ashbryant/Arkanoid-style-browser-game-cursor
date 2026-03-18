import { describe, it, expect } from 'vitest'
import { LEVELS, getLevel } from '../src/game/levels.js'

describe('level data', () => {
  it('has at least one level', () => {
    expect(LEVELS.length).toBeGreaterThan(0)
  })

  it('every level has a title and rows', () => {
    LEVELS.forEach(level => {
      expect(typeof level.title).toBe('string')
      expect(level.title.length).toBeGreaterThan(0)
      expect(Array.isArray(level.rows)).toBe(true)
      expect(level.rows.length).toBeGreaterThan(0)
    })
  })

  it('all rows have the same column count', () => {
    LEVELS.forEach(level => {
      const cols = level.rows[0].length
      level.rows.forEach(row => {
        expect(row.length).toBe(cols)
      })
    })
  })

  it('getLevel returns the correct level by index', () => {
    const level = getLevel(0)
    expect(level.id).toBe(1)
  })

  it('getLevel loops after the last level', () => {
    const count = LEVELS.length
    const first = getLevel(0)
    const looped = getLevel(count)
    expect(looped.id).toBe(first.id)
  })

  it('looped levels have higher speedMultiplier', () => {
    const count = LEVELS.length
    const base = getLevel(0)
    const looped = getLevel(count)
    expect(looped.speedMultiplier).toBeGreaterThan(base.speedMultiplier)
  })

  it('all levels have a speedMultiplier >= 1.0', () => {
    LEVELS.forEach(level => {
      expect(level.speedMultiplier).toBeGreaterThanOrEqual(1.0)
    })
  })
})
