import { useState, useCallback } from 'react'





export default function useFocusState () {
  const [state, setState] = useState(false)



  const onFocus = useCallback(() => {
    setState(true)
  }, [])

  const onBlur = useCallback(() => {
    setState(false)
  }, [])


  return [state, onFocus, onBlur]
}
