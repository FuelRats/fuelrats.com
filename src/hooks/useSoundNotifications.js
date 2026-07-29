import {
  isAudioReady, playNewCaseSound, playCaseChangeSound, playCaseClosedSound, playCodeRedSound,
} from '~/util/sounds'

import useBoardEvents from './useBoardEvents'


const STORAGE_KEY = 'fr.soundNotifications'

const DEFAULT_SETTINGS = {
  enabled: false,
  newCase: true,
  caseChange: false,
  caseClosed: false,
  volume: 0.5,
}


export function loadSoundSettings () {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}


export function saveSoundSettings (settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Storage unavailable
  }
}


export default function useSoundNotifications () {
  useBoardEvents(({
    newIds, closedIds, changedIds, becameCr, state,
  }) => {
    if (!isAudioReady()) {
      return
    }
    const settings = loadSoundSettings()
    if (!settings.enabled) {
      return
    }

    const { volume } = settings
    let soundPlayed = false

    if (closedIds.length > 0 && settings.caseClosed) {
      playCaseClosedSound(volume)
      soundPlayed = true
    }

    if (newIds.length > 0 && !soundPlayed && settings.newCase) {
      const hasNewCr = newIds.some((id) => {
        return state.rescues?.[id]?.attributes?.codeRed
      })
      if (hasNewCr) {
        playCodeRedSound(volume)
      } else {
        playNewCaseSound(volume)
      }
      soundPlayed = true
    }

    if (!soundPlayed && settings.caseChange) {
      if (becameCr.length > 0) {
        playCodeRedSound(volume)
        soundPlayed = true
      } else if (changedIds.length > 0) {
        playCaseChangeSound(volume)
        soundPlayed = true
      }
    }
  })
}
