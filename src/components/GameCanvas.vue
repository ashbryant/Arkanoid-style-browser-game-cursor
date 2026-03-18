<template>
  <!-- Canvas wrapper — sized to match logical canvas dimensions -->
  <div
    class="game-canvas-wrapper"
    ref="wrapperRef"
    @mousemove="onMouseMove"
    @click="onCanvasClick"
    @touchmove.prevent="onTouchMove"
    @touchstart.prevent="onTouchStart"
  >
    <canvas
      ref="canvasRef"
      :width="CANVAS_W"
      :height="CANVAS_H"
      class="game-canvas"
    />

    <!-- Pause button overlay (visible during play) -->
    <button
      v-if="!isPaused && !isTransitioning && !isGameOver"
      class="pause-btn"
      @click.stop="togglePause"
      @touchstart.prevent.stop="togglePause"
      title="Pause (Esc)"
    >
      &#9646;&#9646;
    </button>

    <!-- Resume button shown when paused -->
    <button
      v-if="isPaused"
      class="resume-btn"
      @click.stop="togglePause"
      @touchstart.prevent.stop="togglePause"
    >
      &#9654; RESUME
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { CANVAS_W, CANVAS_H, LIVES_START } from '../game/constants.js'
import { getLevel } from '../game/levels.js'
import { buildBricks } from '../game/bricks.js'
import { createBall } from '../game/ball.js'
import { createPaddle } from '../game/paddle.js'
import { createScore } from '../game/score.js'
import { createLives, activateInfiniteLives } from '../game/lives.js'
import { createCheatDetector, checkCheat } from '../game/cheat.js'
import { startLoop, stopLoop } from '../game/gameLoop.js'
import { loadHighScores } from '../store/highScores.js'
import {
  resumeAudio, sfx, startMusic, stopMusic,
  isMusicOn, isSfxOn, isMuted,
  setMasterMute, setMusicOn, setSfxOn,
  getAudioPrefs,
} from '../audio/audioEngine.js'

const emit = defineEmits([
  'gameover',      // { score, level }
  'levelclear',    // { levelIndex }
  'scoreupdate',   // score value
])

const props = defineProps({
  levelIndex: { type: Number, default: 0 },
})

// ---- Refs ----
const canvasRef   = ref(null)
const wrapperRef  = ref(null)
const isPaused    = ref(false)
const isTransitioning = ref(false)
const isGameOver  = ref(false)

// ---- Input state (mutable plain object, read by game loop each frame) ----
const input = reactive({
  left:     false,
  right:    false,
  fire:     false,
  pointerX: null,
})

// ---- Game state (plain object mutated by game loop) ----
let gs = null

function buildGameState(levelIndex) {
  const level = getLevel(levelIndex)
  return {
    bricks:          buildBricks(level.rows),
    paddle:          createPaddle(),
    balls:           [createBall()],
    powerups:        [],
    scoreState:      createScore(),
    livesState:      createLives(),
    cheatDetector:   createCheatDetector(),
    levelIndex,
    levelTitle:      level.title,
    levelSubtitle:   level.subtitle,
    speedMultiplier: level.speedMultiplier,
    paused:          false,
    transitioning:   false,
    transitionCountdown: 3,
    gameOver:        false,
    hiScore:         getHiScore(),
    frameCount:      0,
  }
}

function getHiScore() {
  const scores = loadHighScores()
  return scores.length ? scores[0].score : 0
}

// ---- Transition between levels ----

let transitionTimer = null

function startTransition(nextLevelIndex) {
  isTransitioning.value = true
  gs.transitioning = true
  gs.transitionCountdown = 3

  let countdown = 3
  const tick = () => {
    countdown--
    gs.transitionCountdown = countdown
    if (countdown <= 0) {
      finishTransition(nextLevelIndex)
    } else {
      transitionTimer = setTimeout(tick, 1000)
    }
  }
  transitionTimer = setTimeout(tick, 1000)
}

function finishTransition(nextLevelIndex) {
  // Carry score and lives into the new level
  const prevScore = gs.scoreState
  const prevLives = gs.livesState

  gs = buildGameState(nextLevelIndex)
  gs.scoreState = prevScore
  gs.livesState = prevLives
  gs.transitioning = false
  isTransitioning.value = false
}

// ---- Game loop callbacks ----

