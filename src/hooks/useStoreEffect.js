import _get from 'lodash/get'
import { useRef, useEffect, useCallback } from 'react'
import { useStore } from 'react-redux'


function getStateAt (getState, path) {
  const state = getState()
  if (path) {
    return _get(state, path)
  }
  return state
}

/**
 * Executes an effect when state changes in redux
 * @param {Function} callback Function to call on update of state
 * @param {any[]} deps dependencies for callback.
 * @param {string?} path Optional state path to listen to changes on
 */
export default function useStoreEffect (callback, deps, path) {
  const { subscribe, getState } = useStore()
  const prevState = useRef()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoCB = useCallback(callback, deps)

  useEffect(() => {
    prevState.current = getStateAt(getState, path)
    const unsubscribe = subscribe(() => {
      const nextState = getStateAt(getState, path)
      if (prevState.current !== nextState) {
        memoCB()
      }

      prevState.current = nextState
    })

    return () => {
      prevState.current = undefined
      unsubscribe()
    }
  }, [getState, memoCB, path, subscribe])
}
