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
 * Two-tone ascending chime — pleasant, non-urgent.
 */
export function playNewCaseSound (volume = 0.3) {
  playTone(523, 0.15, { type: 'sine', volume, delay: 0 })      // C5
  playTone(659, 0.2, { type: 'sine', volume, delay: 0.15 })     // E5
}


/**
 * Rapid series of short clicks — like a mechanical split-flap display.
 */
export function playCaseChangeSound (volume = 0.3) {
  const ticks = 6
  for (let i = 0; i < ticks; i += 1) {
    const delay = i * 0.04
    const tickVolume = volume * (0.4 + (i / ticks) * 0.6)
    playTone(1200 + (i * 100), 0.02, { type: 'triangle', volume: tickVolume, delay })
  }
}


/**
 * Urgent alternating two-tone alert.
 */
export function playCodeRedSound (volume = 0.4) {
  const pattern = [880, 660, 880, 660, 880]
  pattern.forEach((freq, i) => {
    playTone(freq, 0.12, { type: 'square', volume: volume * 0.5, delay: i * 0.13 })
  })
}
