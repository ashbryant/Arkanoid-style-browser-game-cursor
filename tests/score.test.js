import { describe, it, expect } from 'vitest'
import { createScore, addBrickScore, tickCombo, resetCombo } from '../src/game/score.js'
import { SCORE_MULTIPLIER_MAX } from '../src/game/constants.js'

describe('score system', () => {
  it('initialises at zero', () => {
    const s = createScore()
    expect(s.value).toBe(0)
    expect(s.combo).toBe(1)
  })

  it('adds basic score', () => {
    const s = createScore()
    addBrickScore(s, 10)
    expect(s.value).toBe(10)
  })

  it('increments combo on consecutive hits', () => {
    const s = createScore()
    addBrickScore(s, 10)
    expect(s.combo).toBe(2)
    addBrickScore(s, 10)
    expect(s.combo).toBe(3)
  })

  it('multiplies score by combo', () => {
    const s = createScore()
    addBrickScore(s, 10)  // combo becomes 2
    addBrickScore(s, 10)  // earns 10 * 2 = 20
    expect(s.value).toBe(10 + 20)
  })

  it('caps combo at SCORE_MULTIPLIER_MAX', () => {
    const s = createScore()
    for (let i = 0; i < 20; i++) addBrickScore(s, 1)
    expect(s.combo).toBe(SCORE_MULTIPLIER_MAX)
  })

  it('resets combo when tickCombo runs out', () => {
    const s = createScore()
    addBrickScore(s, 10)
    s.comboTimer = 1
    tickCombo(s)
    tickCombo(s)  // timer hits zero, combo resets
    expect(s.combo).toBe(1)
  })

  it('resetCombo sets combo back to 1 immediately', () => {
    const s = createScore()
    addBrickScore(s, 10)
    resetCombo(s)
    expect(s.combo).toBe(1)
    expect(s.comboTimer).toBe(0)
  })
})
