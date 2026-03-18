<template>
  <!-- Arcade-style 3-character initials entry -->
  <div class="initials-screen scanlines">
    <div class="ie-title">NEW HIGH SCORE!</div>
    <div class="ie-score">{{ String(score).padStart(6, '0') }}</div>
    <div class="ie-prompt">ENTER YOUR INITIALS</div>

    <!-- Three character slots -->
    <div class="ie-slots">
      <div
        v-for="(ch, i) in chars"
        :key="i"
        class="ie-slot"
        :class="{ active: activeSlot === i }"
      >
        {{ ch || '_' }}
      </div>
    </div>

    <div class="ie-hint">↑↓ to change · → to confirm · ENTER to submit</div>

    <!-- On-screen keyboard for mobile -->
    <div class="ie-keyboard">
      <button class="ie-btn" @click="prevChar">▲</button>
      <button class="ie-btn" @click="nextChar">▼</button>
      <button class="ie-btn ie-btn-confirm" @click="confirmSlot">→ NEXT</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  score: { type: Number, required: true },
})

const emit = defineEmits(['submit'])

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const chars = ref(['A', 'A', 'A'])
const charIndices = ref([0, 0, 0])
const activeSlot = ref(0)

function prevChar() {
  const i = activeSlot.value
  charIndices.value[i] = (charIndices.value[i] - 1 + CHARS.length) % CHARS.length
  chars.value[i] = CHARS[charIndices.value[i]]
}

function nextChar() {
  const i = activeSlot.value
  charIndices.value[i] = (charIndices.value[i] + 1) % CHARS.length
  chars.value[i] = CHARS[charIndices.value[i]]
}

function confirmSlot() {
  if (activeSlot.value < 2) {
    activeSlot.value++
  } else {
    submit()
  }
}

function submit() {
  emit('submit', chars.value.join(''))
}

function onKey(e) {
  switch (e.code) {
    case 'ArrowUp':    e.preventDefault(); prevChar();    break
    case 'ArrowDown':  e.preventDefault(); nextChar();    break
    case 'ArrowRight':
    case 'Space':
    case 'Tab':
      e.preventDefault(); confirmSlot(); break
    case 'Enter':
      e.preventDefault(); submit(); break
    case 'ArrowLeft':
      if (activeSlot.value > 0) activeSlot.value--
      break
  }
  // Direct letter key press
  if (/^[a-zA-Z]$/.test(e.key)) {
    const i = activeSlot.value
    chars.value[i] = e.key.toUpperCase()
    charIndices.value[i] = CHARS.indexOf(e.key.toUpperCase())
    if (i < 2) activeSlot.value++
    else submit()
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.initials-screen {
  position: absolute;
  inset: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-family: var(--font-retro);
}

.ie-title {
  font-size: 14px;
  color: var(--col-accent4);
  letter-spacing: 3px;
  animation: pulse 0.8s ease-in-out infinite alternate;
}

.ie-score {
  font-size: 20px;
  color: var(--col-accent);
}

.ie-prompt {
  font-size: 8px;
  color: var(--col-accent3);
  letter-spacing: 2px;
}

.ie-slots {
  display: flex;
  gap: 12px;
}

.ie-slot {
  width: 40px;
  height: 50px;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--col-text);
}

.ie-slot.active {
  border-color: var(--col-accent);
  color: var(--col-accent);
  animation: blink 0.5s step-end infinite;
}

.ie-hint {
  font-size: 6px;
  color: var(--col-dimtext);
  text-align: center;
}

.ie-keyboard {
  display: flex;
  gap: 8px;
}

.ie-btn {
  font-family: var(--font-retro);
  font-size: 8px;
  padding: 8px 16px;
  background: #111;
  border: 1px solid var(--col-accent);
  color: var(--col-accent);
  cursor: pointer;
}

.ie-btn:hover { background: rgba(0,255,65,0.1); }

.ie-btn-confirm {
  border-color: var(--col-accent2);
  color: var(--col-accent2);
}

@keyframes pulse {
  from { opacity: 1; }
  to   { opacity: 0.5; }
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
