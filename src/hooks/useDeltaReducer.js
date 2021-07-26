import _get from 'lodash/get'
import _set from 'lodash/set'
import _unset from 'lodash/unset'
import { useCallback } from 'react'
import { useImmerReducer } from 'use-immer'

import isEqual from '~/util/isEqual'





export default function useDeltaReducer (initialState) {
  const deltaReducer = useCallback(
    (draft, action) => {
      const { name, value, clear } = action
      if (clear) {
        return {}
      }

      const initialValue = _get(initialState, name)

      if (isEqual(initialValue, value)) {
        _unset(draft, name)
      } else {
        _set(draft, name, value)
      }

      return undefined
    },
    [initialState],
  )


  return useImmerReducer(deltaReducer, {})
}
