import { useMemo, useCallback } from 'react'
import { useImmerReducer } from 'use-immer'

import { mergeReducer } from './useMergeReducer'





export default function useValidityReducer (initialState = {}) {
  const validityReducer = useCallback((draftState, action) => {
    const { name, valid, fragment } = action
    if (fragment) {
      return mergeReducer(draftState, fragment)
    }

    if (draftState[name] !== valid) {
      if (typeof valid === 'undefined') {
        delete draftState[name]
      } else {
        draftState[name] = valid
      }
    }

    return undefined
  }, [])

  const [state = {}, dispatch] = useImmerReducer(validityReducer, initialState)

  const isValid = useMemo(() => {
    const validityValues = Object.values(state)
    return Boolean(!validityValues.length || validityValues.filter((entry) => {
      // only "true" and "undefined" are considered valid values
      return entry !== true || typeof entry === 'undefined'
    }).length === 0)
  }, [state])

  return [isValid, dispatch]
}
