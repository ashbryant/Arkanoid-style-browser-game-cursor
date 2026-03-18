<template>
  <div id="webanoid-app" class="crt-vignette">

    <!-- Rotate prompt for very small portrait screens -->
    <div v-if="showRotatePrompt" class="rotate-prompt">
      <div>↻</div>
      <div>PLEASE ROTATE YOUR DEVICE</div>
    </div>

    <!-- Title screen -->
    <TitleScreen
      v-else-if="screen === 'title'"
      @start="onStart"
    />

    <!-- Game screen -->
    <div
      v-else-if="screen === 'game' || screen === 'gameover'"
      class="game-shell scanlines"
    >
      <!-- Audio controls always visible during play -->
      <AudioControls class="audio-overlay" />

      <div class="canvas-frame">
        <GameCanvas
          ref="gameCanvasRef"
          :level-index="startLevel"
          @gameover="onGameOver"
          @levelclear="onLevelClear"
          @scoreupdate="onScoreUpdate"
        />

        <!-- Game over overlay rendered inside canvas frame -->
        <GameOverScreen
          v-if="screen === 'gameover'"
          :score="lastScore"
          :level="lastLevel"
          @retry="onRetry"
          @menu="onMenu"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TitleScreen    from './components/TitleScreen.vue'
import GameCanvas     from './components/GameCanvas.vue'
import GameOverScreen from './components/GameOverScreen.vue'
import AudioControls  from './components/AudioControls.vue'
import { resumeAudio, sfx } from './audio/audioEngine.js'

const screen         = ref('title')
const gameCanvasRef  = ref(null)
const startLevel     = ref(0)
const lastScore      = ref(0)
const lastLevel      = ref(1)
const showRotatePrompt = ref(false)

// ---- Portrait / rotate detection ----

function checkOrientation() {
  showRotatePrompt.value = (
    window.innerWidth < 480 &&
    window.innerWidth < window.innerHeight
  )
}

onMounted(() => {
  checkOrientation()
  window.addEventListener('resize', checkOrientation)
  window.addEventListener('orientationchange', checkOrientation)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkOrientation)
  window.removeEventListener('orientationchange', checkOrientation)
})

// ---- Screen transitions ----

function onStart() {
  resumeAudio()
  sfx.menuConfirm()
  startLevel.value = 0
  screen.value = 'game'
}

function onGameOver({ score, level }) {
  lastScore.value = score
  lastLevel.value = level
  screen.value = 'gameover'
}

function onLevelClear({ levelIndex }) {
  // Level progression handled inside GameCanvas — nothing needed here
}

function onScoreUpdate(score) {
  lastScore.value = score
}

function onRetry() {
  sfx.menuConfirm()
  screen.value = 'game'
  if (gameCanvasRef.value) {
    gameCanvasRef.value.resetGame()
  }
}

function onMenu() {
  screen.value = 'title'
}
</script>

<style scoped>
.game-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #050505;
}

.canvas-frame {
  position: relative;
  width: 480px;
  height: 640px;
  border: 2px solid var(--col-border);
  box-shadow:
    0 0 20px rgba(0,255,65,0.2),
    inset 0 0 40px rgba(0,0,0,0.5);
}

.audio-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 30;
}

/* Rotate device prompt */
.rotate-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 100%;
  font-family: var(--font-retro);
  font-size: 8px;
  color: var(--col-accent);
  text-align: center;
  padding: 20px;
}

.rotate-prompt div:first-child {
  font-size: 48px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Mobile: scale canvas to fit viewport */
@media (max-width: 500px) {
  .canvas-frame {
    width: 100vw;
    height: calc(100vw * (640 / 480));
    border-left: none;
    border-right: none;
  }
}

@media (max-height: 650px) and (orientation: landscape) {
  .canvas-frame {
    height: 100vh;
    width: calc(100vh * (480 / 640));
  }
}
</style>
