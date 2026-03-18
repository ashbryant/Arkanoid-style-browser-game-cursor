<template>
  <div class="gameover-screen scanlines">
    <div class="go-title">GAME OVER</div>
    <div class="go-score">{{ String(score).padStart(6, '0') }}</div>

    <!-- Initials entry if new hi-score -->
    <InitialsEntry
      v-if="showInitials"
      :score="score"
      @submit="onInitialsSubmit"
    />

    <!-- High score table -->
    <HighScoreTable
      v-else
      :scores="scores"
      :highlight="newScoreIndex"
    />

    <div class="go-actions">
      <button class="btn-retro" @click="emit('retry')">PLAY AGAIN</button>
      <button class="btn-retro btn-secondary" @click="emit('menu')">MAIN MENU</button>
    </div>

    <div class="go-hint">SPACE or CLICK to play again</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import InitialsEntry from './InitialsEntry.vue'
import HighScoreTable from './HighScoreTable.vue'
import { loadHighScores, saveHighScore, qualifiesForHighScore } from '../store/highScores.js'

const props = defineProps({
  score: { type: Number, required: true },
  level: { type: Number, default: 1 },
})

const emit = defineEmits(['retry', 'menu'])

const showInitials  = ref(false)
const scores        = ref([])
const newScoreIndex = ref(-1)

onMounted(() => {
  scores.value = loadHighScores()
  if (qualifiesForHighScore(props.score)) {
    showInitials.value = true
  }
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => window.removeEventListener('keydown', onKey))

function onInitialsSubmit(initials) {
  const updated = saveHighScore(initials, props.score, props.level)
  scores.value = updated
  newScoreIndex.value = updated.findIndex(e => e.score === props.score && e.initials === initials.toUpperCase().padEnd(3))
  showInitials.value = false
}

function onKey(e) {
  if (showInitials.value) return
  if (e.code === 'Space' || e.code === 'Enter') {
    e.preventDefault()
    emit('retry')
  }
}
</script>

<style scoped>
.gameover-screen {
  position: absolute;
  inset: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-family: var(--font-retro);
}

.go-title {
  font-size: 28px;
  color: var(--col-accent4);
  letter-spacing: 4px;
  text-shadow: 0 0 20px var(--col-accent4);
  animation: titlePulse 1s ease-in-out infinite alternate;
}

.go-score {
  font-size: 18px;
  color: var(--col-accent);
}

.go-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.btn-secondary {
  background: #333;
  color: var(--col-text);
}

.btn-secondary:hover { background: #555; }

.go-hint {
  font-size: 6px;
  color: var(--col-dimtext);
}

@keyframes titlePulse {
  from { opacity: 1; }
  to   { opacity: 0.6; }
}
</style>
