import { describe, it, expect } from 'vitest'
import {
  calcPaddleBounce,
  reflect,
  clampSpeed,
  normaliseVelocity,
  enforceMinVertical,
  wallBounceX,
  ceilingBounce,
} from '../src/game/physics.js'

describe('calcPaddleBounce', () => {
  it('returns upward velocity (vy < 0) on any hit', () => {
    const { vy } = calcPaddleBounce(240, 200, 80, 5)
    expect(vy).toBeLessThan(0)
  })

  it('centre hit produces near-zero vx', () => {
    // Ball hits dead centre of paddle
    const paddle = { x: 200, w: 80 }
    const { vx } = calcPaddleBounce(240, 200, 80, 5)  // 200 + 80/2 = 240
    expect(Math.abs(vx)).toBeLessThan(0.5)
  })

  it('left edge hit produces negative vx (ball goes left)', () => {
    const { vx } = calcPaddleBounce(200, 200, 80, 5)  // at left edge
    expect(vx).toBeLessThan(0)
  })

  it('right edge hit produces positive vx (ball goes right)', () => {
    const { vx } = calcPaddleBounce(280, 200, 80, 5)  // at right edge
    expect(vx).toBeGreaterThan(0)
  })

  it('preserves approximate speed magnitude', () => {
    const speed = 5
    const { vx, vy } = calcPaddleBounce(220, 200, 80, speed)
    const magnitude = Math.sqrt(vx * vx + vy * vy)
    expect(magnitude).toBeCloseTo(speed, 1)
  })
})

describe('reflect', () => {
  it('negates a positive value', () => {
    expect(reflect(5)).toBe(-5)
  })
  it('negates a negative value', () => {
    expect(reflect(-3.5)).toBe(3.5)
  })
})

describe('clampSpeed', () => {
  it('clamps below min', () => {
    expect(clampSpeed(1, 3, 9)).toBe(3)
  })
  it('clamps above max', () => {
    expect(clampSpeed(12, 3, 9)).toBe(9)
  })
  it('passes through in-range value', () => {
    expect(clampSpeed(6, 3, 9)).toBe(6)
  })
})

describe('normaliseVelocity', () => {
  it('produces a vector with the specified magnitude', () => {
    const { vx, vy } = normaliseVelocity(3, 4, 10)
    const mag = Math.sqrt(vx * vx + vy * vy)
    expect(mag).toBeCloseTo(10, 5)
  })

  it('handles zero vector without crashing', () => {
    const { vx, vy } = normaliseVelocity(0, 0, 5)
    expect(vx).toBe(0)
    expect(vy).toBe(-5)
  })
})

describe('enforceMinVertical', () => {
  it('enforces a minimum upward speed', () => {
    const corrected = enforceMinVertical(-0.5, 5)
    expect(Math.abs(corrected)).toBeGreaterThanOrEqual(5 * 0.25)
  })

  it('does not modify vy if already fast enough', () => {
    const corrected = enforceMinVertical(-3, 5)
    expect(corrected).toBe(-3)
  })
})

describe('wallBounceX', () => {
  it('bounces off left wall', () => {
    const { x, vx } = wallBounceX(-3, 7, -4, 480)
    expect(vx).toBeGreaterThan(0)
    expect(x).toBe(7)
  })

  it('bounces off right wall', () => {
    const { x, vx } = wallBounceX(478, 7, 4, 480)
    expect(vx).toBeLessThan(0)
    expect(x).toBe(480 - 7)
  })

  it('no change when in bounds', () => {
    const { x, vx } = wallBounceX(240, 7, 3, 480)
    expect(x).toBe(240)
    expect(vx).toBe(3)
  })
})

describe('ceilingBounce', () => {
  it('bounces off ceiling', () => {
    const { y, vy } = ceilingBounce(-3, 7, -4)
    expect(vy).toBeGreaterThan(0)
    expect(y).toBe(7)
  })

  it('no change when below ceiling', () => {
    const { y, vy } = ceilingBounce(100, 7, -4)
    expect(y).toBe(100)
    expect(vy).toBe(-4)
  })
})
