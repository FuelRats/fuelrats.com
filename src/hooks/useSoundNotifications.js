import { useEffect, useRef } from 'react'
import { useStore } from 'react-redux'

import { selectDispatchBoard } from '~/store/selectors/dispatch'
import { playNewCaseSound, playCaseChangeSound, playCaseClosedSound, playCodeRedSound } from '~/util/sounds'




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


function snapshotBoard (state, ids) {
  const snapshot = {}
  if (ids) {
    ids.forEach((id) => {
      snapshot[id] = state.rescues?.[id]
    })
  }
  return snapshot
}


/**
 * Watches the dispatch board for rescue changes and plays sounds.
 * Uses store.subscribe() to catch both ID list changes AND attribute
 * changes on existing rescues (e.g. rats assigned via websocket).
 */
export default function useSoundNotifications () {
  const store = useStore()
  const stateRef = useRef({
    ids: null,
    rescues: {},
    settled: false,
  })

  useEffect(() => {
    return store.subscribe(() => {
      const state = store.getState()
      const currentIds = selectDispatchBoard(state)
      const prev = stateRef.current

      // Wait for the board to be populated at least once before comparing.
      // The initial transition from [] → [id1, id2, ...] is the page load,
      // not new rescues arriving.
      if (!prev.settled) {
        if (currentIds?.length > 0) {
          stateRef.current = {
            ids: currentIds,
            rescues: snapshotBoard(state, currentIds),
            settled: true,
          }
        }
        return
      }

      // Nothing to compare if IDs haven't changed and rescue objects are identical
      const prevIds = prev.ids ?? []
      const idsChanged = currentIds !== prevIds

      // Quick check: if IDs haven't changed, see if any rescue object reference changed
      if (!idsChanged) {
        let anyRescueChanged = false
        for (const id of currentIds) {
          if (state.rescues?.[id] !== prev.rescues[id]) {
            anyRescueChanged = true
            break
          }
        }
        if (!anyRescueChanged) {
          return
        }
      }

      const settings = loadSoundSettings()
      if (!settings.enabled) {
        // Still update snapshot so we don't pile up stale diffs
        stateRef.current = {
          ids: currentIds,
          rescues: snapshotBoard(state, currentIds),
          settled: true,
        }
        return
      }

      const { volume } = settings
      let soundPlayed = false

      // Check for closed rescues (removed from board)
      if (idsChanged) {
        const closedIds = prevIds.filter((id) => {
          return !currentIds.includes(id)
        })
        if (closedIds.length > 0 && settings.caseClosed) {
          playCaseClosedSound(volume)
          soundPlayed = true
        }

        // Check for new rescues
        const newIds = currentIds.filter((id) => {
          return !prevIds.includes(id)
        })
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
      }

      // Check for changes to existing rescues
      if (!soundPlayed && settings.caseChange) {
        for (const id of currentIds) {
          const prevRescue = prev.rescues[id]
          const currRescue = state.rescues?.[id]
          if (!prevRescue || !currRescue || prevRescue === currRescue) {
            // eslint-disable-next-line no-continue -- skip unchanged or missing
            continue
          }

          // Case going CR gets the alert sound
          if (currRescue.attributes?.codeRed && !prevRescue.attributes?.codeRed) {
            playCodeRedSound(volume)
            soundPlayed = true
            break
          }

          // Meaningful attribute changes
          const pa = prevRescue.attributes ?? {}
          const ca = currRescue.attributes ?? {}
          if (
            pa.status !== ca.status
            || pa.system !== ca.system
            || pa.platform !== ca.platform
            || pa.expansion !== ca.expansion
            || pa.codeRed !== ca.codeRed
            || pa.carrier !== ca.carrier
            || pa.client !== ca.client
            || pa.clientNick !== ca.clientNick
            || pa.clientLanguage !== ca.clientLanguage
            || pa.outcome !== ca.outcome
            || pa.title !== ca.title
            || pa.notes !== ca.notes
            || pa.quotes !== ca.quotes
          ) {
            playCaseChangeSound(volume)
            soundPlayed = true
            break
          }

          // Rat assignment changes
          const prevRats = prevRescue.relationships?.rats?.data
          const currRats = currRescue.relationships?.rats?.data
          if (prevRats?.length !== currRats?.length) {
            playCaseChangeSound(volume)
            soundPlayed = true
            break
          }
        }
      }

      // Update snapshot
      stateRef.current = {
        ids: currentIds,
        rescues: snapshotBoard(state, currentIds),
        settled: true,
      }
    })
  }, [store])
}
