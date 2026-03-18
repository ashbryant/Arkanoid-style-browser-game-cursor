import { describe, it, expect } from 'vitest'
import {
  createCheatDetector,
  checkCheat,
  tickCheat,
  isCheatFlashing,
} from '../src/game/cheat.js'

describe('cheat detector — BIGBOSS (infinite lives)', () => {
  it('creates with empty buffer and not activated', () => {
    const d = createCheatDetector()
    expect(d.buffer).toBe('')
    expect(d.activated).toBe(false)
  })

  it('does not trigger on wrong sequence', () => {
    const d = createCheatDetector()
    for (const ch of 'WRONGSEQ') checkCheat(d, ch)
    expect(d.activated).toBe(false)
  })

  it('triggers on correct BIGBOSS sequence', () => {
    const d = createCheatDetector()
    let result = null
    for (const ch of 'BIGBOSS') {
      const r = checkCheat(d, ch)
      if (r) result = r
    }
    expect(result).not.toBeNull()
    expect(result.type).toBe('infinite')
    expect(d.activated).toBe(true)
  })

  it('sets flash timer on activation', () => {
    const d = createCheatDetector()
    for (const ch of 'BIGBOSS') checkCheat(d, ch)
    expect(d.flashTimer).toBeGreaterThan(0)
  })

  it('sets flashMessage on activation', () => {
    const d = createCheatDetector()
    for (const ch of 'BIGBOSS') checkCheat(d, ch)
    expect(typeof d.flashMessage).toBe('string')
    expect(d.flashMessage.length).toBeGreaterThan(0)
  })

  it('clears buffer after activation to prevent re-trigger', () => {
    const d = createCheatDetector()
    for (const ch of 'BIGBOSS') checkCheat(d, ch)
    expect(d.buffer).toBe('')
  })

  it('works case-insensitively', () => {
    const d = createCheatDetector()
    let result = null
    for (const ch of 'bigboss') {
      const r = checkCheat(d, ch)
      if (r) result = r
    }
    expect(result).not.toBeNull()
    expect(result.type).toBe('infinite')
  })

  it('ignores non-letter/digit characters', () => {
    const d = createCheatDetector()
    checkCheat(d, ' ')
    checkCheat(d, '!')
    expect(d.buffer).toBe('')
  })
})

describe('cheat detector — WARP (level select)', () => {
  it('triggers on WARP + digit 1-9', () => {
    for (let digit = 1; digit <= 9; digit++) {
      const d = createCheatDetector()
      let result = null
      for (const ch of `WARP${digit}`) {
        const r = checkCheat(d, ch)
        if (r) result = r
      }
      expect(result).not.toBeNull()
      expect(result.type).toBe('level')
      expect(result.level).toBe(digit)
    }
  })

  it('WARP0 maps to level 10', () => {
    const d = createCheatDetector()
    let result = null
    for (const ch of 'WARP0') {
      const r = checkCheat(d, ch)
      if (r) result = r
    }
    expect(result).not.toBeNull()
    expect(result.type).toBe('level')
    expect(result.level).toBe(10)
  })

  it('sets flash timer on level select', () => {
    const d = createCheatDetector()
    for (const ch of 'WARP3') checkCheat(d, ch)
    expect(d.flashTimer).toBeGreaterThan(0)
  })

  it('sets flashMessage on level select', () => {
    const d = createCheatDetector()
    for (const ch of 'WARP5') checkCheat(d, ch)
    expect(d.flashMessage).toContain('5')
  })

  it('works case-insensitively', () => {
    const d = createCheatDetector()
    let result = null
    for (const ch of 'warp3') {
      const r = checkCheat(d, ch)
      if (r) result = r
    }
    expect(result).not.toBeNull()
    expect(result.type).toBe('level')
  })

  it('does not trigger on WARP without a digit', () => {
    const d = createCheatDetector()
    for (const ch of 'WARP') checkCheat(d, ch)
    expect(d.activated).toBe(false)
    expect(d.flashTimer).toBe(0)
  })
})

describe('cheat detector — shared timer behaviour', () => {
  it('tickCheat decrements flash timer', () => {
    const d = createCheatDetector()
    for (const ch of 'BIGBOSS') checkCheat(d, ch)
    const before = d.flashTimer
    tickCheat(d)
    expect(d.flashTimer).toBe(before - 1)
  })

  it('isCheatFlashing returns false when timer is 0', () => {
    const d = createCheatDetector()
    expect(isCheatFlashing(d)).toBe(false)
  })

  it('isCheatFlashing returns true after activation', () => {
    const d = createCheatDetector()
    for (const ch of 'BIGBOSS') checkCheat(d, ch)
    expect(isCheatFlashing(d)).toBe(true)
  })
})
