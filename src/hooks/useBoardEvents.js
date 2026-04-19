import { useEffect, useRef } from 'react'
import { useStore } from 'react-redux'

import { selectDispatchBoard } from '~/store/selectors/dispatch'


function snapshotBoard (state, ids) {
  const snapshot = {}
  if (ids) {
    ids.forEach((id) => {
      snapshot[id] = state.rescues?.[id]
    })
  }
  return snapshot
}

function hasAttributeChange (prevRescue, currRescue) {
  const pa = prevRescue.attributes ?? {}
  const ca = currRescue.attributes ?? {}
  return (
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
    || pa.quotes?.length !== ca.quotes?.length
  )
}

function hasRatChange (prevRescue, currRescue) {
  const prevRats = prevRescue.relationships?.rats?.data
  const currRats = currRescue.relationships?.rats?.data
  return prevRats?.length !== currRats?.length
}


/**
 * Subscribes to the Redux store and calls back with board events.
 * @param {Function} callback - Called with { newIds, closedIds, changedIds, becameCr, state }
 */
export default function useBoardEvents (callback) {
  const store = useStore()
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    let prevIds = null
    let prevRescues = {}
    let settled = false

    return store.subscribe(() => {
      const state = store.getState()
      const currentIds = selectDispatchBoard(state)

      if (!settled) {
        if (currentIds?.length > 0) {
          prevIds = currentIds
          prevRescues = snapshotBoard(state, currentIds)
          settled = true
        }
        return
      }

      const idsChanged = currentIds !== prevIds
      const oldIds = prevIds ?? []

      // Quick check: if IDs unchanged, see if any rescue object changed
      if (!idsChanged) {
        let anyChanged = false
        for (const id of currentIds) {
          if (state.rescues?.[id] !== prevRescues[id]) {
            anyChanged = true
            break
          }
        }
        if (!anyChanged) {
          return
        }
      }

      const newIds = idsChanged
        ? currentIds.filter((id) => {
          return !oldIds.includes(id)
        })
        : []

      const closedIds = idsChanged
        ? oldIds.filter((id) => {
          return !currentIds.includes(id)
        })
        : []

      const changedIds = []
      const becameCr = []

      for (const id of currentIds) {
        const prevRescue = prevRescues[id]
        const currRescue = state.rescues?.[id]
        if (!prevRescue || !currRescue || prevRescue === currRescue) {
          continue // eslint-disable-line no-continue -- skip unchanged
        }

        if (currRescue.attributes?.codeRed && !prevRescue.attributes?.codeRed) {
          becameCr.push(id)
        }

        if (hasAttributeChange(prevRescue, currRescue) || hasRatChange(prevRescue, currRescue)) {
          changedIds.push(id)
        }
      }

      if (newIds.length > 0 || closedIds.length > 0 || changedIds.length > 0) {
        callbackRef.current({
          newIds, closedIds, changedIds, becameCr, state,
        })
      }

      prevIds = currentIds
      prevRescues = snapshotBoard(state, currentIds)
    })
  }, [store])
}
