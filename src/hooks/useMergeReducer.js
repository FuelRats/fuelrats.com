import { useReducer } from 'react'





export function mergeReducer (state, fragment) {
  const resolvedFragment = typeof fragment === 'function'
    ? fragment(state)
    : (fragment ?? {})

  return {
    ...(state ?? {}),
    ...resolvedFragment,
  }
}

export default function useMergeReducer (initialState) {
  return useReducer(mergeReducer, initialState)
}
