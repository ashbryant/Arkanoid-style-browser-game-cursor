// =====================================================
// WEBANOID — Level Definitions
// Each level has a cliché web-dev title, a brick grid,
// and difficulty modifiers.
//
// Grid key:
//   0 = empty
//   1 = <div> block (cyan, 1hp)
//   2 = POPUP block (orange, 1hp)
//   3 = !cookie block (pink, 1hp)
//   4 = CMS block (gold, 2hp)
//   5 = WIDGET block (lime, 2hp)
//   6 = 404 block (purple, 1hp)
//   7 = HEAVY block (grey, 3hp)
// =====================================================

export const LEVELS = [
  {
    id: 1,
    title: 'Above the Fold',
    subtitle: 'Everything important is right here. Trust me.',
    speedMultiplier: 1.0,
    rows: [
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 3, 3, 3, 3, 3, 3, 1, 1],
      [0, 1, 1, 2, 2, 2, 2, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    ],
  },
  {
    id: 2,
    title: 'Make My Logo Bigger',
    subtitle: 'Just a little bit. No, bigger. BIGGER.',
    speedMultiplier: 1.1,
    rows: [
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 0, 1, 1, 1, 1, 1, 1, 0, 4],
      [4, 0, 1, 2, 2, 2, 2, 1, 0, 4],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 4],
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    ],
  },
  {
    id: 3,
    title: 'Works on My Machine',
    subtitle: "Shipping it. It's your browser's problem now.",
    speedMultiplier: 1.2,
    rows: [
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
      [3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
      [0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
      [5, 0, 5, 0, 5, 0, 5, 0, 5, 0],
      [0, 6, 0, 6, 0, 6, 0, 6, 0, 6],
    ],
  },
  {
    id: 4,
    title: 'It Looked Fine in Figma',
    subtitle: 'Figma lies. It always lies.',
    speedMultiplier: 1.3,
    rows: [
      [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
      [1, 2, 3, 4, 5, 6, 1, 2, 3, 4],
      [4, 3, 2, 1, 6, 5, 4, 3, 2, 1],
      [7, 0, 0, 7, 0, 0, 7, 0, 0, 7],
      [1, 1, 0, 2, 2, 0, 3, 3, 0, 4],
      [0, 5, 5, 0, 6, 6, 0, 1, 1, 0],
    ],
  },
  {
    id: 5,
    title: 'Quick CSS Fix',
    subtitle: 'One line. I promise. (4 hours later...)',
    speedMultiplier: 1.4,
    rows: [
      [3, 3, 3, 7, 7, 7, 7, 3, 3, 3],
      [3, 0, 0, 0, 7, 7, 0, 0, 0, 3],
      [3, 0, 4, 4, 0, 0, 4, 4, 0, 3],
      [3, 0, 4, 5, 5, 5, 5, 4, 0, 3],
      [3, 0, 0, 5, 0, 0, 5, 0, 0, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    ],
  },
  {
    id: 6,
    title: "Can You Just...",
    subtitle: 'Sure. Just. Completely rebuild it.',
    speedMultiplier: 1.5,
    rows: [
      [2, 2, 4, 4, 7, 7, 4, 4, 2, 2],
      [2, 4, 0, 7, 0, 0, 7, 0, 4, 2],
      [4, 0, 7, 0, 1, 1, 0, 7, 0, 4],
      [4, 0, 7, 0, 1, 1, 0, 7, 0, 4],
      [2, 4, 0, 7, 0, 0, 7, 0, 4, 2],
      [2, 2, 4, 4, 7, 7, 4, 4, 2, 2],
    ],
  },
  {
    id: 7,
    title: 'Add More White Space',
    subtitle: 'Breathe. Breathe. Now add a hero section.',
    speedMultiplier: 1.6,
    rows: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 5, 5, 5, 5, 5, 5, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
    ],
  },
  {
    id: 8,
    title: 'Launch It Friday',
    subtitle: 'What could go wrong? (Everything. Everything goes wrong.)',
    speedMultiplier: 1.7,
    rows: [
      [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
      [7, 4, 4, 4, 4, 4, 4, 4, 4, 7],
      [7, 4, 3, 3, 3, 3, 3, 3, 4, 7],
      [7, 4, 3, 2, 2, 2, 2, 3, 4, 7],
      [7, 4, 3, 2, 1, 1, 2, 3, 4, 7],
      [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    ],
  },
  {
    id: 9,
    title: 'Pixel Perfect',
    subtitle: "It's 1 pixel off. I can't sleep.",
    speedMultiplier: 1.85,
    rows: [
      [6, 1, 6, 1, 6, 1, 6, 1, 6, 1],
      [1, 6, 1, 6, 1, 6, 1, 6, 1, 6],
      [6, 1, 7, 1, 6, 1, 7, 1, 6, 1],
      [1, 6, 1, 7, 1, 7, 1, 6, 1, 6],
      [6, 1, 6, 1, 7, 7, 1, 6, 1, 6],
      [1, 6, 1, 6, 1, 6, 1, 6, 1, 6],
    ],
  },
  {
    id: 10,
    title: 'Final Final V2',
    subtitle: 'FINAL_FINAL_v3_ACTUAL_REAL_FINAL.psd',
    speedMultiplier: 2.0,
    rows: [
      [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
      [7, 6, 5, 4, 3, 3, 4, 5, 6, 7],
      [7, 5, 4, 3, 2, 2, 3, 4, 5, 7],
      [7, 4, 3, 2, 1, 1, 2, 3, 4, 7],
      [7, 3, 2, 1, 6, 6, 1, 2, 3, 7],
      [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    ],
  },
]

// After the last level, loop back with increasing speed
export const LEVEL_LOOP_START = 0
export const LEVEL_LOOP_SPEED_BONUS = 0.1  // added per loop iteration

/** Get level by 0-based index, looping with speed increase after last */
export function getLevel(index) {
  const count = LEVELS.length
  const loopIndex = index % count
  const loopIteration = Math.floor(index / count)
  const level = { ...LEVELS[loopIndex] }
  if (loopIteration > 0) {
    level.speedMultiplier = level.speedMultiplier + loopIteration * LEVEL_LOOP_SPEED_BONUS
    level.title = level.title + ' (LOOP ' + (loopIteration + 1) + ')'
  }
  return level
}
