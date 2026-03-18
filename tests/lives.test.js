import { describe, it, expect } from 'vitest'
import {
  createLives,
  loseLife,
  isGameOver,
  activateInfiniteLives,
  deactivateInfiniteLives,
} from '../src/game/lives.js'
import { LIVES_START } from '../src/game/constants.js'

describe('lives system', () => {
  it('starts with the configured number of lives', () => {
    const l = createLives()
    expect(l.count).toBe(LIVES_START)
  })

  it('decrements count on loseLife', () => {
    const l = createLives()
    loseLife(l)
    expect(l.count).toBe(LIVES_START - 1)
  })

  it('does not go below 0', () => {
    const l = createLives()
    loseLife(l); loseLife(l); loseLife(l); loseLife(l)
    expect(l.count).toBeGreaterThanOrEqual(0)
  })

  it('detects game over when count reaches 0', () => {
    const l = createLives()
    l.count = 0
    expect(isGameOver(l)).toBe(true)
  })

  it('does not call game over when lives remain', () => {
    const l = createLives()
    expect(isGameOver(l)).toBe(false)
  })

  it('does not decrement in infinite mode', () => {
    const l = createLives()
    activateInfiniteLives(l)
    loseLife(l)
    expect(l.count).toBe(LIVES_START)
  })

  it('infinite mode prevents game over', () => {
    const l = createLives()
    l.count = 0
    activateInfiniteLives(l)
    expect(isGameOver(l)).toBe(false)
  })

  it('deactivateInfiniteLives re-enables normal death', () => {
    const l = createLives()
    activateInfiniteLives(l)
    deactivateInfiniteLives(l)
    l.count = 0
    expect(isGameOver(l)).toBe(true)
  })
})
