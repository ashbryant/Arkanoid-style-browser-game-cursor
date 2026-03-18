// =====================================================
// WEBANOID — Collision Detection
// Pure AABB (axis-aligned bounding box) collision tests.
// All functions are pure and side-effect free for testability.
//
// Coordinate system: (0,0) = top-left of canvas.
// Ball is a circle; bricks and paddle are rectangles.
// =====================================================

/**
 * Circle-vs-rectangle AABB collision.
 * Returns true if the circle overlaps the rectangle.
 *
 * @param {number} cx   - circle centre x
 * @param {number} cy   - circle centre y
 * @param {number} r    - circle radius
 * @param {number} rx   - rect left x
 * @param {number} ry   - rect top y
 * @param {number} rw   - rect width
 * @param {number} rh   - rect height
 * @returns {boolean}
 */
export function circleRect(cx, cy, r, rx, ry, rw, rh) {
  // Find the closest point on the rect to the circle centre
  const nearestX = Math.max(rx, Math.min(cx, rx + rw))
  const nearestY = Math.max(ry, Math.min(cy, ry + rh))

  const dx = cx - nearestX
  const dy = cy - nearestY

  return (dx * dx + dy * dy) <= (r * r)
}

/**
 * Determine which face of a rect the circle hit.
 * Used to choose whether to reflect vx or vy.
 *
 * Strategy: compare penetration depth on each axis.
 * The axis with less penetration is where the surface is.
 *
 * @param {number} cx   - circle centre x
 * @param {number} cy   - circle centre y
 * @param {number} r    - circle radius
 * @param {number} rx   - rect left x
 * @param {number} ry   - rect top y
 * @param {number} rw   - rect width
 * @param {number} rh   - rect height
 * @returns {'top' | 'bottom' | 'left' | 'right'}
 */
export function collisionFace(cx, cy, r, rx, ry, rw, rh) {
  const rectCX = rx + rw / 2
  const rectCY = ry + rh / 2

  const dx = cx - rectCX
  const dy = cy - rectCY

  // Half extents including ball radius
  const overlapX = (rw / 2 + r) - Math.abs(dx)
  const overlapY = (rh / 2 + r) - Math.abs(dy)

  if (overlapX < overlapY) {
    return dx < 0 ? 'left' : 'right'
  } else {
    return dy < 0 ? 'top' : 'bottom'
  }
}

/**
 * Test if the ball has gone below the bottom of the canvas.
 * When true, the player loses a life.
 *
 * @param {number} cy       - ball centre y
 * @param {number} r        - ball radius
 * @param {number} canvasH  - canvas height
 * @returns {boolean}
 */
export function ballLost(cy, r, canvasH) {
  return cy - r > canvasH
}

/**
 * Test circle vs paddle rectangle.
 * Convenience wrapper used by the game loop.
 *
 * @param {{ x, y, radius }} ball
 * @param {{ x, y, width, height }} paddle
 * @returns {boolean}
 */
export function ballHitsPaddle(ball, paddle) {
  return circleRect(
    ball.x, ball.y, ball.radius,
    paddle.x, paddle.y, paddle.width, paddle.height
  )
}

/**
 * Test circle vs a single brick rectangle.
 *
 * @param {{ x, y, radius }} ball
 * @param {{ x, y, width, height, hp }} brick
 * @returns {boolean}
 */
export function ballHitsBrick(ball, brick) {
  if (brick.hp <= 0) return false
  return circleRect(
    ball.x, ball.y, ball.radius,
    brick.x, brick.y, brick.width, brick.height
  )
}
