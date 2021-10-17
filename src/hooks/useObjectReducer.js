import _get from 'lodash/get'
import _set from 'lodash/set'
import _unset from 'lodash/unset'
import { useImmerReducer } from 'use-immer'

import { mergeReducer } from './useMergeReducer'



const stateReducer = (draft, action) => {
  const { name, value, fragment } = action
  if (fragment) {
    return mergeReducer(draft, fragment)
  }

  const curValue = _get(draft, name)
  if (curValue !== value) {
    if (typeof value === 'undefined') {
      _unset(draft, name)
    } else {
      _set(draft, name, value)
    }
  }
  return undefined
}


export default function useObjectReducer (initialState) {
  return useImmerReducer(stateReducer, initialState)
}
