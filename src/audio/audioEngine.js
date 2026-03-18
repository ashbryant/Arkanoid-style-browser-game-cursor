// =====================================================
// WEBANOID — Web Audio Engine
// Synthesises retro beeps using the Web Audio API.
// No external audio files — all sound is procedural.
//
// IMPORTANT: Web browsers block audio until user interaction.
// audioEngine.resume() must be called from a user-initiated
// event (click, keydown, touchstart) before any sound plays.
//
// Persistence: mute preferences stored in localStorage
// under key 'webanoid_audio'.
// =====================================================

const STORAGE_KEY = 'webanoid_audio'

let ctx = null   // AudioContext — created lazily after user gesture

// ---- Audio context management ----

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return ctx
}

/**
 * Resume the AudioContext after user interaction.
 * Call this from any click/keydown/touchstart handler.
 */
export function resumeAudio() {
  const c = getCtx()
  if (c.state === 'suspended') {
    c.resume().catch(() => {})
  }
}

// ---- Preferences ----

let prefs = loadPrefs()

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { masterMute: false, musicOn: true, sfxOn: true }
  } catch {
    return { masterMute: false, musicOn: true, sfxOn: true }
  }
}

function savePrefs() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)) } catch {}
}

export function getAudioPrefs()    { return { ...prefs } }
export function isMuted()          { return prefs.masterMute }
export function isMusicOn()        { return prefs.musicOn && !prefs.masterMute }
export function isSfxOn()          { return prefs.sfxOn && !prefs.masterMute }

export function setMasterMute(val) { prefs.masterMute = val; savePrefs(); updateMusic() }
export function setMusicOn(val)    { prefs.musicOn = val;    savePrefs(); updateMusic() }
export function setSfxOn(val)      { prefs.sfxOn = val;      savePrefs() }

export function toggleMasterMute() { setMasterMute(!prefs.masterMute) }

// ---- Basic tone builder ----

/**
 * Play a single synthesised tone.
 * @param {number} freq       Hz
 * @param {number} duration   seconds
 * @param {string} type       oscillator type: 'square'|'sawtooth'|'triangle'|'sine'
 * @param {number} volume     0-1
 * @param {number} delay      seconds (default 0)
 */
function playTone(freq, duration, type = 'square', volume = 0.3, delay = 0) {
  if (!isSfxOn()) return
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)

    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime + delay)

    gain.gain.setValueAtTime(0, c.currentTime + delay)
    gain.gain.linearRampToValueAtTime(volume, c.currentTime + delay + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration)

    osc.start(c.currentTime + delay)
    osc.stop(c.currentTime + delay + duration + 0.01)
  } catch {}
}

// ---- Sound effects ----

export const sfx = {
  paddleHit() {
    // Short high-pitched beep
    playTone(440, 0.06, 'square', 0.25)
  },

  brickHit() {
    // Slightly lower beep
    playTone(330, 0.06, 'square', 0.2)
  },

  brickHitHard() {
    // Multi-hp brick takes a hit — deeper thud
    playTone(220, 0.08, 'sawtooth', 0.2)
  },

  ballLost() {
    // Descending tone
    try {
      const c = getCtx()
      if (!isSfxOn()) return
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.connect(gain); gain.connect(c.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, c.currentTime)
      osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.5)
      gain.gain.setValueAtTime(0.3, c.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5)
      osc.start(); osc.stop(c.currentTime + 0.55)
    } catch {}
  },

  levelClear() {
    // Ascending fanfare — three quick notes
    playTone(440, 0.12, 'square', 0.3, 0)
    playTone(550, 0.12, 'square', 0.3, 0.14)
    playTone(660, 0.20, 'square', 0.3, 0.28)
  },

  gameOver() {
    // Dramatic descent
    playTone(300, 0.2, 'sawtooth', 0.3, 0)
    playTone(200, 0.2, 'sawtooth', 0.3, 0.22)
    playTone(100, 0.4, 'sawtooth', 0.3, 0.44)
  },

  menuConfirm() {
    playTone(660, 0.08, 'square', 0.2, 0)
    playTone(880, 0.12, 'square', 0.2, 0.1)
  },

  powerup() {
    // Ascending sweep
    try {
      const c = getCtx()
      if (!isSfxOn()) return
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.connect(gain); gain.connect(c.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(300, c.currentTime)
      osc.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.3)
      gain.gain.setValueAtTime(0.25, c.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35)
      osc.start(); osc.stop(c.currentTime + 0.4)
    } catch {}
  },

  cheatActivate() {
    // Jingle to acknowledge secret
    playTone(330, 0.08, 'square', 0.3, 0)
    playTone(440, 0.08, 'square', 0.3, 0.1)
    playTone(550, 0.08, 'square', 0.3, 0.2)
    playTone(660, 0.15, 'square', 0.3, 0.3)
  },
}

// ---- Background music sequencer ----
// A simple 8-bit style looping melody using Web Audio API.

let musicNodes = []
let musicTimeout = null
let musicPlaying = false

// Notes: [frequency Hz, duration in beats]
const MELODY = [
  [330, 1], [392, 1], [440, 2],
  [392, 1], [330, 1], [294, 1], [262, 1],
  [294, 1], [330, 2], [330, 1], [294, 0.5], [294, 0.5],
  [330, 1], [392, 1], [440, 1], [494, 1],
  [523, 2], [440, 1], [392, 1],
  [330, 1], [294, 1], [262, 2],
]

const BPM = 180
const BEAT_SECS = 60 / BPM

function scheduleMelody(startTime) {
  if (!isMusicOn()) return
  let t = startTime
  const c = getCtx()

  MELODY.forEach(([freq, beats]) => {
    const dur = beats * BEAT_SECS
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain); gain.connect(c.destination)
    osc.type = 'square'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.08, t)
    gain.gain.setValueAtTime(0.06, t + dur * 0.7)
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.95)
    osc.start(t)
    osc.stop(t + dur)
    musicNodes.push(osc)
    t += dur
  })

  const totalDur = MELODY.reduce((s, [, b]) => s + b * BEAT_SECS, 0)
  // Schedule next loop slightly before end to avoid gap
  musicTimeout = setTimeout(() => {
    if (isMusicOn()) scheduleMelody(c.currentTime)
  }, (totalDur - 0.1) * 1000)
}

export function startMusic() {
  if (musicPlaying || !isMusicOn()) return
  musicPlaying = true
  try {
    const c = getCtx()
    scheduleMelody(c.currentTime)
  } catch {}
}

function updateMusic() {
  if (isMusicOn() && !musicPlaying) {
    startMusic()
  } else if (!isMusicOn() && musicPlaying) {
    stopMusic()
  }
}

export function stopMusic() {
  musicPlaying = false
  clearTimeout(musicTimeout)
  musicNodes.forEach(n => { try { n.stop() } catch {} })
  musicNodes = []
}
