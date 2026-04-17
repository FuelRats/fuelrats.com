/* eslint-disable no-magic-numbers -- audio synthesis parameters are inherently numeric constants */
let audioCtx = null

function getContext () {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ?? window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}


function playTone (frequency, duration, { type = 'sine', volume = 0.3, delay = 0 } = {}) {
  const ctx = getContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(volume, ctx.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime + delay)
  osc.stop(ctx.currentTime + delay + duration + 0.05)
}


/**
 * Bright double-ping then a resolving drop — unmistakable notification.
 * @param volume
 */
export function playNewCaseSound (volume = 0.3) {
  playTone(880, 0.12, { type: 'sine', volume: volume * 1.2, delay: 0 }) // A5 — bright ping
  playTone(880, 0.1, { type: 'sine', volume: volume * 0.8, delay: 0.12 }) // A5 — repeat for emphasis
  playTone(698, 0.2, { type: 'sine', volume: volume * 0.6, delay: 0.24 }) // F5 — settle down
}


/**
 * Soft double-tap — two gentle tones close together, like a quiet knock.
 * @param volume
 */
export function playCaseChangeSound (volume = 0.3) {
  playTone(350, 0.08, { type: 'sine', volume: volume * 0.35, delay: 0 })
  playTone(440, 0.1, { type: 'sine', volume: volume * 0.25, delay: 0.1 })
}


/**
 * Soft marimba-like double knock — warm, low, distinct from the higher-pitched alerts.
 * @param volume
 */
export function playCaseClosedSound (volume = 0.3) {
  playTone(294, 0.12, { type: 'triangle', volume: volume * 0.5, delay: 0 }) // D4
  playTone(262, 0.18, { type: 'triangle', volume: volume * 0.4, delay: 0.13 }) // C4 — settles down
}


/**
 * Urgent alternating two-tone alert.
 * @param volume
 */
export function playCodeRedSound (volume = 0.4) {
  const pattern = [880, 660, 880, 660, 880]
  pattern.forEach((freq, idx) => {
    playTone(freq, 0.12, { type: 'square', volume: volume * 0.5, delay: idx * 0.13 })
  })
}
