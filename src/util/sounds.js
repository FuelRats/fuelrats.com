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
 * Short attention tone then a resolving drop — like a phone notification.
 */
export function playNewCaseSound (volume = 0.3) {
  playTone(880, 0.1, { type: 'sine', volume, delay: 0 })          // A5 — quick ping
  playTone(698, 0.15, { type: 'sine', volume: volume * 0.7, delay: 0.12 })  // F5 — settle down
}


/**
 * Soft double-tap — two gentle tones close together, like a quiet knock.
 */
export function playCaseChangeSound (volume = 0.3) {
  playTone(350, 0.08, { type: 'sine', volume: volume * 0.35, delay: 0 })
  playTone(440, 0.1, { type: 'sine', volume: volume * 0.25, delay: 0.1 })
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
