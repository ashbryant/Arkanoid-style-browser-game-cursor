<template>
  <!-- Audio controls HUD strip — shown during gameplay -->
  <div class="audio-controls">
    <button
      class="ac-btn"
      :class="{ active: !masterMute }"
      @click="toggleMute"
      @touchstart.prevent="toggleMute"
      :title="masterMute ? 'Unmute' : 'Mute all'"
    >
      {{ masterMute ? '🔇' : '🔊' }}
    </button>
    <button
      class="ac-btn"
      :class="{ active: musicOn && !masterMute }"
      @click="toggleMusic"
      @touchstart.prevent="toggleMusic"
      title="Toggle music"
    >
      ♫
    </button>
    <button
      class="ac-btn"
      :class="{ active: sfxOn && !masterMute }"
      @click="toggleSfx"
      @touchstart.prevent="toggleSfx"
      title="Toggle SFX"
    >
      ♪
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getAudioPrefs,
  setMasterMute, setMusicOn, setSfxOn,
  toggleMasterMute,
  startMusic, stopMusic,
} from '../audio/audioEngine.js'

const masterMute = ref(false)
const musicOn    = ref(true)
const sfxOn      = ref(true)

function loadPrefs() {
  const p = getAudioPrefs()
  masterMute.value = p.masterMute
  musicOn.value    = p.musicOn
  sfxOn.value      = p.sfxOn
}

function toggleMute() {
  masterMute.value = !masterMute.value
  setMasterMute(masterMute.value)
  if (masterMute.value) stopMusic()
  else if (musicOn.value) startMusic()
}

function toggleMusic() {
  musicOn.value = !musicOn.value
  setMusicOn(musicOn.value)
  if (musicOn.value && !masterMute.value) startMusic()
  else stopMusic()
}

function toggleSfx() {
  sfxOn.value = !sfxOn.value
  setSfxOn(sfxOn.value)
}

onMounted(loadPrefs)
</script>

<style scoped>
.audio-controls {
  position: absolute;
  top: 50px;
  right: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 20;
}

.ac-btn {
  background: rgba(0,0,0,0.8);
  border: 1px solid #333;
  color: #555;
  font-size: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.ac-btn.active {
  border-color: var(--col-accent);
  color: var(--col-accent);
}

.ac-btn:hover { border-color: var(--col-accent3); }
</style>
