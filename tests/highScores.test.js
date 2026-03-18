import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadHighScores,
  saveHighScore,
  qualifiesForHighScore,
  clearHighScores,
} from '../src/store/highScores.js'

// Reset scores before each test
beforeEach(() => {
  clearHighScores()
})

describe('high score storage', () => {
  it('loads an empty array when no scores exist', () => {
    expect(loadHighScores()).toEqual([])
  })

  it('saves and loads a score', () => {
    saveHighScore('AAA', 1000, 1)
    const scores = loadHighScores()
    expect(scores.length).toBe(1)
    expect(scores[0].initials).toBe('AAA')
    expect(scores[0].score).toBe(1000)
  })

  it('keeps scores sorted descending', () => {
    saveHighScore('AAA', 500, 1)
    saveHighScore('BBB', 1500, 2)
    saveHighScore('CCC', 1000, 1)
    const scores = loadHighScores()
    expect(scores[0].score).toBe(1500)
    expect(scores[1].score).toBe(1000)
    expect(scores[2].score).toBe(500)
  })

  it('trims to top 10 entries', () => {
    for (let i = 0; i < 15; i++) {
      saveHighScore('TST', i * 100, 1)
    }
    expect(loadHighScores().length).toBe(10)
  })

  it('pads initials to 3 characters', () => {
    saveHighScore('A', 100, 1)
    const scores = loadHighScores()
    expect(scores[0].initials.length).toBe(3)
  })

  it('converts initials to uppercase', () => {
    saveHighScore('abc', 100, 1)
    const scores = loadHighScores()
    expect(scores[0].initials).toBe('ABC')
  })
})

describe('qualifiesForHighScore', () => {
  it('returns true when table is empty', () => {
    expect(qualifiesForHighScore(100)).toBe(true)
  })

  it('returns true when score is higher than lowest', () => {
    for (let i = 1; i <= 10; i++) {
      saveHighScore('TST', i * 100, 1)
    }
    expect(qualifiesForHighScore(1100)).toBe(true)
  })

  it('returns false when score is too low', () => {
    for (let i = 1; i <= 10; i++) {
      saveHighScore('TST', i * 100, 1)
    }
    // Lowest is 100; score 50 should not qualify
    expect(qualifiesForHighScore(50)).toBe(false)
  })

  it('returns false for score of 0', () => {
    expect(qualifiesForHighScore(0)).toBe(false)
  })
})
