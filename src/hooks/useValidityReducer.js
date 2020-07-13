import { useMemo, useCallback } from 'react'
import { useImmerReducer } from 'use-immer'

import { mergeReducer } from './useMergeReducer'





export default function useValidityReducer (initialState = {}) {
  const validityReducer = useCallback((draftState, action) => {
    const { name, valid, fragment } = action
    if (fragment) {
      mergeReducer(draftState, fragment)
    } else if (draftState[name] !== valid) {
      draftState[name] = valid
    }
  }, [])

  const [state = {}, dispatch] = useImmerReducer(validityReducer, initialState)

  const isValid = useMemo(() => {
    const validityValues = Object.values(state)
    return validityValues.length && validityValues.filter((entry) => {
      // only "true" and "undefined" are considered valid values
      return entry !== true || typeof entry === 'undefined'
    }).length === 0
  }, [state])

  return [isValid, dispatch]
}
