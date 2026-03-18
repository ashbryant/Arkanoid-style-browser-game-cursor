<template>
  <div class="hs-table">
    <div class="hs-title">HI-SCORES</div>
    <div
      v-for="(entry, i) in scores"
      :key="i"
      class="hs-row"
      :class="{ highlight: highlight === i }"
    >
      <span class="hs-rank">{{ String(i + 1).padStart(2, '0') }}.</span>
      <span class="hs-initials">{{ entry.initials }}</span>
      <span class="hs-score">{{ String(entry.score).padStart(6, '0') }}</span>
      <span class="hs-level">LV{{ entry.level }}</span>
    </div>
    <div v-if="!scores.length" class="hs-empty">NO SCORES YET</div>
  </div>
</template>

<script setup>
defineProps({
  scores:    { type: Array,  default: () => [] },
  highlight: { type: Number, default: -1 },  // index of newly entered score
})
</script>

<style scoped>
.hs-table {
  font-family: var(--font-retro);
  font-size: 8px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.hs-title {
  color: var(--col-accent);
  font-size: 10px;
  text-align: center;
  margin-bottom: 12px;
  letter-spacing: 3px;
}

.hs-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid rgba(0,255,65,0.1);
  color: var(--col-text);
}

.hs-row.highlight {
  color: var(--col-accent4);
  animation: rowPulse 0.8s ease-in-out infinite alternate;
}

.hs-rank    { color: var(--col-dimtext); width: 20px; }
.hs-initials{ color: var(--col-accent3); width: 30px; letter-spacing: 2px; }
.hs-score   { flex: 1; }
.hs-level   { color: var(--col-dimtext); }

.hs-empty {
  text-align: center;
  color: var(--col-dimtext);
  padding: 12px 0;
}

@keyframes rowPulse {
  from { opacity: 1; }
  to   { opacity: 0.5; }
}
</style>
