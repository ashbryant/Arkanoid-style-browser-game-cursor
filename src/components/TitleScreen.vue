<template>
  <!-- Title screen — shown before any game starts or on return to menu -->
  <div class="title-screen scanlines crt-vignette" @click="onClick">

    <!-- Animated logo -->
    <div class="logo-block">
      <div class="logo-sub">INSERT COIN</div>
      <h1 class="logo-title">
        <span class="logo-web">WEB</span><span class="logo-anoid">ANOID</span>
      </h1>
      <div class="logo-tagline">DESTROY THE WEB. SAVE THE INTERNET.</div>
    </div>

    <!-- High score preview -->
    <div class="hiscore-preview">
      <span class="dim">HI-SCORE</span>
      <span class="hs-value">{{ hiScore }}</span>
    </div>

    <!-- Start prompt — blinks via CSS animation -->
    <div class="start-prompt" :class="{ visible: blinkOn }">
      PRESS SPACE OR CLICK TO START
    </div>

    <!-- Controls reminder -->
    <div class="controls-hint">
      <div>← → MOVE &nbsp;|&nbsp; ESC PAUSE &nbsp;|&nbsp; M MUTE</div>
    </div>

    <!-- Audio note -->
    <div class="audio-note dim">SOUND ON FOR FULL EXPERIENCE</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['start'])

// Pull hi-score from localStorage for display
const hiScore = ref(0)
const blinkOn = ref(true)

function loadHiScore() {
  try {
    const scores = JSON.parse(localStorage.getItem('webanoid_scores') || '[]')
    hiScore.value = scores.length ? scores[0].score : 0
  } catch {
    hiScore.value = 0
  }
}

// Keyboard: Space or Enter triggers start
function onKey(e) {
  if (e.code === 'Space' || e.code === 'Enter') {
    e.preventDefault()
    emit('start')
  }
}

// Click anywhere to start
function onClick() {
  emit('start')
}

// Blink interval for the start prompt
let blinkInterval

onMounted(() => {
  loadHiScore()
  window.addEventListener('keydown', onKey)
  blinkInterval = setInterval(() => { blinkOn.value = !blinkOn.value }, 600)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  clearInterval(blinkInterval)
})
</script>

<style scoped>
.title-screen {
  position: relative;
  width: 480px;
  height: 640px;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  border: 2px solid var(--col-border);
  overflow: hidden;
  cursor: pointer;
}

/* ---- Logo ---- */
.logo-block {
  text-align: center;
}

.logo-sub {
  font-family: var(--font-retro);
  font-size: 8px;
  color: var(--col-accent2);
  letter-spacing: 4px;
  margin-bottom: 16px;
  animation: flicker 4s infinite;
}

.logo-title {
  font-family: var(--font-retro);
  font-size: 36px;
  line-height: 1.1;
  margin-bottom: 12px;
  text-shadow:
    0 0 8px var(--col-accent),
    0 0 20px var(--col-accent),
    0 0 40px var(--col-accent3);
}

.logo-web   { color: var(--col-accent3); }
.logo-anoid { color: var(--col-accent);  }

.logo-tagline {
  font-size: 7px;
  color: var(--col-accent2);
  letter-spacing: 2px;
}

/* ---- Hi-score ---- */
.hiscore-preview {
  font-size: 9px;
  display: flex;
  gap: 16px;
  align-items: center;
  color: var(--col-accent4);
}

.hs-value {
  color: var(--col-text);
  font-size: 11px;
}

/* ---- Start prompt ---- */
.start-prompt {
  font-size: 9px;
  color: var(--col-accent);
  letter-spacing: 2px;
  opacity: 0;
  transition: opacity 0.1s;
}

.start-prompt.visible {
  opacity: 1;
}

/* ---- Controls hint ---- */
.controls-hint {
  font-size: 7px;
  color: var(--col-dimtext);
  text-align: center;
  line-height: 2;
}

/* ---- Audio note ---- */
.audio-note {
  font-size: 6px;
  color: var(--col-dimtext);
  position: absolute;
  bottom: 16px;
}

.dim { color: var(--col-dimtext); }

/* Flicker animation for retro feel */
@keyframes flicker {
  0%, 95%, 100% { opacity: 1; }
  96%            { opacity: 0.4; }
  97%            { opacity: 1; }
  98%            { opacity: 0.2; }
  99%            { opacity: 1; }
}
</style>
