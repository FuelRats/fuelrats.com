import _get from 'lodash/get'
import _set from 'lodash/set'
import { useImmerReducer } from 'use-immer'



const stateReducer = (draft, action) => {
  const { name, value } = action
  const curValue = _get(draft, name)

  if (curValue !== value) {
    _set(draft, name, value)
  }
}


export default function useObjectReducer (initialState) {
  return useImmerReducer(stateReducer, initialState)
}
