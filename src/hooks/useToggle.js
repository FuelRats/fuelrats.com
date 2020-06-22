import { useState, useCallback } from 'react'





export default function useToggle (initialState = false) {
  const [state, setState] = useState(Boolean(initialState))

  return [
    state,
    useCallback((newValue = !state) => {
      setState(Boolean(newValue))
    }, [state]),
  ]
}
