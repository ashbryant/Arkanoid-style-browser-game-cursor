<template>
  <div id="webanoid-app">
    <TitleScreen v-if="screen === 'title'" @start="startGame" />
    <div v-else-if="screen === 'game'" class="game-wrapper">
      <p style="color:#0f0;font-family:monospace;padding:1rem;">
        WEBANOID — game canvas coming in Milestone 3
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TitleScreen from './components/TitleScreen.vue'

const screen = ref('title')

function startGame() {
  screen.value = 'game'
}
</script>
