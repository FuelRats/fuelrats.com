import { useEffect, useRef } from 'react'
import { useSelector, useStore } from 'react-redux'

import { selectDispatchBoard } from '~/store/selectors/dispatch'
import { playNewCaseSound, playCaseChangeSound, playCodeRedSound } from '~/util/sounds'




const STORAGE_KEY = 'fr.soundNotifications'

const DEFAULT_SETTINGS = {
  enabled: false,
  newCase: true,
  caseChange: true,
  codeRed: true,
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


/**
 * Watches the dispatch board for rescue changes and plays sounds.
 * Reads settings from localStorage so it doesn't need React state.
 */
export default function useSoundNotifications () {
  const store = useStore()
  const rescueIds = useSelector(selectDispatchBoard)
  const prevIdsRef = useRef(null)
  const prevRescuesRef = useRef({})
  const initialLoadRef = useRef(true)

  useEffect(() => {
    const prevIds = prevIdsRef.current
    prevIdsRef.current = rescueIds

    // Skip the first render — we don't want to fire sounds for the initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      // Snapshot current rescue state so we can detect changes later
      if (rescueIds?.length) {
        const state = store.getState()
        const snapshot = {}
        rescueIds.forEach((id) => {
          snapshot[id] = state.rescues?.[id]
        })
        prevRescuesRef.current = snapshot
      }
      return
    }

    if (!prevIds || !rescueIds) {
      return
    }

    const settings = loadSoundSettings()
    if (!settings.enabled) {
      return
    }

    const { volume } = settings
    const state = store.getState()

    // Check for new rescues
    const newIds = rescueIds.filter((id) => { return !prevIds.includes(id) })
    for (const id of newIds) {
      const rescue = state.rescues?.[id]
      if (rescue?.attributes?.codeRed && settings.codeRed) {
        playCodeRedSound(volume)
        break // One sound per update cycle is enough
      } else if (settings.newCase) {
        playNewCaseSound(volume)
        break
      }
    }

    // Check for changes to existing rescues (only if no new-rescue sound played)
    if (newIds.length === 0 && settings.caseChange) {
      for (const id of rescueIds) {
        if (!prevIds.includes(id)) {
          continue
        }
        const prev = prevRescuesRef.current[id]
        const curr = state.rescues?.[id]
        if (!prev || !curr) {
          continue
        }

        // Check if the rescue became code red
        if (curr.attributes?.codeRed && !prev.attributes?.codeRed && settings.codeRed) {
          playCodeRedSound(volume)
          break
        }

        // Check for meaningful attribute changes
        const pa = prev.attributes ?? {}
        const ca = curr.attributes ?? {}
        if (
          pa.status !== ca.status
          || pa.system !== ca.system
          || pa.platform !== ca.platform
          || pa.codeRed !== ca.codeRed
        ) {
          playCaseChangeSound(volume)
          break
        }

        // Check for rat assignment changes
        const prevRats = prev.relationships?.rats?.data
        const currRats = curr.relationships?.rats?.data
        if (prevRats?.length !== currRats?.length) {
          playCaseChangeSound(volume)
          break
        }
      }
    }

    // Snapshot current rescue state for next comparison
    const snapshot = {}
    rescueIds.forEach((id) => {
      snapshot[id] = state.rescues?.[id]
    })
    prevRescuesRef.current = snapshot
  }, [rescueIds, store])
}
