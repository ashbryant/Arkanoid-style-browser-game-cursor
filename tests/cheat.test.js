import { describe, it, expect } from 'vitest'
import {
  createCheatDetector,
  checkCheat,
  tickCheat,
  isCheatFlashing,
} from '../src/game/cheat.js'

describe('cheat detector', () => {
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
    let triggered = false
    for (const ch of 'BIGBOSS') {
      if (checkCheat(d, ch)) triggered = true
    }
    expect(triggered).toBe(true)
    expect(d.activated).toBe(true)
  })

  it('sets flash timer on activation', () => {
    const d = createCheatDetector()
    for (const ch of 'BIGBOSS') checkCheat(d, ch)
    expect(d.flashTimer).toBeGreaterThan(0)
  })

  it('clears buffer after activation to prevent re-trigger', () => {
    const d = createCheatDetector()
    for (const ch of 'BIGBOSS') checkCheat(d, ch)
    expect(d.buffer).toBe('')
  })

  it('works case-insensitively', () => {
    const d = createCheatDetector()
    let triggered = false
    for (const ch of 'bigboss') {
      if (checkCheat(d, ch)) triggered = true
    }
    expect(triggered).toBe(true)
  })

  it('ignores non-letter characters', () => {
    const d = createCheatDetector()
    checkCheat(d, ' ')
    checkCheat(d, '1')
    expect(d.buffer).toBe('')
  })

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

  it('isCheatFlashing returns true when timer > 0', () => {
    const d = createCheatDetector()
    for (const ch of 'BIGBOSS') checkCheat(d, ch)
    expect(isCheatFlashing(d)).toBe(true)
  })
})
