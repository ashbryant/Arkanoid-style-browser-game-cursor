import { describe, it, expect } from 'vitest'
import {
  circleRect,
  collisionFace,
  ballLost,
  ballHitsPaddle,
  ballHitsBrick,
} from '../src/game/collision.js'

describe('circleRect', () => {
  it('detects circle inside rect', () => {
    expect(circleRect(50, 50, 10, 30, 30, 40, 40)).toBe(true)
  })

  it('detects circle touching left edge', () => {
    expect(circleRect(20, 50, 10, 30, 30, 40, 40)).toBe(true)
  })

  it('detects no collision when circle is far away', () => {
    expect(circleRect(200, 200, 5, 30, 30, 40, 40)).toBe(false)
  })

  it('detects no collision when circle is just outside corner', () => {
    // Circle at (25, 25) with r=5; rect at (30, 30). Corner dist = sqrt(50) ≈ 7.07 > 5
    expect(circleRect(25, 25, 5, 30, 30, 40, 40)).toBe(false)
  })

  it('detects circle clearly touching corner', () => {
    // Circle at (24, 24) with r=9; rect at (30,30)
    // Corner distance = sqrt((30-24)^2 + (30-24)^2) ≈ 8.49 < 9 → collision
    expect(circleRect(24, 24, 9, 30, 30, 40, 40)).toBe(true)
  })
})

describe('collisionFace', () => {
  it('identifies top hit when ball comes from above', () => {
    // Ball approaching from above, hitting top face
    const face = collisionFace(50, 28, 7, 30, 30, 40, 20)
    expect(face).toBe('top')
  })

  it('identifies left hit when ball comes from left', () => {
    const face = collisionFace(22, 40, 7, 30, 30, 40, 20)
    expect(face).toBe('left')
  })
})

describe('ballLost', () => {
  it('returns true when ball is below canvas', () => {
    expect(ballLost(650, 7, 640)).toBe(true)
  })

  it('returns false when ball is in play', () => {
    expect(ballLost(600, 7, 640)).toBe(false)
  })
})

describe('ballHitsPaddle', () => {
  it('returns true when ball overlaps paddle', () => {
    const ball   = { x: 240, y: 592, radius: 7 }
    const paddle = { x: 200, y: 588, width: 80, height: 12 }
    expect(ballHitsPaddle(ball, paddle)).toBe(true)
  })

  it('returns false when ball misses paddle', () => {
    const ball   = { x: 400, y: 592, radius: 7 }
    const paddle = { x: 200, y: 588, width: 80, height: 12 }
    expect(ballHitsPaddle(ball, paddle)).toBe(false)
  })
})

describe('ballHitsBrick', () => {
  it('returns false for a dead brick (hp 0)', () => {
    const ball  = { x: 50, y: 80, radius: 7 }
    const brick = { x: 40, y: 72, width: 42, height: 18, hp: 0 }
    expect(ballHitsBrick(ball, brick)).toBe(false)
  })

  it('returns true for an active brick in range', () => {
    const ball  = { x: 50, y: 80, radius: 7 }
    const brick = { x: 40, y: 72, width: 42, height: 18, hp: 1 }
    expect(ballHitsBrick(ball, brick)).toBe(true)
  })
})