const callbacks = {
  onBallLost() {
    sfx.ballLost()
    // Reset ball on paddle after short delay
    setTimeout(() => {
      if (!gs || gs.gameOver) return
      const fresh = createBall(gs.paddle.x, gs.paddle.width)
      gs.balls = [fresh]
    }, 600)
  },

  onGameOver() {
    sfx.gameOver()
    stopMusic()
    isGameOver.value = true
    setTimeout(() => {
      emit('gameover', {
        score: gs.scoreState.value,
        level: gs.levelIndex + 1,
      })
    }, 1500)
  },

  onLevelClear() {
    sfx.levelClear()
    const next = gs.levelIndex + 1
    startTransition(next)
    emit('levelclear', { levelIndex: next })
  },

  onPaddleHit() {
    sfx.paddleHit()
  },

  onBrickHit(brick, pts) {
    if (brick.maxHp > 1 && brick.hp > 0) {
      sfx.brickHitHard()
    } else {
      sfx.brickHit()
    }
    emit('scoreupdate', gs.scoreState.value)
  },
}

// ---- Input handlers ----

function onKeyDown(e) {
  resumeAudio()

  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      e.preventDefault()
      input.left = true
      break
    case 'ArrowRight':
    case 'KeyD':
      e.preventDefault()
      input.right = true
      break
    case 'Space':
    case 'Enter':
      e.preventDefault()
      input.fire = true
      break
    case 'Escape':
      togglePause()
      break
    case 'KeyM':
      setMasterMute(!isMuted())
      break
  }

  // Feed key to cheat detector
  if (gs) {
    const triggered = checkCheat(gs.cheatDetector, e.key)
    if (triggered) {
      activateInfiniteLives(gs.livesState)
      sfx.cheatActivate()
    }
  }
}

function onKeyUp(e) {
  switch (e.code) {
    case 'ArrowLeft': case 'KeyA':  input.left = false;  break
    case 'ArrowRight': case 'KeyD': input.right = false; break
    case 'Space': case 'Enter':     input.fire = false;  break
  }
}

function canvasRelativeX(clientX) {
  if (!canvasRef.value) return null
  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = CANVAS_W / rect.width
  return (clientX - rect.left) * scaleX
}

function onMouseMove(e) {
  resumeAudio()
  input.pointerX = canvasRelativeX(e.clientX)
}

function onCanvasClick() {
  resumeAudio()
  input.fire = true
  setTimeout(() => { input.fire = false }, 50)
}

function onTouchStart(e) {
  resumeAudio()
  if (e.touches.length > 0) {
    input.pointerX = canvasRelativeX(e.touches[0].clientX)
    input.fire = true
    setTimeout(() => { input.fire = false }, 50)
  }
}

function onTouchMove(e) {
  if (e.touches.length > 0) {
    input.pointerX = canvasRelativeX(e.touches[0].clientX)
  }
}

// ---- Pause ----

function togglePause() {
  isPaused.value = !isPaused.value
  gs.paused = isPaused.value
  if (gs.paused) {
    stopMusic()
  } else {
    startMusic()
  }
}

// ---- Mount / unmount ----

onMounted(() => {
  gs = buildGameState(props.levelIndex)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  startLoop(gs, canvasRef.value, input, callbacks)
  startMusic()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  stopLoop()
  stopMusic()
  clearTimeout(transitionTimer)
})

// Allow parent to reset (e.g. new game)
defineExpose({ resetGame() {
  stopLoop()
  gs = buildGameState(0)
  isGameOver.value = false
  isPaused.value = false
  isTransitioning.value = false
  startLoop(gs, canvasRef.value, input, callbacks)
  startMusic()
}})
</script>

<style scoped>
.game-canvas-wrapper {
  position: relative;
  width: var(--canvas-w, 480px);
  height: var(--canvas-h, 640px);
  cursor: none;  /* Hide cursor over play area for immersion */
}

.game-canvas {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Pause button — top right of canvas */
.pause-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0,0,0,0.7);
  border: 1px solid #00ff41;
  color: #00ff41;
  font-family: var(--font-retro);
  font-size: 10px;
  padding: 4px 8px;
  cursor: pointer;
  z-index: 10;
  line-height: 1;
}

.pause-btn:hover { background: rgba(0,255,65,0.15); }

/* Resume button — centred over paused canvas */
.resume-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 40px);
  background: #00ff41;
  border: none;
  color: #000;
  font-family: var(--font-retro);
  font-size: 9px;
  padding: 10px 20px;
  cursor: pointer;
  z-index: 10;
}

.resume-btn:hover { background: #00cfff; }
</style>
