// =====================================================
// WEBANOID — Game Constants
// Central config for all tunable gameplay values.
// Keep tweaks here rather than scattered in logic files.
// =====================================================

export const CANVAS_W = 480
export const CANVAS_H = 640

// Paddle
export const PADDLE_W       = 80
export const PADDLE_H       = 12
export const PADDLE_Y       = CANVAS_H - 48   // distance from bottom
export const PADDLE_SPEED   = 7               // px/frame for keyboard
export const PADDLE_MIN_W   = 48              // widest shrink for power-down
export const PADDLE_MAX_W   = 140             // widest expand for power-up

// Ball
export const BALL_RADIUS    = 7
export const BALL_SPEED_INIT = 4.5            // starting speed (px/frame)
export const BALL_SPEED_MAX  = 9              // cap speed to keep game playable
export const BALL_SPEED_STEP = 0.15           // added per brick hit

// Brick grid
export const BRICK_COLS     = 10
export const BRICK_ROWS     = 6               // rows per level layout chunk
export const BRICK_W        = 42
export const BRICK_H        = 18
export const BRICK_PAD      = 4               // gap between bricks
export const BRICK_OFFSET_X = 12             // left margin for brick grid
export const BRICK_OFFSET_Y = 72             // top margin for brick grid

// Scoring
export const SCORE_PER_BRICK = 10
export const SCORE_MULTIPLIER_MAX = 8        // combo multiplier cap

// Lives
export const LIVES_START    = 3

// Power-up
export const POWERUP_SPEED  = 2              // px/frame falling speed
export const POWERUP_SIZE   = 24

// Physics — bounce angle limits from paddle edges
// Centre hit = straight up; edge hit = max angle
export const BOUNCE_ANGLE_MAX = 70           // degrees from vertical at extreme edge

// Frame rate (RAF target)
export const TARGET_FPS    = 60

// Brick type IDs — map to visual theme and hit points
export const BRICK_TYPES = {
  1: { label: '<div>',    color: '#00cfff', hp: 1, score: 10  },
  2: { label: 'POPUP',    color: '#ff6b00', hp: 1, score: 15  },
  3: { label: '!cookie',  color: '#ff0080', hp: 1, score: 20  },
  4: { label: 'CMS',      color: '#ffd700', hp: 2, score: 30  },
  5: { label: 'WIDGET',   color: '#7fff00', hp: 2, score: 30  },
  6: { label: '404',      color: '#cc66ff', hp: 1, score: 25  },
  7: { label: '■',        color: '#888888', hp: 3, score: 50  },   // unbreakable-looking heavy block
}

// Power-up type IDs
export const POWERUP_TYPES = {
  WIDE_PADDLE: 'wide',
  SLOW_BALL:   'slow',
  MULTI_BALL:  'multi',
}

// Game state names — used by App.vue and gameLoop
export const GAME_STATES = {
  TITLE:          'title',
  PLAYING:        'playing',
  PAUSED:         'paused',
  BALL_LOST:      'ball_lost',
  LEVEL_CLEAR:    'level_clear',
  GAME_OVER:      'game_over',
  HIGH_SCORE:     'high_score',
  TRANSITION:     'transition',
}
