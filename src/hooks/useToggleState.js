import { useCallback, useState } from 'react'

export default function useToggleState (initialState = false) {
  const [state, setState] = useState(initialState)

  const toggleState = useCallback((nextState) => {
    setState((curState) => {
      return Boolean(
        typeof nextState === 'function'
          ? (nextState(curState) ?? !curState)
          : (nextState ?? !curState),
      )
    })
  }, [])

  return [state, toggleState]
}
