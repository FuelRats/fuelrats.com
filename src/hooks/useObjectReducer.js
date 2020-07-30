import _get from 'lodash/get'
import _set from 'lodash/set'
import _unset from 'lodash/unset'
import { useImmerReducer } from 'use-immer'



const stateReducer = (draft, action) => {
  const { name, value } = action
  const curValue = _get(draft, name)

  if (curValue !== value) {
    if (typeof value === 'undefined') {
      _unset(draft, name)
    } else {
      _set(draft, name, value)
    }
  }
}


export default function useObjectReducer (initialState) {
  return useImmerReducer(stateReducer, initialState)
}
